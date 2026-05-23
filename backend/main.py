import os
import sys
import pandas as pd
import numpy as np
import unicodedata
import joblib
import tempfile
from pathlib import Path
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma

# 로컬 .env 파일 로드 (보안을 위해 API 키 하드코딩 제거 및 로컬 환경변수 파일 분리)
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"').strip("'")

if not os.environ.get("GOOGLE_API_KEY"):
    print("[⚠️ 경고] GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다. 로컬 .env 파일 또는 시스템 환경 변수를 확인하십시오.")

# --- 0. 다중 환경(로컬/Docker) 모델 경로 동적 바인딩 ---
def get_models_dir() -> Path:
    models_dir = Path(os.environ.get("MODELS_DIR", Path(__file__).parent / "models"))
    if not models_dir.exists():
        # Fallback to local machine absolute path
        models_dir = Path("C:/Users/hason/Desktop/language/python/google/pump-logic-ai/Rotating_Diagnosis/models")
    return models_dir

app = FastAPI(title="Pump Diagnosis RAG Backend")

# React 프론트엔드 포트에서의 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. 고장-원인 매트릭스 데이터 구축 ---
FAILURE_MATRIX = {
    "양정 과다": ["부하과소", "양수량감소", "양수불능", "이상진동", "압력계수값_고"],
    "양정 과소": ["이상진동", "과부하", "압력계수값_저", "진공계수값_고"],
    "임펠러 역회전": ["부하과소", "양수량감소", "양수불능", "압력계수값_저", "진공계수값_저"],
    "회전수 과소": ["부하과소", "양수량감소", "양수불능", "압력계수값_저", "진공계수값_저"],
    "회전수 과다": ["과부하", "진공계수값_약간저"],
    "전압 강하 또는 전기품 고장": ["과부하"],
    "제수밸브 약간 개방": ["기동시부하과다", "부하과소", "양수량감소", "압력계수값_고", "진공계수값_약간저"],
    "패킹누르게 한쪽 조임 또는 과다 조임": ["기동시부하과다", "글랜드패킹과열"],
    "조립 설치 불량 또는 축 중심 불일치": ["기동시부하과다", "양수불능", "베어링과열", "글랜드패킹과열"],
    "회전부 마모 또는 눌러붙음": ["기동시부하과다", "베어링과열"],
    "윤활유 부족 및 베어링장치 상태 나쁨": ["베어링과열"],
    "실링 폐쇄 또는 축봉수 불량": ["양수량감소", "양수불능", "글랜드패킹과열", "진공계수값_저"],
    "흡입관에서 공기 침입": ["부하과소", "양수량감소", "양수불능", "글랜드패킹과열", "이상진동", "만수불능", "압력계수값_불안정", "진공계수값_불안정"],
    "흡입관에 공기주머니 발생": ["양수량감소", "양수불능"],
    "흡입관에 이물질이 걸렸을 때": ["부하과소", "양수량감소", "양수불능", "베어링과열", "이상진동", "압력계수값_저", "진공계수값_고"],
    "송출관에 이물질이 있을 때": ["부하과소", "양수량감소", "양수불능"],
    "라이너링 또는 임펠러 마모": ["양수량감소", "압력계수값_저"]
}

# --- 2. LLM 출력 포맷 스키마 정의 ---
class DiagnosticReport(BaseModel):
    risk_level: str = Field(description="위험도 등급. 반드시 'DANGER', 'WARNING', 'NORMAL' 중 하나여야 하며, 한글이나 괄호를 절대 포함해서는 안 됩니다.")
    risk_rationale: str = Field(description="위험 등급 판정에 대한 상세한 엔지니어링 분석 설명")
    checked_symptoms: List[str] = Field(description="업로드된 데이터셋에서 감지된 이상 현상 리스트")
    root_cause: str = Field(description="표 6.7.9 및 매뉴얼 매칭으로 최종 판단된 고장의 근본 원인")
    recommended_actions: List[str] = Field(description="RAG로 매뉴얼에서 검색한 구체적인 조치 절차 리스트")
    preventive_maintenance: str = Field(description="향후 동일 고장을 예방하기 위한 일상 예방 조치 가이드라인")

# --- 3. 룰 기반 매칭 엔진 함수 ---
def match_symptoms_to_cause(detected_symptoms: List[str]) -> str:
    best_match_cause = "원인 불명 (추가 정밀 진단 요망)"
    max_matches = 0
    
    for cause, symptoms in FAILURE_MATRIX.items():
        matches = len(set(detected_symptoms) & set(symptoms))
        if matches > max_matches:
            max_matches = matches
            best_match_cause = cause
            
    return best_match_cause

# --- 4. RAG 문서 검색 함수 ---
def retrieve_manual_context(query_cause: str) -> str:
    db_dir = "./chroma_db"
    if not os.path.exists(db_dir):
        return "유지보수 매뉴얼 데이터베이스가 아직 비어 있습니다."
        
    embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
    vector_db = Chroma(persist_directory=db_dir, embedding_function=embeddings)
    
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(f"{query_cause} 조치 방법 정비 절차 및 예방 방법")
    
    return "\n\n".join([doc.page_content for doc in docs])

# --- 5. 데이터팀 특징 추출 알고리즘 이식 ---
META_LINES = 9

def _read_signal(file_path: Path) -> pd.DataFrame:
    file_path_str = unicodedata.normalize("NFC", str(file_path))
    df = pd.read_csv(file_path_str, skiprows=META_LINES, header=None)
    df = df.dropna(axis=1, how="all")
    df = df.apply(pd.to_numeric, errors="coerce")
    df = df.dropna(how="all").reset_index(drop=True)
    return df

def _stats(values: np.ndarray, prefix: str) -> dict:
    s = pd.Series(values)
    return {
        f"{prefix}_mean": float(np.mean(values)),
        f"{prefix}_std":  float(np.std(values)),
        f"{prefix}_rms":  float(np.sqrt(np.mean(values ** 2))),
        f"{prefix}_max":  float(np.max(values)),
        f"{prefix}_min":  float(np.min(values)),
        f"{prefix}_ptp":  float(np.ptp(values)),
        f"{prefix}_kurt": float(s.kurt()),
        f"{prefix}_skew": float(s.skew()),
    }

def extract_vibration_features(file_path: Path) -> dict:
    df = _read_signal(file_path)
    if len(df) < 10 or df.shape[1] < 2:
        raise ValueError(f"진동 데이터 형식 오류: shape={df.shape}")
    values = df.iloc[:, 1].values
    return _stats(values, "vib")

def extract_current_features(file_path: Path) -> dict:
    df = _read_signal(file_path)
    if len(df) < 10 or df.shape[1] < 4:
        raise ValueError(f"전류 데이터 형식 오류: shape={df.shape}")
    
    features = {}
    for i, phase in enumerate(["u", "v", "w"]):
        values = df.iloc[:, i + 1].values
        features.update(_stats(values, f"cur_{phase}"))
    return features

# --- 6. 실시간 XGBoost 기계 학습 분석 및 RAG + LLM 오케스트레이션 엔드포인트 ---
@app.post("/api/diagnose", response_model=DiagnosticReport)
async def diagnose_pump(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv') and not file.filename.endswith('.CSV'):
        raise HTTPException(status_code=400, detail="CSV 파일만 업로드할 수 있습니다.")
        
    # 임시 파일 저장 경로 설정
    temp_dir = Path("./temp_uploads")
    temp_dir.mkdir(exist_ok=True)
    
    temp_file_path = temp_dir / file.filename
    try:
        content = await file.read()
        with open(temp_file_path, "wb") as f:
            f.write(content)
            
        # 1. 파일 구조 분석 (진동 vs 전류 판별)
        df_parsed = _read_signal(temp_file_path)
        num_cols = df_parsed.shape[1]
        
        if num_cols >= 4:
            sensor = "current"
            features = extract_current_features(temp_file_path)
        else:
            sensor = "vibration"
            features = extract_vibration_features(temp_file_path)
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        if temp_file_path.exists():
            os.unlink(temp_file_path)
        raise HTTPException(status_code=400, detail=f"CSV 파일 파싱 및 특징 추출 중 오류가 발생했습니다: {str(e)}")

    # 2. 데이터팀 XGBoost 모델 로드 및 추론 수행
    diagnosed_faults = []
    predictions_info = []
    MODELS_DIR = get_models_dir()
    
    try:
        for task in ["축정렬불량", "회전체불평형", "베어링불량", "벨트느슨함"]:
            model_path = MODELS_DIR / f"{sensor}__{task}.pkl"
            if model_path.exists():
                model_data = joblib.load(model_path)
                model = model_data["model"]
                features_list = model_data["features"]
                
                # DataFrame 형태로 변환 및 컬럼 정렬
                X = pd.DataFrame([features])[features_list]
                prob = float(model.predict_proba(X)[0][1])
                pred = int(model.predict(X)[0])
                
                predictions_info.append(f"- {task}: 예측 클래스={pred} (고장 가능성 {prob*100:.1f}%)")
                if pred == 1:
                    diagnosed_faults.append(task)
            else:
                predictions_info.append(f"- {task}: 모델 파일 없음 (학습되지 않음)")
    except Exception as e:
        import traceback
        traceback.print_exc()
        if temp_file_path.exists():
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=f"XGBoost 모델 추론 중 오류가 발생했습니다: {str(e)}")
    finally:
        # 임시 파일 정리
        if temp_file_path.exists():
            os.unlink(temp_file_path)

    # 3. 고장 증상 룰 매핑 보조 분석
    detected_symptoms = []
    if "축정렬불량" in diagnosed_faults:
        detected_symptoms.extend(["이상진동", "기동시부하과다"])
    if "베어링불량" in diagnosed_faults:
        detected_symptoms.extend(["베어링과열", "이상진동"])
    if "회전체불평형" in diagnosed_faults:
        detected_symptoms.extend(["이상진동"])
    if "벨트느슨함" in diagnosed_faults:
        detected_symptoms.extend(["양수량감소"])
        
    detected_symptoms = list(set(detected_symptoms)) # 중복 제거

    # 최종 유력 근본 원인 설정
    if "축정렬불량" in diagnosed_faults:
        probable_cause = "조립 설치 불량 또는 축 중심 불일치 (데이터팀 XGBoost 분석)"
    elif "베어링불량" in diagnosed_faults:
        probable_cause = "윤활유 부족 및 베어링장치 상태 나쁨 (데이터팀 XGBoost 분석)"
    elif "회전체불평형" in diagnosed_faults:
        probable_cause = "회전체 불평형 및 잔류 안착 불일치 (데이터팀 XGBoost 분석)"
    elif "벨트느슨함" in diagnosed_faults:
        probable_cause = "구동 벨트 느슨함 및 송출 장력 저하 (데이터팀 XGBoost 분석)"
    else:
        probable_cause = "정상 상태 유지 (XGBoost 분류기 감지 이상 없음)"

    # 4. RAG 유지관리 매뉴얼 검색
    manual_context = retrieve_manual_context(probable_cause)
    
    # 5. LLM 오케스트레이션 수행
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)
        structured_llm = llm.with_structured_output(DiagnosticReport)
        
        predictions_str = "\n".join(predictions_info)
        
        prompt = f"""
        당신은 원심펌프 정비 분야의 인공지능 분석관입니다.
        데이터팀의 실제 기계 학습 XGBoost 모델 예측 결과와 RAG 매뉴얼 자료를 바탕으로 정밀 진단 보고서를 구조화된 JSON 데이터로 작성해주십시오.
        
        [센서 데이터 추출 정보]
        - 센서 종류: {sensor.upper()} 센서 데이터
        - 신호 통계 특징량 추출값: {features}
        
        [XGBoost 모델 실시간 예측 분석 결과]
        {predictions_str}
        - 최종 식별된 고장 결함 모드: {diagnosed_faults if diagnosed_faults else '정상 가동 중 (Normal)'}
        
        [매트릭스 연계 증상 판별]
        - 감지된 장비 이상 징후: {detected_symptoms}
        - 가장 유력한 결함 원인: {probable_cause}
        
        [유지관리 매뉴얼 검색 컨텍스트 (RAG)]
        {manual_context}
        
        반드시 전문 엔지니어가 작성한 것과 같이 기계/정비 공학 관점에서 매우 상세하고 전문적인 한국어 용어를 사용하여 보고서를 완성해주십시오.
        """
        
        report = structured_llm.invoke(prompt)
        
        # UI 연동 안정을 위해 위험 등급 문자열 표준화 포스트 프로세싱
        risk_upper = str(report.risk_level).upper()
        if "DANGER" in risk_upper:
            report.risk_level = "DANGER"
        elif "WARN" in risk_upper:
            report.risk_level = "WARNING"
        else:
            report.risk_level = "NORMAL"
            
        return report
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI 분석 중 오류가 발생했습니다: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

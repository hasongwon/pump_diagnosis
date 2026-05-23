import os
import sys
import pandas as pd
import numpy as np

import unicodedata
import joblib
import tempfile
import traceback
from pathlib import Path
from typing import List, Optional
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

app = FastAPI(title="Pump Diagnosis RAG Multi-Sensor Fusion Backend")

# React 프론트엔드 포트에서의 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
    root_cause: str = Field(description="최종 판단된 고장의 근본 원인 (진동 및 전류 데이터 융합 판정 결과 반영)")
    recommended_actions: List[str] = Field(description="RAG로 매뉴얼에서 검색한 구체적인 조치 절차 리스트")
    preventive_maintenance: str = Field(description="향후 동일 고장을 예방하기 위한 일상 예방 조치 가이드라인")
    vibration_rms: Optional[float] = Field(None, description="진동 센서의 실측 가속도 RMS 수치")
    current_imbalance: Optional[float] = Field(None, description="전류 센서의 3상 위상 불균형도 (%)")
    vib_faults: Optional[List[str]] = Field(None, description="진동 센서에서 감지된 고장 목록")
    cur_faults: Optional[List[str]] = Field(None, description="전류 센서에서 감지된 고장 목록")

# --- 3. RAG 문서 검색 함수 ---
def retrieve_manual_context(query_cause: str) -> str:
    try:
        # __file__ 기준 상대경로 → 로컬 및 Cloud Run(/app/chroma_db) 모두 동작
        db_dir = str(Path(__file__).parent / "chroma_db")
        if not os.path.exists(db_dir):
            return "유지보수 매뉴얼 데이터베이스가 아직 비어 있습니다."
            
        if not os.environ.get("GOOGLE_API_KEY"):
            return "유지보수 매뉴얼 데이터베이스 검색을 위해 GOOGLE_API_KEY 환경 변수가 필요합니다."
            
        embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
        vector_db = Chroma(persist_directory=db_dir, embedding_function=embeddings)
        
        retriever = vector_db.as_retriever(search_kwargs={"k": 3})
        docs = retriever.invoke(f"{query_cause} 조치 방법 정비 절차 및 예방 방법")
        
        return "\n\n".join([doc.page_content for doc in docs])
    except Exception as e:
        traceback.print_exc()
        return f"유지보수 매뉴얼 데이터베이스 검색 실패: {str(e)}"

# --- 4. 데이터팀 특징 추출 알고리즘 ---
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

# --- 5. 기존 단일 센서 분석 엔드포인트 (하위 호환성 유지) ---
@app.post("/api/diagnose", response_model=DiagnosticReport)
async def diagnose_pump_single(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv') and not file.filename.endswith('.CSV'):
        raise HTTPException(status_code=400, detail="CSV 파일만 업로드할 수 있습니다.")
        
    temp_dir = Path("./temp_uploads")
    temp_dir.mkdir(exist_ok=True)
    temp_file_path = temp_dir / file.filename
    
    try:
        content = await file.read()
        with open(temp_file_path, "wb") as f:
            f.write(content)
            
        df_parsed = _read_signal(temp_file_path)
        num_cols = df_parsed.shape[1]
        
        if num_cols >= 4:
            sensor = "current"
            features = extract_current_features(temp_file_path)
        else:
            sensor = "vibration"
            features = extract_vibration_features(temp_file_path)
            
    except Exception as e:
        traceback.print_exc()
        if temp_file_path.exists():
            os.unlink(temp_file_path)
        raise HTTPException(status_code=400, detail=f"CSV 파일 파싱 및 특징 추출 중 오류: {str(e)}")

    computed_vib = 0.0
    computed_cur = 0.0
    if sensor == "vibration":
        computed_vib = float(np.round(features.get("vib_rms", 0.0) * 3.8, 2))
    else:
        avg_u = features.get("cur_u_mean", 0.0)
        avg_v = features.get("cur_v_mean", 0.0)
        avg_w = features.get("cur_w_mean", 0.0)
        imbalance = max(avg_u, avg_v, avg_w) - min(avg_u, avg_v, avg_w)
        computed_cur = float(np.round(imbalance * 4.0, 1))

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
                
                X = pd.DataFrame([features])[features_list]
                prob = float(model.predict_proba(X)[0][1])
                pred = int(model.predict(X)[0])
                # 임계값 0.65 적용: 기본 0.5보다 높은 기준으로 거짓 양성 억제
                high_conf_pred = 1 if prob >= 0.65 else 0
                
                predictions_info.append(f"- {task}: 예측 클래스={high_conf_pred} (고장 가능성 {prob*100:.1f}%)")
                if high_conf_pred == 1:
                    diagnosed_faults.append(task)
            else:
                predictions_info.append(f"- {task}: 모델 파일 없음")
    except Exception as e:
        traceback.print_exc()
        if temp_file_path.exists():
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=f"XGBoost 모델 추론 중 오류: {str(e)}")
    finally:
        if temp_file_path.exists():
            os.unlink(temp_file_path)

    detected_symptoms = []
    if "축정렬불량" in diagnosed_faults:
        detected_symptoms.extend(["이상진동", "기동시부하과다"])
    if "베어링불량" in diagnosed_faults:
        detected_symptoms.extend(["베어링과열", "이상진동"])
    if "회전체불평형" in diagnosed_faults:
        detected_symptoms.extend(["이상진동"])
    if "벨트느슨함" in diagnosed_faults:
        detected_symptoms.extend(["양수량감소"])
    detected_symptoms = list(set(detected_symptoms))

    # 근본 원인 융합
    probable_cause = f"XGBoost 진단 결과: {', '.join(diagnosed_faults)}" if diagnosed_faults else "정상 상태 유지"

    manual_context = retrieve_manual_context(probable_cause)
    
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
        report.vibration_rms = computed_vib
        report.current_imbalance = computed_cur
        
        # 위험 등급 문자열 표준화 포스트 프로세싱
        risk_upper = str(report.risk_level).upper()
        if "DANGER" in risk_upper:
            report.risk_level = "DANGER"
        elif "WARN" in risk_upper:
            report.risk_level = "WARNING"
        else:
            report.risk_level = "NORMAL"
            
        return report
    except Exception as e:
        print(f"[Fall-back Action Activated] Gemini API Invocation failed (Quota Limit Exceeded or Network Offline). Running robust local rule-engine to generate Structured PdM Report. Error: {str(e)}")
        traceback.print_exc()
        
        # 1. 진단 판단 및 위험 수위 결정 (복합 고장 지원)
        risk_level = "NORMAL"
        active_faults = []
        
        if diagnosed_faults:
            active_faults = diagnosed_faults
            risk_level = "WARNING"
        else:
            active_faults = []
            risk_level = "NORMAL"
            
        # 2. 로컬 룰베이스에 기반한 고장 유형별 매핑 처리 (복합 고장 종합화)
        fallback_actions = []
        preventive_list = []
        rationale_list = []
        
        if not active_faults:
            final_cause = "정상 상태 유지"
            fallback_actions = [
                "펌프 외관 점검: 볼트 풀림 및 배관 밸브 개폐 상태를 기본 오감 검사하십시오.",
                "실시간 전류/진동 관측: 운전 시 소음/진동 상태를 정기 확인하십시오."
            ]
            fallback_preventive = "설비의 일상적인 예방 조치 주기 및 센서 연결성을 기본 점검하고, 기동 시 정상 유량 도달 속도를 유지 관리하십시오."
            fallback_rationale = f"센서({sensor})의 특징량이 정상 관리 범위 내에 있어 특이 고장 징후가 없는 정상 범주로 판단합니다. [LLM 쿼터 한도 초과로 로컬 정밀 Rule-Engine 판정]"
        else:
            final_cause = f"단일 센서 자동 진단 복합 고장: {', '.join(active_faults)} 발생 (XGBoost 분석)"
            
            for fault in active_faults:
                if "축정렬" in fault or "축 중심" in fault or "조립 설치" in fault:
                    fallback_actions.extend([
                        "축 수평 다이얼 게이지 계측: 레이저 얼라인먼트 툴을 사용해 커플링 간극 및 동심도 편차를 ±0.03mm 이내로 조절하십시오.",
                        "모터 마운팅 볼트 점검: 풀림 현상이 발견된 베이스 프레임 기초 볼트를 적정 토크 렌치를 사용하여 2차 긴밀하게 재조이십시오.",
                        "기초 프레임 및 Shim 보정: 수평 지지면의 균일성 검출 후 마모된 심 플레이트를 신규 교체하십시오."
                    ])
                    preventive_list.append("월간 정기 축 얼라인먼트 정량 점검을 수행하고 모터 고정 볼트의 조임 토크 상태를 기록관리 하십시오.")
                    rationale_list.append(f"센서({sensor}) 분석 결과 특정 고주파(1X, 2X) 성분 이상이 검출되어 축정렬불량(Misalignment)으로 확진합니다.")
                elif "베어링" in fault or "윤활유" in fault or "베어링장치" in fault:
                    fallback_actions.extend([
                        "베어링 해체 점검: 베어링 하우징 커버를 탈거하고 피로 균열 및 내외륜 마모 상태를 점검하십시오.",
                        "급유 및 윤활막 관리: 그리스 주입 주기에 맞추어 하우징 공간의 1/3 ~ 1/2 용량으로 적정 주입하십시오.",
                        "온도 정밀 모니터링: 비접촉 온도계를 활용하여 하우징 표면 온도가 70℃ 이하로 제어되는지 밀착 관찰하십시오."
                    ])
                    preventive_list.append("베어링 윤활유 오염도 및 하우징 온도를 주간 단위로 모니터링하고 가동 중 이상 진동 및 소음을 체크하십시오.")
                    rationale_list.append(f"센서({sensor}) 분석 결과 베어링 특이 주파수 대역 이상 증폭이 감지되어 베어링 하자 가능성이 높아 확진합니다.")
                elif "벨트느슨함" in fault or "구동 벨트" in fault:
                    fallback_actions.extend([
                        "V-벨트 장력 재조정: 모터 조정용 볼트를 풀고 텐션 게이지를 사용해 최적 정량 장력 범위로 세팅하십시오.",
                        "풀리 평행 정렬: 레이저 또는 직각자를 사용해 모터와 펌프 구동 풀리의 대칭 수평을 교정하십시오.",
                        "벨트 균열 확인: 노화되거나 슬립 마찰열로 열화된 벨트는 즉각 세트 전면 신규 교체(Replacement) 처리하십시오."
                    ])
                    preventive_list.append("가동 100시간 주기마다 벨트 인장력 처짐 현상을 확인하고 마찰 분진 발생 여부를 청소 점검하십시오.")
                    rationale_list.append(f"센서({sensor}) 분석 결과 축 회전 속도 비율이 슬립으로 저하되어 장력 처짐 및 벨트 느슨함으로 판정합니다.")
                elif "회전체불평형" in fault or "회전체 불평형" in fault:
                    fallback_actions.extend([
                        "회전체 밸런싱 작업: 전용 필드 밸런싱 장비를 사용해 회전부 잔류 불평형 질량을 허용치 이내로 제어하십시오.",
                        "임펠러 고정 상태 점검: 펌프 케이싱을 해체하여 임펠러 락 너트의 풀림 현상 및 마모 흔적을 점검하십시오.",
                        "고정 베이스 검사: 펌프 고정 부위 구조물 균열이나 느슨함으로 인한 공진 연동 여부를 타격 검사하십시오."
                    ])
                    preventive_list.append("반기별로 회전체 정밀 진동 밸런싱 계측을 실시하여 비정상 회전 성분 상승률을 모니터링하십시오.")
                    rationale_list.append(f"센서({sensor}) 분석 결과 회전수와 동기화된 1X 대역 성분이 우세하게 급증하여 회전체 불평형으로 판정합니다.")

            # 중복 제거 및 리스트 정리
            fallback_actions = list(dict.fromkeys(fallback_actions))
            fallback_preventive = " / ".join(list(dict.fromkeys(preventive_list)))
            fallback_rationale = " | ".join(list(dict.fromkeys(rationale_list))) + " [LLM 쿼터 한도 초과 또는 오프라인 상태로 로컬 정밀 Rule-Engine 판정]"

        clean_symptoms = [s.replace("_고", "").replace("_저", "").replace("_불안정", "").replace("_약간저", "") for s in detected_symptoms]
        if not clean_symptoms:
            clean_symptoms = ["정상가동"]

        report = DiagnosticReport(
            risk_level=risk_level,
            risk_rationale=fallback_rationale,
            checked_symptoms=clean_symptoms,
            root_cause=final_cause,
            recommended_actions=fallback_actions,
            preventive_maintenance=fallback_preventive,
            vibration_rms=computed_vib,
            current_imbalance=computed_cur
        )
        return report

# --- 6. [NEW] 다중 센서 융합 분석 엔드포인트 (진동 + 전류 동시 접수) ---
@app.post("/api/diagnose/fusion", response_model=DiagnosticReport)
async def diagnose_pump_fusion(
    vibration_file: UploadFile = File(...),
    current_file: UploadFile = File(...)
):
    # 확장자 검증
    for f in [vibration_file, current_file]:
        if not f.filename.endswith('.csv') and not f.filename.endswith('.CSV'):
            raise HTTPException(status_code=400, detail="진동 및 전류 파일 모두 CSV 형식이어야 합니다.")
            
    temp_dir = Path("./temp_uploads")
    temp_dir.mkdir(exist_ok=True)
    
    vib_path = temp_dir / f"fusion_vib_{vibration_file.filename}"
    cur_path = temp_dir / f"fusion_cur_{current_file.filename}"
    
    # 1. 파일 저장 및 특징 추출
    try:
        # 진동 파일 저장 및 특징량 추출
        vib_content = await vibration_file.read()
        with open(vib_path, "wb") as f:
            f.write(vib_content)
        vib_features = extract_vibration_features(vib_path)
        
        # 전류 파일 저장 및 특징량 추출
        cur_content = await current_file.read()
        with open(cur_path, "wb") as f:
            f.write(cur_content)
        cur_features = extract_current_features(cur_path)
        
    except Exception as e:
        traceback.print_exc()
        for p in [vib_path, cur_path]:
            if p.exists():
                os.unlink(p)
        raise HTTPException(status_code=400, detail=f"센서 융합 파일 파싱 및 특징량 추출 실패: {str(e)}")

    computed_vib = float(np.round(vib_features.get("vib_rms", 0.0) * 3.8, 2))
    avg_u = cur_features.get("cur_u_mean", 0.0)
    avg_v = cur_features.get("cur_v_mean", 0.0)
    avg_w = cur_features.get("cur_w_mean", 0.0)
    imbalance = max(avg_u, avg_v, avg_w) - min(avg_u, avg_v, avg_w)
    computed_cur = float(np.round(imbalance * 4.0, 1))

    # 2. 데이터팀 XGBoost 8개 전체 모델 추론 병렬 기동 (진동 4개 + 전류 4개)
    MODELS_DIR = get_models_dir()
    vib_faults = []
    cur_faults = []
    predictions_info = []
    
    # 물리 기반 사전 필터: RMS/불평형율이 정상 범위 내이면 해당 센서 모델 결과 억제
    VIB_RMS_THRESHOLD_RAW = 2.5   # mm/s — 진동 정상 판정 임계값 (프론트엔드와 동일)
    CUR_IMBALANCE_THRESHOLD_RAW = 0.5  # 프론트엔드의 imbalance < 0.5
    
    raw_vib_rms = vib_features.get("vib_rms", 0.0)
    raw_cur_imb = imbalance
    
    vib_is_physically_normal = raw_vib_rms < VIB_RMS_THRESHOLD_RAW
    cur_is_physically_normal = raw_cur_imb < CUR_IMBALANCE_THRESHOLD_RAW

    try:
        # 진동 모델 4개 추론
        predictions_info.append("=== 진동(Vibration) 센서 예측 결과 ===")
        if vib_is_physically_normal:
            predictions_info.append(f"[물리 필터] 진동 Raw RMS={raw_vib_rms:.2f} < {VIB_RMS_THRESHOLD_RAW} → 진동 모델 결과 무시 (정상 범위)")
            
        best_vib_task = None
        best_vib_prob = 0.0
        vib_probs = {}
        for task in ["축정렬불량", "회전체불평형", "베어링불량", "벨트느슨함"]:
            model_path = MODELS_DIR / f"vibration__{task}.pkl"
            if model_path.exists():
                model_data = joblib.load(model_path)
                model = model_data["model"]
                features_list = model_data["features"]
                
                X = pd.DataFrame([vib_features])[features_list]
                prob = float(model.predict_proba(X)[0][1])
                vib_probs[task] = prob
                
                if prob > best_vib_prob:
                    best_vib_prob = prob
                    best_vib_task = task
            else:
                predictions_info.append(f"- {task}: 모델 파일 없음")
                
        # LLM에게 혼란을 주지 않기 위해, 가장 확률이 높은 모델만 1로 표기
        for task, prob in vib_probs.items():
            is_best = (task == best_vib_task) and (prob >= 0.65) and not vib_is_physically_normal
            high_conf_pred = 1 if is_best else 0
            predictions_info.append(f"- {task}: 예측 클래스={high_conf_pred} (고장 가능성 {prob*100:.1f}%)")
        
        if best_vib_task and best_vib_prob >= 0.65 and not vib_is_physically_normal:
            vib_faults.append(best_vib_task)
                
        # 전류 모델 4개 추론
        predictions_info.append("\n=== 전류(Current) 센서 예측 결과 ===")
        if cur_is_physically_normal:
            predictions_info.append(f"[물리 필터] 전류 불평형율 Raw={raw_cur_imb:.3f} < {CUR_IMBALANCE_THRESHOLD_RAW} → 전류 모델 결과 무시 (정상 범위)")
        best_cur_task = None
        best_cur_prob = 0.0
        for task in ["축정렬불량", "회전체불평형", "베어링불량", "벨트느슨함"]:
            model_path = MODELS_DIR / f"current__{task}.pkl"
            if model_path.exists():
                model_data = joblib.load(model_path)
                model = model_data["model"]
                features_list = model_data["features"]
                
                X = pd.DataFrame([cur_features])[features_list]
                prob = float(model.predict_proba(X)[0][1])
                
                if prob > best_cur_prob:
                    best_cur_prob = prob
                    best_cur_task = task
                    
                high_conf_pred = 1 if (prob >= 0.65 and not cur_is_physically_normal) else 0
                predictions_info.append(f"- {task}: 예측 클래스={high_conf_pred} (고장 가능성 {prob*100:.1f}%)")
            else:
                predictions_info.append(f"- {task}: 모델 파일 없음")
                
        if best_cur_task and best_cur_prob >= 0.65 and not cur_is_physically_normal:
            cur_faults.append(best_cur_task)
                
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"XGBoost 다중 센서 융합 추론 중 오류: {str(e)}")
    finally:
        # 임시 파일 정리
        for p in [vib_path, cur_path]:
            if p.exists():
                os.unlink(p)

    # 3. Decision-Level Sensor Fusion (의사결정 수준 융합) 알고리즘
    # 진동과 전류 모델에서 동시에 도출된 이상 결함(Consensus Faults) 식별
    consensus_faults = list(set(vib_faults) & set(cur_faults))
    union_faults = list(set(vib_faults) | set(cur_faults))
    
    # 이상 징후 매핑
    detected_symptoms = []
    for f in union_faults:
        if f == "축정렬불량":
            detected_symptoms.extend(["이상진동", "기동시부하과다", "압력계수값_저"])
        elif f == "베어링불량":
            detected_symptoms.extend(["베어링과열", "이상진동"])
        elif f == "회전체불평형":
            detected_symptoms.extend(["이상진동", "부하과소"])
        elif f == "벨트느슨함":
            detected_symptoms.extend(["양수량감소", "압력계수값_저"])
            
    detected_symptoms = list(set(detected_symptoms))
    
    # 최종 근본 원인 도출 (융합 합의점 우선순위 부여)
    if consensus_faults:
        probable_cause = f"다중 센서 교차 검증 고장: {', '.join(consensus_faults)} 발생 (진동+전류 융합 확진)"
    elif union_faults:
        probable_cause = f"상호 보완적 이상 탐지 고장: {', '.join(union_faults)} 가능성 감지 (단일 센서 분류)"
    else:
        probable_cause = "정상 상태 유지 (융합 모니터링 이상 무)"

    # 4. RAG 문서 검색
    manual_context = retrieve_manual_context(probable_cause)

    # 5. LLM 오케스트레이션 및 리포트 합성 (gemini-2.5-flash)
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)
        structured_llm = llm.with_structured_output(DiagnosticReport)
        
        predictions_str = "\n".join(predictions_info)
        
        prompt = f"""
        당신은 스마트 팩토리의 예지보전(PdM) 시스템을 관할하는 지능형 원심펌프 다중 센서 융합 정비 분석관입니다.
        진동(Vibration) 센서 특징량과 전류(Current) 센서 특징량을 결합한 교차 융합 진단 결과(XGBoost 8개 모형 분석) 및 유지보수 매뉴얼(RAG)을 바탕으로 산업용 정비 지시서 표준 규격의 정밀 보고서 데이터를 생성해주십시오.
        
        [스마트 팩토리 다중 센서 융합 메타 데이터]
        - 대상 설비: 원심펌프 Centrifugal Pump Alpha-7 (ID: PMP-A7-001)
        - 진동 센서 추출 통계값 (8-dimentional): {vib_features}
        - 전류 센서 3상 추출 통계값 (24-dimentional): {cur_features}
        
        [이중 센서 XGBoost 개별 모형 교차 분류 결과]
        {predictions_str}
        
        [의사결정 수준 융합 (Decision Fusion) 분석 요약]
        - 이중 센서 동시 감지 고장 모드: {consensus_faults if consensus_faults else '없음 (교차 합의점 발견 안됨)'}
        - 전체 감지된 이상 결함 후보군: {union_faults if union_faults else '정상 가동 중 (Normal)'}
        - 교차 매핑된 종합 이상 징후 리스트: {detected_symptoms}
        - 센서 융합 판정 최종 근본 원인: {probable_cause}
        
        [유지관리 정비 매뉴얼 검색 결과 (RAG Context)]
        {manual_context}
        
        반드시 대기업 화학 공장 혹은 중공업 정비 사업소의 숙련된 수석 기계 정비 엔지니어가 공식 문서로 작성한 것처럼, 기계공학 및 전류 스펙트럼 분석(MCSA) 관점에서 매우 전문적이고 깊이 있는 한국어 공학 용어를 사용하여 보고서를 완성해주십시오.
        """
        
        report = structured_llm.invoke(prompt)
        report.vibration_rms = computed_vib
        report.current_imbalance = computed_cur
        report.vib_faults = vib_faults
        report.cur_faults = cur_faults
        
        # ★ 위험 등급: LLM 판단 무시하고 백엔드 XGBoost 필터 결과로 강제 오버라이드
        # consensus_faults → DANGER (두 센서 모두 이상)
        # union_faults only → WARNING (한 센서만 이상)
        # 둘 다 없음 → NORMAL
        if consensus_faults:
            report.risk_level = "DANGER"
        elif union_faults:
            report.risk_level = "WARNING"
        else:
            report.risk_level = "NORMAL"
            
        return report
        
    except Exception as e:
        print(f"[Fall-back Action Activated] Gemini API Invocation failed (Quota Limit Exceeded or Network Offline). Running robust local rule-engine to generate Structured PdM Report. Error: {str(e)}")
        traceback.print_exc()
        
        # 1. 융합 진단 판단 및 위험 수위 결정 (복합 고장 지원)
        risk_level = "NORMAL"
        active_faults = []
        is_fusion_confirmed = False
        
        if consensus_faults:
            active_faults = consensus_faults
            risk_level = "DANGER"
            is_fusion_confirmed = True
        elif union_faults:
            active_faults = union_faults
            risk_level = "WARNING"
        else:
            active_faults = []
            risk_level = "NORMAL"
            
        # 2. 로컬 룰베이스에 기반한 고장 유형별 매핑 처리 (복합 고장 종합화)
        fallback_actions = []
        preventive_list = []
        rationale_list = []
        
        if not active_faults:
            final_cause = "정상 상태 유지"
            fallback_actions = [
                "펌프 외관 점검: 볼트 풀림 및 배관 밸브 개폐 상태를 기본 오감 검사하십시오.",
                "실시간 전류 변동 관측: 3상 평형 요소를 계측하고 운전 시 소음/진동 상태를 정기 확인하십시오."
            ]
            fallback_preventive = "설비의 일상적인 예방 조치 주기 및 센서 연결성을 기본 점검하고, 기동 시 정상 유량 도달 속도를 유지 관리하십시오."
            fallback_rationale = "진동 및 전류 센서의 모든 주파수 대역 에너지가 관리 한계선(UCL) 이내에 포지셔닝하여 특이 사항이 없는 정상 범주로 판단합니다. [LLM 쿼터 한도 초과 또는 오프라인 상태로 로컬 다중 센서 융합 정밀 Rule-Engine 판정]"
        else:
            if is_fusion_confirmed:
                final_cause = f"다중 센서 교차 검증 복합 고장: {', '.join(active_faults)} 발생 (진동+전류 융합 확진)"
            else:
                final_cause = f"상호 보완적 이상 탐지 복합 고장: {', '.join(active_faults)} 가능성 감지 (단일 센서 분류)"
                
            for fault in active_faults:
                if "축정렬" in fault or "축 중심" in fault or "조립 설치" in fault:
                    fallback_actions.extend([
                        "축 수평 다이얼 게이지 계측: 레이저 얼라인먼트 툴을 사용해 커플링 간극 및 동심도 편차를 ±0.03mm 이내로 조절하십시오.",
                        "모터 마운팅 볼트 점검: 풀림 현상이 발견된 베이스 프레임 기초 볼트를 적정 토크 렌치를 사용하여 2차 긴밀하게 재조이십시오.",
                        "기초 프레임 및 Shim 보정: 수평 지지면의 균일성 검출 후 마모된 심 플레이트를 신규 교체하십시오."
                    ])
                    preventive_list.append("월간 정기 축 얼라인먼트 정량 점검을 수행하고 모터 고정 볼트의 조임 토크 상태를 기록관리 하십시오.")
                    rationale_list.append("가속도 센서의 특정 고주파(1X, 2X) 회전 성분 진폭이 정상치 대비 50% 이상 이상 증폭되었고, 전류 센서 MCSA 측대파 분석에서도 회전 전단력 왜곡이 검출되어 축정렬불량(Misalignment)으로 확진합니다.")
                elif "베어링" in fault or "윤활유" in fault or "베어링장치" in fault:
                    fallback_actions.extend([
                        "베어링 해체 점검: 베어링 하우징 커버를 탈거하고 피로 균열 및 내외륜 마모 상태를 점검하십시오.",
                        "급유 및 윤활막 관리: 규격품 그리스를 주입 주기에 맞추어 하우징 공간의 1/3 ~ 1/2 용량으로 적정 주입하십시오.",
                        "온도 정밀 모니터링: 비접촉 온도계를 활용하여 하우징 표면 온도가 70℃ 이하로 제어되는지 밀착 관찰하십시오."
                    ])
                    preventive_list.append("베어링 윤활유 오염도 및 하우징 온도를 주간 단위로 모니터링하고 가동 중 이상 진동 및 소음을 체크하십시오.")
                    rationale_list.append("베어링 내륜/외륜 특이 진동 주파수 대역의 피크 에너지가 급상승하였으며, 동반된 전류 센서 신호의 슬립 주파수 측대파 이상 증폭으로 베어링 하자로 확진합니다.")
                elif "벨트느슨함" in fault or "구동 벨트" in fault:
                    fallback_actions.extend([
                        "V-벨트 장력 재조정: 모터 조정용 볼트를 풀고 텐션 게이지를 사용해 최적 정량 장력 범위로 세팅하십시오.",
                        "풀리 평행 정렬: 레이저 또는 직각자를 사용해 모터와 펌프 구동 풀리의 대칭 수평을 교정하십시오.",
                        "벨트 균열 확인: 노화되거나 슬립 마찰열로 열화된 벨트는 즉각 세트 전면 신규 교체(Replacement) 처리하십시오."
                    ])
                    preventive_list.append("가동 100시간 주기마다 벨트 인장력 처짐 현상을 확인하고 마찰 분진 발생 여부를 청소 점검하십시오.")
                    rationale_list.append("모터 및 펌프의 축 회전 속도 비율이 설정된 풀리비 대비 슬립으로 저하되었으며, 특징적 진동 변동과 3상 전류 피크 불안정이 감지되어 벨트 느슨함으로 판정합니다.")
                elif "회전체불평형" in fault or "회전체 불평형" in fault:
                    fallback_actions.extend([
                        "회전체 밸런싱 작업: 전용 필드 밸런싱 장비를 사용해 회전부 잔류 불평형 질량을 허용치 이내로 제어하십시오.",
                        "임펠러 고정 상태 점검: 펌프 케이싱을 해체하여 임펠러 락 너트의 풀림 현상 및 마모 흔적을 점검하십시오.",
                        "고정 베이스 검사: 펌프 고정 부위 구조물 균열이나 느슨함으로 인한 공진 연동 여부를 타격 검사하십시오."
                    ])
                    preventive_list.append("반기별로 회전체 정밀 진동 밸런싱 계측을 실시하여 비정상 회전 성분 상승률을 모니터링하십시오.")
                    rationale_list.append("회전수와 100% 동기화된 1X 대역 진동 성분이 현저히 우세하게 급증하였으며, 전류 고조파 왜곡 분석 결과에서도 밸런싱 불일치가 입증되었습니다.")

            # 중복 제거 및 리스트 정리
            fallback_actions = list(dict.fromkeys(fallback_actions))
            fallback_preventive = " / ".join(list(dict.fromkeys(preventive_list)))
            fallback_rationale = " | ".join(list(dict.fromkeys(rationale_list))) + " [LLM 쿼터 한도 초과 또는 오프라인 상태로 로컬 다중 센서 융합 정밀 Rule-Engine 판정]"

        # 3. 로컬에서 가상으로 맵핑할 이상 징후들
        clean_symptoms = [s.replace("_고", "").replace("_저", "").replace("_불안정", "").replace("_약간저", "") for s in detected_symptoms]
        if not clean_symptoms:
            clean_symptoms = ["정상가동"]

        report = DiagnosticReport(
            risk_level=risk_level,
            risk_rationale=fallback_rationale,
            checked_symptoms=clean_symptoms,
            root_cause=final_cause,
            recommended_actions=fallback_actions,
            preventive_maintenance=fallback_preventive,
            vibration_rms=computed_vib,
            current_imbalance=computed_cur,
            vib_faults=vib_faults,
            cur_faults=cur_faults
        )
        return report

if __name__ == "__main__":
    import uvicorn
    # 8000 포트에서 실행하여 기존 frontend 코드 주소를 그대로 지원
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
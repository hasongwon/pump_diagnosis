# ─── 1. 베이스 이미지 설정 (Python 3.12 슬림 버전) ───
FROM python:3.12-slim

# ─── 2. 환경 변수 설정 ───
# PYTHONUNBUFFERED: 로그가 버퍼링 없이 즉시 출력되도록 설정
# PYTHONDONTWRITEBYTECODE: 컨테이너 내부 .pyc 파일 생성을 방지하여 가볍게 유지
# MODELS_DIR: 백엔드가 복사된 XGBoost 모델 폴더를 바라보도록 바인딩
# PORT: Google Cloud Run 기본 포트
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    MODELS_DIR=/app/models \
    PORT=8080

WORKDIR /app

# ─── 3. 시스템 의존성 설치 (Chroma DB 등의 컴파일러 요구사항 충족) ───
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# ─── 4. Python 의존성 설치 ───
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ─── 5. 백엔드 소스코드 및 RAG DB 복사 ───
COPY backend/ /app/

# ─── 6. 데이터팀 pre-trained XGBoost 모델 파일 병합 ───
# 프로젝트 루트 빌드 컨텍스트에서 기계학습 모델 8개를 빌드 타임에 이미지 내부로 이식
COPY pump-logic-ai/Rotating_Diagnosis/models/ /app/models/

# ─── 7. 포트 개방 ───
EXPOSE 8080

# ─── 8. Uvicorn 구동 및 GCP Cloud Run 호환 동적 포트 바인딩 ───
CMD ["sh", "-c", "uvicorn main_fusion:app --host 0.0.0.0 --port ${PORT}"]

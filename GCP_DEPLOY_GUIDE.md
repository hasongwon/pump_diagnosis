# 🚀 원심펌프 다중 센서 융합 진단 시스템 초정밀 배포 가이드라인
> **FastAPI Backend (Google Cloud Run)** × **React Frontend (Firebase Hosting)**

본 문서는 **Week 3 (Firebase)** 및 **Week 4 (Google Cloud Run)** 교육 과정을 완벽하게 준수하며, 리포지토리의 최종 코드를 실서버 환경에 단 5분 만에 라이브 배포할 수 있는 단계별 쉘 명령어 매뉴얼입니다.

---

## 🏗️ 전체 배포 아키텍처 구조

```
[사용자 웹 브라우저] 
      │
      ├─ (1) 프론트엔드 정적 파일 요청 ──▶ [Firebase Hosting] (보안 HTTPS 제공)
      │
      └─ (2) 진단 데이터 분석/RAG API  ──▶ [Google Cloud Run] (서버리스 오토스케일링)
                                                 │
                                                 ├─ XGBoost 8개 융합 모델 탑재 (/app/models)
                                                 ├─ Chroma 벡터 데이터베이스 RAG
                                                 └─ Gemini LLM API 연동 (환경변수 주입)
```

---

## ⚙️ 사전 요구사항 (Prerequisites)

1. **Google Cloud SDK (gcloud CLI)**가 로컬 장비에 설치되어 있고 로그인되어 있어야 합니다.
2. **Node.js** 환경 및 **Firebase CLI (`npm install -g firebase-tools`)**가 설치되어 있어야 합니다.
3. GCP 프로젝트 ID 및 Firebase 프로젝트 ID를 미리 확보합니다.
   * *본 가이드라인에서는 GCP 및 Firebase 프로젝트 ID를 모두 `pump-diagnosis-ai`라고 가정합니다.*

---

## 📤 1단계: FastAPI 백엔드 배포 (Google Cloud Run)

FastAPI 서버는 Docker 컨테이너 형태로 포장되어 Google의 고성능 서버리스 컨테이너 서비스인 **Google Cloud Run**에 업로드됩니다.

### 1-1. Google Cloud SDK 로그인 및 프로젝트 연동
PC의 터미널(PowerShell 또는 WSL/Linux)을 실행하고 리포지토리 루트 디렉토리(`c:\Users\hason\Desktop\language\python\google`)에서 다음 명령어를 순서대로 실행합니다.

```bash
# 1. Google Cloud CLI 계정 인증 로그인
gcloud auth login

# 2. 배포 대상 GCP 프로젝트 지정
gcloud config set project pump-diagnosis-ai

# 3. Google Artifact Registry 및 Cloud Build, Cloud Run API 활성화
gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com run.googleapis.com
```

### 1-2. Google Cloud Build를 통한 원클릭 컨테이너 빌드
모델 파일 및 백엔드 requirements를 통합하여 클라우드 상에서 컨테이너 이미지를 자동 빌드합니다. (로컬 Docker Desktop 구동 불필요)

> 💡 **주의**: 반드시 리포지토리 루트 디렉토리(`c:\Users\hason\Desktop\language\python\google`)에서 실행해야 백엔드 파일과 머신러닝 모델 폴더가 도커 이미지 빌드에 완벽하게 포함됩니다.

```bash
# 리포지토리 루트에서 실행 (FastAPI 소스 및 ML 모델 자동 빌드 주입)
gcloud builds submit --tag gcr.io/pump-diagnosis-ai/pump-backend:latest .
```

### 1-3. Google Cloud Run 컨테이너 배포 및 LLM API Key 주입
빌드 완료된 이미지를 Cloud Run에 배포하며, 보안을 위해 **Google Gemini API Key**를 환경 변수로 안전하게 주입해 기동합니다.

```bash
gcloud run deploy pump-backend \
  --image gcr.io/pump-diagnosis-ai/pump-backend:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_API_KEY=발급받은_실제_Gemini_API_Key"
```

* **`--region asia-northeast3`**: 대한민국 서울 리전을 지정하여 쾌적한 네트워크 속도를 제공합니다.
* **`--allow-unauthenticated`**: 프론트엔드가 백엔드 API 서버를 자유롭게 호출할 수 있도록 퍼블릭 개방합니다.
* 배포가 완료되면 터미널 화면에 서비스 주소가 표출됩니다.
  * **출력 주소 예시**: `Service [pump-backend] revision [pump-backend-00001] has been deployed and is serving traffic at https://pump-backend-xxxxxx.a.run.app`
  * **이 백엔드 주소를 따로 복사해 둡니다.**

---

## 🎨 2단계: React 프론트엔드 배포 (Firebase Hosting)

Vite 빌드 시 배포 완료된 백엔드(Cloud Run)의 실주소를 환경 변수로 이식하여 번들링하고, **Firebase Hosting**으로 라이브 런칭합니다.

### 2-1. 프론트엔드 환경변수 기반 프로덕션 번들 빌드
프론트엔드 디렉토리로 이동한 뒤, 빌드 환경변수 `VITE_API_URL`에 방금 복사해 둔 Cloud Run 실주소를 대입하여 정적 파일을 컴파일합니다.

```bash
# 1. 프론트엔드 작업 경로 이동
cd pump-logic-ai/pump-logic-ai

# 2. Cloud Run 백엔드 도메인을 주입하여 프로덕션 빌드 (Windows PowerShell 예시)
$env:VITE_API_URL="https://pump-backend-xxxxxx.a.run.app"
npm run build

# ※ 만약 macOS 또는 Linux 쉘을 사용할 경우의 빌드 명령어:
# VITE_API_URL="https://pump-backend-xxxxxx.a.run.app" npm run build
```

### 2-2. Firebase CLI 로그인 및 프로젝트 연동
```bash
# 1. Firebase 계정 로그인 (브라우저 인증창 기동)
firebase login

# 2. Firebase 프로젝트 연동 선언 (이미 제공된 .firebaserc 가 있지만, 명시적으로 교체할 수도 있음)
firebase use pump-diagnosis-ai
```

> 💡 **프로젝트 이름 변경 필요 시**: `.firebaserc` 파일 내의 `pump-diagnosis-ai` 부분을 본인의 Firebase 프로젝트 고유 ID로 수정하시면 됩니다.

### 2-3. 최종 호스팅 배포 런칭
```bash
# Firebase 호스팅 서버로 정적 파일 배포 기동
firebase deploy --only hosting
```

* 배포 완료 후 터미널에 최종 라이브 접속 URL이 반환됩니다.
  * **출력 주소 예시**: `✔  Deploy complete! Project Console: https://console.firebase.google.com/project/pump-diagnosis-ai/overview Hosting URL: https://pump-diagnosis-ai.web.app`

---

## 🔍 3단계: 안전한 롤백 및 로컬 원복 절차
배포 설정 후에도, 평소 하던 방식대로 로컬에서 개발 및 원복하고 싶다면 아무 변경 절차 없이 평소 명령어를 그대로 쓰면 됩니다.

1. **로컬 백엔드 서버 기동**: `python main_fusion.py` 실행 시 여전히 로컬 가상환경에서 모델을 읽고 8000번 포트로 구동됩니다.
2. **로컬 프론트엔드 서버 기동**: `npm run dev` 실행 시 자동으로 백엔드 API 주소가 `http://localhost:8000`으로 맵핑되므로 어떠한 연동 충돌도 없이 로컬 샌드박스에서 완벽하게 개발을 유지할 수 있습니다.

---

## 🛠️ 배포 트러블슈팅 (Troubleshooting)

### Q1. Cloud Run 서버 호출 시 CORS 에러가 발생합니다.
* **해결법**: 백엔드의 `main_fusion.py` 내 `allow_origins=["*"]` 미들웨어가 정상적으로 탑재되어 있어 기본적으로는 모든 오리진을 허용합니다. 만약 보안상 특정 도메인만 고정시키려면 프론트엔드의 Firebase 배포 URL(`https://pump-diagnosis-ai.web.app`)을 백엔드 오리진 허용 리스트에 명시적으로 추가하여 재배포하십시오.

### Q2. Cloud Run 배포 로그에 `Memory Limit Exceeded`가 발생하며 먹통이 됩니다.
* **해결법**: 8개의 XGBoost 모델 및 RAG용 Chroma DB를 컨테이너 상에 한 번에 로드하는 과정에서 클라우드 컨테이너의 기본 할당 메모리(512MB)를 초과할 수 있습니다. 이 경우 메모리 할당 용량을 **1GB 또는 2GB**로 상향 재배포하면 즉시 말끔하게 해결됩니다:
  ```bash
  gcloud run deploy pump-backend \
    --image gcr.io/pump-diagnosis-ai/pump-backend:latest \
    --memory 2Gi \
    --region asia-northeast3
  ```

### Q3. "유지보수 매뉴얼 데이터베이스가 아직 비어 있습니다" 라는 메시지가 뜹니다.
* **해결법**: Chroma DB 파일이 이미지 빌드에 누락되었거나 새로 이식해야 하는 상태입니다. 배포하기 전 로컬에서 `python ingest.py`를 먼저 1회 실행하여 `backend/chroma_db` 디렉토리에 매뉴얼 임베딩 파일들을 완벽하게 빌드한 상태에서 `gcloud builds submit` 명령어를 기동해야 컨테이너 이미지 상에 온전히 복사됩니다.

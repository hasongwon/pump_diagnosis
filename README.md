# Pump Diagnosis — 원심펌프 다중 센서 융합 진단 시스템

원심펌프의 **진동(Vibration)** 과 **전류(Current)** 센서 CSV 를 업로드하면,
XGBoost 모델 8개 + RAG 매뉴얼 검색 + Gemini LLM 을 결합해
**예지보전(PdM) 진단 리포트** 를 생성하는 풀스택 프로젝트.

```
[React UI (Vite)] ──CSV 업로드──▶ [FastAPI Backend]
   :5173                              :8000
                                       ├─ XGBoost 8 모델 (진동 4 + 전류 4)
                                       ├─ Decision-Level Sensor Fusion
                                       ├─ Chroma 벡터DB (PDF 매뉴얼 RAG)
                                       └─ Gemini 2.5 Flash (구조화 리포트)
```

---

## 1. 디렉토리 구조

```
pump_diagnosis/
├── README.md                        ← (이 파일)
├── manuals/                         ← 원본 PDF 정비 매뉴얼 (RAG 원천)
│   ├── 원심펌프_유지보수절차서.pdf
│   └── 유지관리매뉴얼_펌프.pdf
│
├── backend/                         ← FastAPI 백엔드 (Python)
│   ├── main_fusion.py               ★ 메인 진입점. 진동+전류 융합 진단 API
│   ├── main.py                      └─ 구버전 (단일 센서). 하위호환용
│   ├── ingest.py                    ← manuals/*.pdf → Chroma 벡터DB 적재 스크립트
│   ├── requirements.txt             ← Python 패키지 목록
│   ├── .env.example                 ← 환경변수 템플릿 (커밋됨)
│   ├── .env                         ← 실제 키 (gitignore, 직접 생성 필요)
│   ├── chroma_db/                   ← ingest.py 가 생성한 RAG 벡터DB (영속)
│   ├── samples/                     ← 테스트용 CSV (정상/고장 예시)
│   ├── temp_uploads/                ← 업로드 임시 저장 (자동 생성/삭제)
│   └── .venv/                       ← Python 가상환경
│
├── pump-logic-ai/
│   ├── Rotating_Diagnosis/          ← XGBoost 학습 파이프라인
│   │   ├── src/
│   │   │   ├── config.py            ← 경로/하이퍼파라미터/4개 task 정의
│   │   │   ├── feature_extraction.py← CSV → 통계 특징(평균/RMS/첨도 등)
│   │   │   ├── dataset_builder.py   ← 폴더구조 스캔 → 학습용 DataFrame 생성
│   │   │   └── train.py             ← 8개 모델 학습 + 평가 + 저장
│   │   ├── models/                  ★ 학습된 모델 8개 (백엔드가 로드)
│   │   │   ├── vibration__축정렬불량.pkl
│   │   │   ├── vibration__회전체불평형.pkl
│   │   │   ├── vibration__베어링불량.pkl
│   │   │   ├── vibration__벨트느슨함.pkl
│   │   │   ├── current__축정렬불량.pkl
│   │   │   ├── current__회전체불평형.pkl
│   │   │   ├── current__베어링불량.pkl
│   │   │   └── current__벨트느슨함.pkl
│   │   ├── generate_sample_data.py  ← 데모용 합성 데이터 생성기
│   │   └── requirements.txt
│   │
│   └── pump-logic-ai/               ← React + Vite 프론트엔드
│       ├── src/
│       │   ├── App.jsx              ← 메인 화면 (CSV 업로드 / 결과 표시)
│       │   ├── main.jsx             ← React 엔트리
│       │   └── index.css            ← Tailwind 진입
│       ├── package.json             ← React 19 / Vite 8 / recharts / papaparse
│       └── vite.config.js
└── .gitignore
```

---

## 2. 필수 설치 환경 (Prerequisites)

| 항목 | 요구 버전 | 비고 |
|---|---|---|
| **Python** | 3.12 권장 | 백엔드 가상환경용 |
| **Node.js** | **≥ 20.19** 또는 **≥ 22.12** | Vite 8 요구사항. Ubuntu 의 기본 `apt install nodejs` (18.x) 는 **돌아가지 않음** → `nvm` 사용 권장 |
| **npm** | Node 와 함께 | WSL 사용자는 Linux 측 npm 필수 (Windows npm 은 UNC 경로 거부) |
| **Google API Key** | Gemini 2.5 Flash + Embedding 사용권 | https://aistudio.google.com/app/apikey |

### Node.js 가 없거나 18.x 인 경우 (nvm 으로 설치)

```bash
# nvm 설치 (한 번만)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Node 22 설치 + 활성화
nvm install 22
nvm use 22
node --version    # v22.x.x 확인
```

---

## 3. 설치 (Install)

### 3-1. 백엔드 Python 의존성

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

설치되는 패키지와 역할:

| 카테고리 | 패키지 | 역할 |
|---|---|---|
| **웹 프레임워크** | `fastapi` | REST API 서버 |
|  | `uvicorn` | ASGI 런타임 |
|  | `python-multipart` | `UploadFile` 멀티파트 파싱 (없으면 업로드 500) |
|  | `pydantic` | 요청/응답 스키마 |
| **환경변수** | `python-dotenv` | `backend/.env` 자동 로드 |
| **데이터/ML** | `numpy` | 신호 통계 (RMS, ptp 등) |
|  | `pandas` | CSV 파싱, DataFrame |
|  | `scikit-learn` | 모델 평가 메트릭 |
|  | `xgboost` | 8개 고장 분류 모델 본체 |
|  | `joblib` | `.pkl` 모델 로드 |
| **LLM / RAG** | `langchain-core`, `langchain-community` | LangChain 본체 |
|  | `langchain-google-genai` | Gemini 임베딩 + Chat 래퍼 |
|  | `langchain-text-splitters` | PDF 청킹 |
|  | `google-genai` | Google Gemini SDK |
|  | `chromadb` | 로컬 벡터 DB |
| **PDF (ingest)** | `pypdf` | `ingest.py` 의 PDF 파서 |

### 3-2. 프론트엔드 Node 의존성

```bash
cd pump-logic-ai/pump-logic-ai
npm install
```

설치되는 주요 패키지:

| 패키지 | 역할 |
|---|---|
| `react` 19, `react-dom` 19 | UI 프레임워크 |
| `vite` 8, `@vitejs/plugin-react` | 개발 서버 + 번들러 |
| `tailwindcss` 4, `@tailwindcss/vite` | 스타일링 |
| `recharts` | 진단 결과 시각화 차트 |
| `papaparse` | CSV 클라이언트 프리뷰 파싱 |
| `lucide-react` | 아이콘 |

### 3-3. API 키 설정 (필수)

`backend/.env.example` 을 복사해서 `.env` 만들고 실제 키 입력:

```bash
cd backend
cp .env.example .env
# 에디터로 열어서 GOOGLE_API_KEY=<발급받은-키> 로 교체
```

`.env` 파일 내용 예시:
```
GOOGLE_API_KEY=AIzaSy...실제발급키
```

> **중요**: `.env` 는 `.gitignore` 에 등록되어 절대 커밋되지 않습니다.
> 키가 없거나 비어있으면 **백엔드가 부팅 자체를 거부**합니다 (fail-fast).

---

## 4. 실행 (Run)

### 4-1. (최초 1회) PDF 매뉴얼 → 벡터 DB 적재

`backend/chroma_db/` 가 이미 존재하면 **건너뛰어도 됨**. 새로 만들려면:

```bash
cd backend
source .venv/bin/activate
python ingest.py
```

→ `manuals/*.pdf` 를 청크로 쪼개 임베딩한 뒤 `backend/chroma_db/` 에 저장.

### 4-2. 백엔드 서버 (터미널 1)

```bash
cd backend
source .venv/bin/activate
python main_fusion.py
```

성공 로그:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 4-3. 프론트엔드 (터미널 2)

```bash
cd pump-logic-ai/pump-logic-ai
nvm use 22                   # Node 18 환경이라면 필수
npm run dev
```

성공 로그:
```
  VITE v8.0.13  ready in 1505 ms
  ➜  Local:   http://localhost:5173/
```

### 4-4. 접속

| 서비스 | URL |
|---|---|
| **웹 UI (메인)** | http://localhost:5173 |
| 백엔드 API | http://localhost:8000 |
| Swagger 문서 | http://localhost:8000/docs |

### 4-5. cURL 로 백엔드 단독 테스트

```bash
curl -X POST http://127.0.0.1:8000/api/diagnose/fusion \
  -F "vibration_file=@backend/samples/vibration_shaft_alignment_fault_sample.csv" \
  -F "current_file=@backend/samples/current_shaft_alignment_fault_sample.csv"
```

→ 위험도 / 근거 / 증상 / 원인 / 조치 / 예방 6개 필드의 JSON 리포트 반환.

---

## 5. 문제 해결 (Troubleshooting)

| 증상 | 원인 / 해결 |
|---|---|
| `RuntimeError: GOOGLE_API_KEY 가 설정되지 않았습니다` | `backend/.env` 생성 안 됨. 3-3 단계 수행 |
| `403 PERMISSION_DENIED: Your API key was reported as leaked` | 키가 무효화됨. AI Studio 에서 새로 발급 후 `.env` 교체 |
| `vite: Node.js version 20.19+ or 22.12+ required` | Node 18 이하 사용 중. `nvm install 22 && nvm use 22` |
| `'vite' ...인식되지 않습니다` (한글 깨짐) | (WSL) Windows npm 이 PATH 우선. `which npm` 확인 후 Linux 측 nvm 의 npm 사용 |
| 진단 결과가 "모델 파일 없음" 으로만 응답 | `pump-logic-ai/Rotating_Diagnosis/models/*.pkl` 8개 존재 확인 |
| `유지보수 매뉴얼 데이터베이스가 아직 비어 있습니다` | `python ingest.py` 미실행. 4-1 단계 수행 |

---

## 6. 진단되는 4가지 고장 유형

| Task | 의미 |
|---|---|
| 축정렬불량 (Misalignment) | 모터-펌프 축 동심도 편차 |
| 회전체불평형 (Unbalance) | 임펠러 잔류 불평형 질량 |
| 베어링불량 (Bearing Fault) | 내외륜 마모 / 윤활 불량 |
| 벨트느슨함 (Belt Looseness) | V-벨트 장력 처짐 |

각 task 마다 진동/전류 센서별 모델이 따로 학습됨 → 총 8개 모델.
두 센서 모두에서 양성 → **DANGER** / 한쪽만 → **WARNING** / 둘 다 음성 → **NORMAL**.

---

## 7. API 요약

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/api/diagnose` | 단일 CSV (진동 or 전류 자동 감지) → 진단 |
| POST | `/api/diagnose/fusion` | 진동 + 전류 동시 업로드 → 융합 진단 (권장) |

응답 스키마 (`DiagnosticReport`):
- `risk_level`: `DANGER` / `WARNING` / `NORMAL`
- `risk_rationale`: 엔지니어링 분석 근거
- `checked_symptoms`: 감지된 이상 증상 리스트
- `root_cause`: 최종 근본 원인
- `recommended_actions`: 매뉴얼 기반 조치 절차 리스트
- `preventive_maintenance`: 예방 정비 가이드라인

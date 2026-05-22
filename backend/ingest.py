import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

# 로컬 .env 파일 로드 (보안을 위해 API 키 하드코딩 제거 및 로컬 환경변수 파일 분리)
from pathlib import Path
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

def ingest_manuals():
    manuals_dir = "../manuals"
    db_dir = "./chroma_db"
    
    print(f"1. '{manuals_dir}' 폴더에서 PDF 파일들을 읽어옵니다...")
    if not os.path.exists(manuals_dir):
        print(f"오류: '{manuals_dir}' 폴더가 존재하지 않습니다. 경로를 확인해주세요.")
        return
        
    loader = PyPDFDirectoryLoader(manuals_dir)
    documents = loader.load()
    print(f"   성공: 총 {len(documents)} 페이지의 문서를 로드했습니다.")
    
    print("\n2. 문서를 분석하기 좋게 조각조각 자릅니다 (Chunking)...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600, 
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.split_documents(documents)
    print(f"   성공: 문서를 {len(chunks)}개의 조각으로 나누었습니다.")
    
    print("\n3. 조각난 문서를 임베딩(Vector화)하여 Chroma DB에 저장합니다...")
    embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
    
    # Chroma 벡터 DB 생성 및 로컬 저장
    vector_db = Chroma.from_documents(
        chunks, 
        embeddings, 
        persist_directory=db_dir
    )
    print(f"   성공: 벡터 데이터베이스가 '{db_dir}' 폴더에 성공적으로 저장되었습니다!")

if __name__ == "__main__":
    ingest_manuals()

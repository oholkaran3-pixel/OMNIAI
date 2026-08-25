from fastapi import APIRouter, UploadFile, File
from pathlib import Path

from rag.loader import load_pdf
from rag.splitter import split_documents
from rag.vectorstore import create_vector_store

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Save uploaded PDF
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Load PDF
    documents = load_pdf(str(file_path))

    # Split PDF into chunks
    chunks = split_documents(documents)

    # Store chunks in ChromaDB
    collection = create_vector_store(chunks)

    return {
        "message": "PDF uploaded and added to RAG successfully!",
        "filename": file.filename,
        "pages": len(documents),
        "chunks": len(chunks),
        "documents_stored": collection.count(),
    }
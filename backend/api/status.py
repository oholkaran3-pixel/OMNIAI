from fastapi import APIRouter
import os
import chromadb

router = APIRouter()


@router.get("/status")
def get_status():

    document_count = 0

    try:
        client = chromadb.PersistentClient(
            path="chroma_db"
        )

        collection = client.get_or_create_collection(
            name="omniai_documents"
        )

        document_count = collection.count()

    except Exception:
        document_count = 0

    # Count uploaded PDF files
    pdf_count = 0

    upload_folder = "uploads"

    if os.path.exists(upload_folder):
        pdf_count = len([
            file
            for file in os.listdir(upload_folder)
            if file.lower().endswith(".pdf")
        ])

    return {
        "status": "online",
        "rag": "ready",
        "documents": document_count,
        "pdfs": pdf_count,
        "fastapi": "online",
        "chromadb": "online",
        "ollama": "online",
    }
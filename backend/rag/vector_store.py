import chromadb
from rag.embeddings import create_embeddings


def create_vector_store(chunks):
    embeddings = create_embeddings()

    client = chromadb.PersistentClient(
        path="chroma_db"
    )

    collection = client.get_or_create_collection(
        name="omniai_documents"
    )

    texts = [
        chunk.page_content
        for chunk in chunks
    ]

    if not texts:
        return collection

    vectors = embeddings.embed_documents(texts)

    # Create unique IDs for every document chunk
    import uuid

    ids = [
        str(uuid.uuid4())
        for _ in texts
    ]

    collection.add(
        ids=ids,
        documents=texts,
        embeddings=vectors
    )

    return collection
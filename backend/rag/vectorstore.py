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

    vectors = embeddings.embed_documents(texts)

    # Get existing document count
    existing_count = collection.count()

    # Create unique IDs for new chunks
    ids = [
        f"doc_{existing_count + i}"
        for i in range(len(texts))
    ]

    collection.add(
        ids=ids,
        documents=texts,
        embeddings=vectors
    )

    return collection
import chromadb
from rag.embeddings import create_embeddings


def search_documents(query, top_k=2):
    client = chromadb.PersistentClient(path="chroma_db")

    collection = client.get_collection(
        name="omniai_documents"
    )

    embeddings = create_embeddings()

    query_vector = embeddings.embed_query(query)

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )

    return results["documents"][0]
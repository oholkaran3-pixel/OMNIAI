from rag.rag_service import ask_with_rag


question = "What is Artificial Intelligence?"

answer = ask_with_rag(question)

print()
print("OmniAI Answer:")
print(answer)
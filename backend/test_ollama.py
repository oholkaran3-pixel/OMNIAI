from llm.ollama_client import stream_ollama

for chunk in stream_ollama("Say hello"):
    print(repr(chunk))
    
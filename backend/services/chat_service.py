from llm.ollama_client import ask_ollama
from memory.conversation import add_message, get_prompt


def get_ai_response(message: str) -> str:
    prompt = get_prompt(message)

    reply = ask_ollama(prompt)

    add_message("user", message)
    add_message("assistant", reply)

    return reply
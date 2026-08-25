import json
import requests

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

MODEL = "qwen3:1.7b"


def ask_ollama(prompt):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "think": False
        }
    )

    return response.json()["response"]


def stream_ollama(prompt):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "think": False
        }
    )

    text = response.json()["response"]

    yield text
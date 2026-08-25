from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rag.retriever import search_documents
from llm.ollama_client import stream_ollama
from memory.conversation import add_message, get_prompt

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    language: str = "en-US"


LANGUAGE_NAMES = {
    "en-US": "English",
    "en-GB": "English",
    "hi-IN": "Hindi",
    "bn-IN": "Bengali",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
    "kn-IN": "Kannada",
    "ml-IN": "Malayalam",
    "mr-IN": "Marathi",
    "gu-IN": "Gujarati",
    "pa-IN": "Punjabi",
    "ur-IN": "Urdu",
    "or-IN": "Odia",
    "as-IN": "Assamese",
    "sa-IN": "Sanskrit",
}


def get_language_name(language: str) -> str:
    return LANGUAGE_NAMES.get(language, "English")


def build_prompt(question: str, language: str):

    try:
        documents = search_documents(question)

        if documents:
            context = "\n\n".join(documents)
        else:
            context = ""

    except Exception as error:
        print("RAG ERROR:", error)
        context = ""

    try:
        conversation = get_prompt()

    except Exception as error:
        print("MEMORY ERROR:", error)
        conversation = ""

    return f"""
You are OmniAI.

Answer in {language}.

Conversation:

{conversation}

Documents:

{context}

User question:

{question}

Give a short and helpful answer.
"""


@router.post("/chat")
def chat(request: ChatRequest):

    question = request.message

    prompt = build_prompt(
        question,
        get_language_name(request.language)
    )

    answer = ""

    try:
        for chunk in stream_ollama(prompt):
            answer += chunk

    except Exception as error:
        print("OLLAMA ERROR:", error)

    print("QUESTION:", question)
    print("ANSWER:", answer)

    return {
        "reply": answer
    }


@router.post("/chat/stream")
def chat_stream(request: ChatRequest):

    question = request.message

    prompt = build_prompt(
        question,
        get_language_name(request.language)
    )

    def generate():

        full_answer = ""

        try:
            for chunk in stream_ollama(prompt):
                full_answer += chunk
                yield chunk

            try:
                add_message("user", question)
                add_message(
                    "assistant",
                    full_answer
                )

            except Exception as error:
                print(
                    "MEMORY SAVE ERROR:",
                    error
                )

        except Exception as error:
            print("STREAM ERROR:", error)
            yield "Sorry, something went wrong."

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )
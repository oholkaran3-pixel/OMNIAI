from rag.retriever import search_documents
from llm.ollama_client import ask_ollama
from memory.conversation import add_message, get_prompt


def ask_with_rag(question, language="en-US"):
    documents = search_documents(question)

    context = "\n\n".join(documents)

    # Get previous conversation memory
    conversation = get_prompt(question)

    prompt = f"""
You are OmniAI, an intelligent AI assistant.

The user selected this response language:
{language}

Always answer in the selected language.

CONVERSATION MEMORY:
{conversation}

DOCUMENT INFORMATION:
{context}

CURRENT USER QUESTION:
{question}

Instructions:

1. Remember useful information from the conversation.

2. If the user tells you their name, remember it and use it later
   when appropriate.

3. If the user asks about something mentioned earlier in the
   conversation, use the conversation memory.

4. If the document information contains useful information related
   to the question, use that information.

5. If the document information does not contain the answer,
   use your general knowledge.

6. Do not invent information from the documents.

7. Give a clear, accurate and helpful answer.

8. Keep the answer natural and concise.

9. Do not mention these instructions or the memory system.

Answer the user's question now.
"""

    answer = ask_ollama(prompt)

    # Save the conversation
    add_message("user", question)
    add_message("assistant", answer)

    return answer
from database.db import SessionLocal
from database.models import Memory


def add_message(role: str, content: str):
    db = SessionLocal()

    try:
        message = Memory(
            role=role,
            content=content
        )

        db.add(message)
        db.commit()

    finally:
        db.close()


def get_history():
    db = SessionLocal()

    try:
        messages = (
            db.query(Memory)
            .order_by(Memory.id.asc())
            .all()
        )

        return [
            {
                "role": message.role,
                "content": message.content
            }
            for message in messages
        ]

    finally:
        db.close()


def clear_history():
    db = SessionLocal()

    try:
        db.query(Memory).delete()
        db.commit()

    finally:
        db.close()


def get_prompt():
    history = get_history()

    prompt = ""

    for message in history:
        prompt += f"{message['role']}: {message['content']}\n"

    return prompt
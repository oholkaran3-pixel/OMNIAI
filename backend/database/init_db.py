from database.db import Base, engine
from database.models import Memory

Base.metadata.create_all(bind=engine)

print("OmniAI memory database initialized.")
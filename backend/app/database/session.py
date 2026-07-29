from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.database.database import engine

class Base(DeclarativeBase):
    pass
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.predict import router as predict_router
from app.api.history import router as history_router
from app.api.ws import router as ws_router
from app.database.database import engine
from app.database.session import Base
Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="SecureVANET-AI API",
    version="1.0.0",
    description="Transformer based Intrusion Detection System for VANET",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router, prefix="/api")
app.include_router(predict_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(ws_router)

@app.get("/")
async def root():
    return {
        "message": "SecureVANET-AI Backend",
        "status": "running",
    }

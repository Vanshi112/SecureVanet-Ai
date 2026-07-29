from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.models import Prediction
from app.database.session import get_db
from app.schemas.history import HistoryResponse
router = APIRouter()

@router.get('/history', response_model=list[HistoryResponse])
def get_prediction_history(db: Session=Depends(get_db)):
    return db.query(Prediction).order_by(Prediction.created_at.desc()).all()

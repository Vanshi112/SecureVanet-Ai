from datetime import datetime
from pydantic import BaseModel

class HistoryResponse(BaseModel):
    id: int
    filename: str
    status: str
    attack_percentage: float
    attack_type: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

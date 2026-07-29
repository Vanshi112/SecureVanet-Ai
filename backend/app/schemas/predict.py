from typing import Dict
from pydantic import BaseModel

class PredictionResponse(BaseModel):
    status: str
    attack_percentage: float
    attack_type: str
    confidence: float
    counts: Dict[str, int]
    report_path: str

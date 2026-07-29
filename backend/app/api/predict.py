from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.schemas.predict import PredictionResponse
from app.services.inference_service import service
from app.database.session import get_db
from app.database.models import Prediction
import tempfile
import shutil
import os
router = APIRouter()

@router.post('/predict', response_model=PredictionResponse)
async def predict(file: UploadFile=File(...), db: Session=Depends(get_db)):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        temp_path = tmp.name
    result = service.predict(temp_path)
    os.remove(temp_path)
    prediction = Prediction(filename=file.filename, status=str(result['status']), attack_percentage=float(result['attack_percentage']), attack_type=str(result['attack_type']), confidence=float(result['confidence']), normal_count=int(result['counts']['Normal']), dos_count=int(result['counts']['DoS']), fuzzy_count=int(result['counts']['Fuzzy']), gear_count=int(result['counts']['Gear']), rpm_count=int(result['counts']['RPM']), report_path=str(result['report_path']))
    db.add(prediction)
    db.commit()
    return result

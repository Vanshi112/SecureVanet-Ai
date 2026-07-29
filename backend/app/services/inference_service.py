import sys
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parents[2]
ML_SRC = ROOT_DIR.parent / 'ml' / 'src'
if str(ML_SRC) not in sys.path:
    sys.path.insert(0, str(ML_SRC))
from predict import predict_csv

class InferenceService:

    def predict(self, file_path: str):
        return predict_csv(file_path)
service = InferenceService()

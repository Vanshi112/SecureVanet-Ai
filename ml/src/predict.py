from pathlib import Path
import sys
from collections import Counter
import shutil
import numpy as np
import pandas as pd
import joblib
PROJECT_ROOT = Path(__file__).resolve().parents[2]
from models.config import ModelConfig
from inference.predictor import Predictor
from feature_engineering.feature_engineer import FeatureEngineeringPipeline
from inference.inference_sequence_generator import InferenceSequenceGenerator

def predict_csv(INPUT_CSV: str):
    if not Path(INPUT_CSV).exists():
        print('=' * 70)
        print(f'Error: File not found -> {INPUT_CSV}')
        print('=' * 70)
        sys.exit(1)
    ENGINEERED_CSV = 'temp_engineered.csv'
    print('=' * 70)
    print(f'Input File : {INPUT_CSV}')
    print(f'Total Input Size : {Path(INPUT_CSV).stat().st_size / (1024 * 1024):.2f} MB')
    print('=' * 70)
    print('\nRunning Feature Engineering...')
    pipeline = FeatureEngineeringPipeline(INPUT_CSV, ENGINEERED_CSV)
    pipeline.run()
    shutil.copy(ENGINEERED_CSV, 'debug_inference_engineered.csv')
    print('Saved debug_inference_engineered.csv')
    print('\nLoading Engineered Features...')
    df = pd.read_csv(ENGINEERED_CSV)
    X = df.drop(columns=['label', 'attack_type', 'timestamp'], errors='ignore')
    print('\nInference Feature Names:')
    print(X.columns.tolist())
    np.save('debug_feature_names.npy', np.array(X.columns.tolist(), dtype=object))
    print('\nLoading Feature Scaler...')
    scaler_path = PROJECT_ROOT / 'datasets' / 'sequences' / 'feature_scaler.pkl'
    scaler = joblib.load(scaler_path)
    X_scaled = scaler.transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
    print('Feature scaling complete.')
    print('\nGenerating Sequences...')
    generator = InferenceSequenceGenerator(sequence_length=32)
    sequences = generator.generate(X_scaled)
    np.save('debug_infer_seq.npy', sequences[:1])
    print('Saved debug inference sequence.')
    print(f'Generated {len(sequences):,} sequences')
    config = ModelConfig()
    predictor = Predictor(config)
    predictions = []
    confidences = []
    for seq in sequences:
        result = predictor.predict(seq)
        predictions.append(result['class'])
        confidences.append(result['confidence'])
    counts = Counter(predictions)
    Path('results').mkdir(exist_ok=True)
    results = pd.DataFrame({'Sequence': range(1, len(predictions) + 1), 'Prediction': predictions, 'Confidence': confidences})
    results.to_csv('results/prediction_results.csv', index=False)
    print('\nPrediction results saved to results/prediction_results.csv')
    total = len(predictions)
    print('\n')
    print('=' * 70)
    print('Prediction Summary')
    print('=' * 70)
    for cls in predictor.class_names:
        count = counts.get(cls, 0)
        percentage = count / total * 100 if total > 0 else 0
        print(f'{cls:<10}: {count:>8} ({percentage:6.2f}%)')
    print('-' * 70)
    normal_count = counts.get('Normal', 0)
    attack_count = total - normal_count
    attack_percentage = attack_count / total * 100
    attack_counts = {k: v for k, v in counts.items() if k != 'Normal'}
    if attack_counts:
        attack_type = max(attack_counts, key=attack_counts.get)
    else:
        attack_type = 'None'
    THRESHOLD = 5.0
    if attack_percentage >= THRESHOLD:
        system_status = 'ATTACK DETECTED'
    else:
        system_status = 'NORMAL TRAFFIC'
    print(f'Attack Percentage : {attack_percentage:.2f}%')
    print(f'Threshold         : {THRESHOLD:.2f}%')
    print(f'System Status     : {system_status}')
    print(f'Attack Type       : {attack_type}')
    print(f'Average Confidence: {np.mean(confidences):.2%}')
    print('=' * 70)
    try:
        Path(ENGINEERED_CSV).unlink()
    except Exception:
        pass
    print('\nInference completed successfully.')
    print('Prediction report : results/prediction_results.csv')
    return {'status': system_status, 'attack_percentage': round(attack_percentage, 2), 'attack_type': attack_type, 'confidence': round(np.mean(confidences) * 100, 2), 'counts': {cls: counts.get(cls, 0) for cls in predictor.class_names}, 'report_path': 'results/prediction_results.csv'}

def main():
    if len(sys.argv) != 2:
        print('=' * 70)
        print('Usage:')
        print('python ml/src/predict.py <input_csv>')
        print('=' * 70)
        sys.exit(1)
    predict_csv(sys.argv[1])
if __name__ == '__main__':
    main()

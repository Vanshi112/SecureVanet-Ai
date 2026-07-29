from pathlib import Path
import numpy as np
import pandas as pd
from models.config import ModelConfig
from inference.predictor import Predictor
from feature_engineering.feature_engineer import FeatureEngineeringPipeline
from inference.inference_sequence_generator import InferenceSequenceGenerator

def main():
    INPUT_CSV = 'sample_10000.csv'
    ENGINEERED_CSV = 'temp_engineered.csv'
    print('\nRunning Feature Engineering...')
    pipeline = FeatureEngineeringPipeline(INPUT_CSV, ENGINEERED_CSV)
    pipeline.run()
    print('\nGenerating Sequences...')
    generator = InferenceSequenceGenerator(sequence_length=32)
    sequences = generator.generate(ENGINEERED_CSV)
    print(f'Generated {len(sequences)} sequences')
    config = ModelConfig()
    predictor = Predictor(config)
    attack = 0
    normal = 0
    confidences = []
    for seq in sequences:
        result = predictor.predict(seq)
        confidences.append(result['confidence'])
        if result['class'] == 'Attack':
            attack += 1
        else:
            normal += 1
    prediction = 'Attack' if attack > normal else 'Normal'
    print('\n' + '=' * 60)
    print('FINAL RESULT')
    print('=' * 60)
    print(f'Prediction       : {prediction}')
    print(f'Attack Sequences : {attack}')
    print(f'Normal Sequences : {normal}')
    print(f'Average Confidence : {np.mean(confidences):.4f}')
if __name__ == '__main__':
    main()

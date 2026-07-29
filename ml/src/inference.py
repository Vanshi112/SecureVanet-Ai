import os
import sys
import argparse
import numpy as np
import torch
import torch.nn.functional as F
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer
from training.checkpoint import CheckpointManager

class InferenceEngine:

    def __init__(self):
        self.config = ModelConfig()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print('=' * 70)
        print('Loading Model')
        print('=' * 70)
        self.model = SecureVANETTransformer(self.config)
        self.checkpoint = CheckpointManager()
        checkpoint = self.checkpoint.load(model=self.model, optimizer=None, filename='best_model.pth')
        if checkpoint is None:
            raise FileNotFoundError('best_model.pth not found.')
        self.model.to(self.device)
        self.model.eval()
        print('Model Loaded Successfully')
        print(f'Device : {self.device}')
        print('=' * 70)

    @torch.no_grad()
    def load_sequence(self, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f'{file_path} not found.')
        sequence = np.load(file_path)
        if sequence.ndim != 2:
            raise ValueError(f'Expected shape (32,41), got {sequence.shape}')
        if sequence.shape != (32, 41):
            raise ValueError(f'Expected (32,41), got {sequence.shape}')
        sequence = sequence.astype(np.float32)
        sequence = torch.from_numpy(sequence)
        sequence = sequence.unsqueeze(0)
        sequence = sequence.to(self.device)
        return sequence

    @torch.no_grad()
    def load_batch(self, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f'{file_path} not found.')
        sequences = np.load(file_path)
        if sequences.ndim == 2:
            sequences = np.expand_dims(sequences, axis=0)
        if sequences.ndim != 3:
            raise ValueError(f'Expected (N,32,41), got {sequences.shape}')
        sequences = sequences.astype(np.float32)
        sequences = torch.from_numpy(sequences)
        sequences = sequences.to(self.device)
        return sequences

    @torch.no_grad()
    def predict(self, sequence):
        outputs = self.model(sequence)
        probabilities = F.softmax(outputs, dim=1)
        confidence, prediction = torch.max(probabilities, dim=1)
        return (prediction.item(), confidence.item())

    @torch.no_grad()
    def predict_batch(self, sequences):
        outputs = self.model(sequences)
        probabilities = F.softmax(outputs, dim=1)
        confidence, prediction = torch.max(probabilities, dim=1)
        return (prediction.cpu().numpy(), confidence.cpu().numpy())

    def predict_file(self, file_path: str):
        sequence = self.load_sequence(file_path)
        prediction, confidence = self.predict(sequence)
        label = 'Attack' if prediction == 1 else 'Normal'
        print()
        print('=' * 70)
        print('Inference Result')
        print('=' * 70)
        print(f'Prediction : {label}')
        print(f'Confidence : {confidence * 100:.2f}%')
        print('=' * 70)
        return (prediction, confidence)

def main():
    parser = argparse.ArgumentParser(description='SecureVANET Inference')
    parser.add_argument('input', type=str, help='Path to .npy sequence')
    args = parser.parse_args()
    engine = InferenceEngine()
    engine.predict_file(args.input)
if __name__ == '__main__':
    main()

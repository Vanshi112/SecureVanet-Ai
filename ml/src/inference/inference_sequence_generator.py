from pathlib import Path
import numpy as np
import pandas as pd

class InferenceSequenceGenerator:

    def __init__(self, sequence_length=32):
        self.sequence_length = sequence_length

    def generate(self, data):
        if isinstance(data, (str, Path)):
            df = pd.read_csv(data)
        else:
            df = data.copy()
        X = df.drop(columns=['label', 'attack_type', 'timestamp'], errors='ignore')
        X = X.values.astype(np.float32)
        sequences = []
        for i in range(len(X) - self.sequence_length + 1):
            sequences.append(X[i:i + self.sequence_length])
        return np.array(sequences, dtype=np.float32)

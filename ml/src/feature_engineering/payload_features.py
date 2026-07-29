import numpy as np
import pandas as pd

class payloadEngineering:

    def __init__(self, df: pd.DataFrame=None):
        self.df = df.copy() if df is not None else None
        self.payload_columns = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7']

    def calculate_entropy(self, values):
        values = np.array(values)
        _, cnt = np.unique(values, return_counts=True)
        prob = cnt / cnt.sum()
        return -(prob * np.log2(prob)).sum()

    def process(self, frame: dict):
        payload = np.array([frame[c] for c in self.payload_columns], dtype=float)
        payload_sum = payload.sum()
        payload_mean = payload.mean()
        payload_std = payload.std()
        payload_variance = payload.var()
        payload_max = payload.max()
        payload_min = payload.min()
        payload_range = payload_max - payload_min
        zero_byte_count = (payload == 0).sum()
        non_zero_byte_count = (payload != 0).sum()
        payload_entropy = self.calculate_entropy(payload)
        return {'payload_sum': payload_sum, 'payload_mean': payload_mean, 'payload_std': payload_std, 'payload_variance': payload_variance, 'payload_max': payload_max, 'payload_min': payload_min, 'payload_range': payload_range, 'zero_byte_count': zero_byte_count, 'non_zero_byte_count': non_zero_byte_count, 'payload_entropy': payload_entropy}

    def transform(self):
        rows = []
        for _, row in self.df.iterrows():
            rows.append(self.process(row.to_dict()))
        feature_df = pd.DataFrame(rows)
        self.df = pd.concat([self.df.reset_index(drop=True), feature_df.reset_index(drop=True)], axis=1)
        return self.df
if __name__ == '__main__':
    SAMPLE_DATA = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/time_features_sample.csv'
    df = pd.read_csv(SAMPLE_DATA, nrows=100000)
    engineer = payloadEngineering(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/payload_features_sample.csv'
    df.to_csv(OUTPUT, index=False)

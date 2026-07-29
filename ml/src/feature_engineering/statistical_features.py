from collections import deque
import pandas as pd

class StatsFeatureEngineer:

    def __init__(self, df: pd.DataFrame=None):
        self.df = df.copy() if df is not None else None
        self.window_size = 100
        self.payload_mean_window = deque(maxlen=self.window_size)
        self.payload_std_window = deque(maxlen=self.window_size)
        self.payload_max_window = deque(maxlen=self.window_size)
        self.payload_min_window = deque(maxlen=self.window_size)
        self.payload_entropy_window = deque(maxlen=self.window_size)

    def process(self, frame: dict):
        self.payload_mean_window.append(frame['payload_mean'])
        self.payload_std_window.append(frame['payload_std'])
        self.payload_max_window.append(frame['payload_max'])
        self.payload_min_window.append(frame['payload_min'])
        self.payload_entropy_window.append(frame['payload_entropy'])
        rolling_payload_mean = sum(self.payload_mean_window) / len(self.payload_mean_window)
        rolling_payload_std = sum(self.payload_std_window) / len(self.payload_std_window)
        rolling_payload_max = max(self.payload_max_window)
        rolling_payload_min = min(self.payload_min_window)
        rolling_entropy = sum(self.payload_entropy_window) / len(self.payload_entropy_window)
        return {'rolling_payload_mean': rolling_payload_mean, 'rolling_payload_std': rolling_payload_std, 'rolling_payload_max': rolling_payload_max, 'rolling_payload_min': rolling_payload_min, 'rolling_entropy': rolling_entropy}

    def transform(self):
        rows = []
        for _, row in self.df.iterrows():
            rows.append(self.process(row.to_dict()))
        feature_df = pd.DataFrame(rows)
        self.df = pd.concat([self.df.reset_index(drop=True), feature_df.reset_index(drop=True)], axis=1)
        return self.df
if __name__ == '__main__':
    SAMPLE_DATA = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/behavior_features_sample.csv'
    df = pd.read_csv(SAMPLE_DATA, nrows=100000)
    engineer = StatsFeatureEngineer(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/statistical_features_sample.csv'
    df.to_csv(OUTPUT, index=False)

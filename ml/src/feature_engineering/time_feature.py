import numpy as np
import pandas as pd

class TimeFeatureEngineer:

    def __init__(self, df: pd.DataFrame=None):
        self.df = df.copy() if df is not None else None
        self.previous_timestamp = None
        self.start_timestamp = None
        self.packet_rates = []
        self.rolling_window = 1000

    def add_interval(self):
        self.df['inter_arrival_time'] = self.df['timestamp'].diff().fillna(0)
        return self

    def add_packet_rate(self):
        epsilon = 1e-06
        self.df['packet_rate'] = 1 / (self.df['inter_arrival_time'] + epsilon)
        return self

    def add_rolling_packetrate(self, window_size=1000):
        self.df['rolling_rate'] = self.df['packet_rate'].rolling(window=window_size, min_periods=1).mean()
        return self

    def add_elapsed_time(self):
        start_time = self.df['timestamp'].iloc[0]
        self.df['elapsed_time'] = self.df['timestamp'] - start_time
        return self

    def add_time_bucket(self, bs=1.0):
        self.df['time_bucket'] = (self.df['elapsed_time'] // bs).astype(int)
        return self

    def transform(self):
        return self.add_interval().add_packet_rate().add_rolling_packetrate().add_elapsed_time().add_time_bucket().df

    def process(self, frame: dict):
        timestamp = frame['timestamp']
        if self.start_timestamp is None:
            self.start_timestamp = timestamp
        if self.previous_timestamp is None:
            self.previous_timestamp = timestamp
            return {'inter_arrival_time': 0.0, 'packet_rate': 0.0, 'rolling_rate': 0.0, 'elapsed_time': 0.0, 'time_bucket': 0}
        inter_arrival = timestamp - self.previous_timestamp
        epsilon = 1e-06
        packet_rate = 1.0 / (inter_arrival + epsilon)
        self.packet_rates.append(packet_rate)
        if len(self.packet_rates) > self.rolling_window:
            self.packet_rates.pop(0)
        rolling_rate = sum(self.packet_rates) / len(self.packet_rates)
        elapsed_time = timestamp - self.start_timestamp
        time_bucket = int(elapsed_time // 1.0)
        self.previous_timestamp = timestamp
        return {'inter_arrival_time': inter_arrival, 'packet_rate': packet_rate, 'rolling_rate': rolling_rate, 'elapsed_time': elapsed_time, 'time_bucket': time_bucket}
if __name__ == '__main__':
    SAMPLE_DATA = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/processed/merged_dataset.csv'
    df = pd.read_csv(SAMPLE_DATA, nrows=100000)
    engineer = TimeFeatureEngineer(df)
    df = engineer.transform()
    OUTPUT = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/time_features_sample.csv'
    df.to_csv(OUTPUT, index=False)
    print(OUTPUT)

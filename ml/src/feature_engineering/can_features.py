from collections import defaultdict, deque
import pandas as pd

class CANFeatureEngineer:

    def __init__(self, df: pd.DataFrame=None):
        self.df = df.copy() if df is not None else None
        self.total_packets = 0
        self.can_counts = defaultdict(int)
        self.seen_can_ids = set()
        self.previous_can_id = None
        self.window_size = 100
        self.rolling_history = deque(maxlen=self.window_size)

    def process(self, frame: dict):
        can_id = frame['can_id']
        self.total_packets += 1
        self.can_counts[can_id] += 1
        current_count = self.can_counts[can_id]
        canid_freq = current_count
        canid_normalise = current_count / self.total_packets
        if can_id in self.seen_can_ids:
            isnew_can_id = 0
        else:
            isnew_can_id = 1
            self.seen_can_ids.add(can_id)
        if self.previous_can_id is None:
            can_id_changed = 0
        else:
            can_id_changed = int(can_id != self.previous_can_id)
        self.previous_can_id = can_id
        self.rolling_history.append(current_count)
        rolling_can_frequency = sum(self.rolling_history) / len(self.rolling_history)
        return {'canid_freq': canid_freq, 'canid_normalise': canid_normalise, 'isnew_can_id': isnew_can_id, 'can_id_changed': can_id_changed, 'rolling_can_frequency': rolling_can_frequency}

    def transform(self):
        rows = []
        for _, row in self.df.iterrows():
            features = self.process(row.to_dict())
            rows.append(features)
        feature_df = pd.DataFrame(rows)
        self.df = pd.concat([self.df.reset_index(drop=True), feature_df.reset_index(drop=True)], axis=1)
        return self.df
if __name__ == '__main__':
    SAMPLE_DATA = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/payload_features_sample.csv'
    df = pd.read_csv(SAMPLE_DATA, nrows=100000)
    engineer = CANFeatureEngineer(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/can_features_sample.csv'
    df.to_csv(OUTPUT, index=False)

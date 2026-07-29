import pandas as pd

class BehaviorFeatureEngineer:

    def __init__(self, df: pd.DataFrame=None):
        self.df = df.copy() if df is not None else None
        self.payload_columns = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7']
        self.previous_can_id = None
        self.previous_payload = None
        self.consecutive_same_can_count = 0

    def process(self, frame: dict):
        can_id = frame['can_id']
        payload = [frame[c] for c in self.payload_columns]
        if self.previous_can_id is None:
            same_can_as_pvr = 0
        else:
            same_can_as_pvr = int(can_id == self.previous_can_id)
        if self.previous_payload is None:
            payload_changed = 0
            payload_hamming_distance = 0
            same_payload_as_previous = 0
        else:
            payload_changed = int(payload != self.previous_payload)
            payload_hamming_distance = sum((a != b for a, b in zip(payload, self.previous_payload)))
            same_payload_as_previous = int(payload == self.previous_payload)
        if self.previous_can_id is None:
            self.consecutive_same_can_count = 1
        elif can_id == self.previous_can_id:
            self.consecutive_same_can_count += 1
        else:
            self.consecutive_same_can_count = 1
        self.previous_can_id = can_id
        self.previous_payload = payload.copy()
        return {'same_can_as_pvr': same_can_as_pvr, 'payload_changed': payload_changed, 'payload_hamming_distance': payload_hamming_distance, 'same_payload_as_previous': same_payload_as_previous, 'consecutive_same_can_count': self.consecutive_same_can_count}

    def transform(self):
        rows = []
        for _, row in self.df.iterrows():
            rows.append(self.process(row.to_dict()))
        feature_df = pd.DataFrame(rows)
        self.df = pd.concat([self.df.reset_index(drop=True), feature_df.reset_index(drop=True)], axis=1)
        return self.df
if __name__ == '__main__':
    SAMPLE_DATA = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/can_features_sample.csv'
    df = pd.read_csv(SAMPLE_DATA, nrows=100000)
    engineer = BehaviorFeatureEngineer(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = '/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/behavior_features_sample.csv'
    df.to_csv(OUTPUT, index=False)

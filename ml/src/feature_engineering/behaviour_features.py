import pandas as pd

##explaining howw curr pakcet behaved in terms of previous oness;

class BehaviorFeatureEngineer:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.payload_columns = [
            "d0",
            "d1",
            "d2",
            "d3",
            "d4",
            "d5",
            "d6",
            "d7"
        ]

    def add_same_can_as_previous(self): ##same id or notttt
        self.df["same_can_as_pvr"] = (self.df["can_id"] == self.df["can_id"].shift(1) ).astype(int)
        self.df.loc[0, "same_can_as_pvr"] = 0
        return self

    def add_payload_changed(self):
        previous_payload = self.df[self.payload_columns].shift(1)
        changed = (self.df[self.payload_columns] != previous_payload ).any(axis=1)
        self.df["payload_changed"] = changed.astype(int)
        self.df.loc[0, "payload_changed"] = 0 ## first columnnn
        return self

    def add_payload_hamming_distance(self):
        previous_payload = self.df[self.payload_columns].shift(1)
        distance = ( self.df[self.payload_columns] != previous_payload).sum(axis=1)
        self.df["payload_hamming_distance"] = distance
        self.df.loc[0, "payload_hamming_distance"] = 0 ##hamming diatnceee
        return self

    def add_same_payload_as_previous(self):
        previous_payload = self.df[self.payload_columns].shift(1)
        same = (
            self.df[self.payload_columns] == previous_payload ).all(axis=1)
        self.df["same_payload_as_previous"] = same.astype(int)
        self.df.loc[0, "same_payload_as_previous"] = 0
        return self

    def add_consecutive_same_can_count(self):
     
        counts = []
        count = 1
        previous = None
        for can in self.df["can_id"]:
            if can == previous:
                count += 1
            else:
                count = 1
            counts.append(count)
            previous = can
        self.df["consecutive_same_can_count"] = counts
        return self

    def transform(self):

        return (
            self
            .add_same_can_as_previous()
            .add_payload_changed()
            .add_payload_hamming_distance()
            .add_same_payload_as_previous()
            .add_consecutive_same_can_count()
            .df
        )

if __name__ == "__main__":

    SAMPLE_DATA = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/can_features_sample.csv"

    df = pd.read_csv(
        SAMPLE_DATA,
        nrows=100000
    )

    engineer = BehaviorFeatureEngineer(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/behavior_features_sample.csv"

    df.to_csv(
        OUTPUT,
        index=False
    )

    print("\nBehavior Features Saved Successfully!")
import numpy as np
import pandas as pd
class payloadEngineering:

    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.payload_columns = [
            "d0", "d1",  "d2", "d3",  "d4", "d5",   "d6",  "d7"
        ]
    def add_payload_sum(self):
        self.df["payload_sum"] = self.df[self.payload_columns].sum(axis=1)
        return self

    def add_payload_mean(self):
        self.df["payload_mean"] = self.df[self.payload_columns].mean(axis=1)
        return self

    def add_payload_std(self):
        self.df["payload_std"] = self.df[self.payload_columns].std(axis=1)
        return self

    def add_payload_variance(self):
        self.df["payload_variance"] = self.df[self.payload_columns].var(axis=1)
        return self

    def add_payload_max(self):
        self.df["payload_max"] = self.df[self.payload_columns].max(axis=1)
        return self

    def add_payload_min(self):
        self.df["payload_min"] = self.df[self.payload_columns].min(axis=1)
        return self

    def add_payload_range(self):
        self.df["payload_range"] = self.df["payload_max"] -  self.df["payload_min"]
        return self
    
    def add_zero_byte_count(self):
        self.df["zero_byte_count"]= (self.df[self.payload_columns]==0).sum(axis=1)
        return self
    
    def add_non_zero_byte_count(self):
        self.df["non_zero_byte_count"]= (self.df[self.payload_columns]!=0).sum(axis=1)
        return self
    
    ##entropiesss;
    def calculate_entropy(self,values):
        values=np.array(values)
        _ ,cnt=np.unique(values,return_counts=True)
        prob=cnt/cnt.sum()
        entropy =-(prob * np.log2(prob)).sum()
        return entropy
    
    def add_payload_entropy(self):
        self.df["payload_entropy"] = self.df[self.payload_columns].apply(self.calculate_entropy, axis=1)
        return self

    def transform(self):

        return (
            self
            .add_payload_sum()
            .add_payload_mean()
            .add_payload_std()
            .add_payload_variance()
            .add_payload_max()
            .add_payload_min()
            .add_payload_range()
            .add_zero_byte_count()
            .add_non_zero_byte_count()
            .add_payload_entropy()
            .df
        )
    
    
if __name__ == "__main__":

    SAMPLE_DATA = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/time_features_sample.csv"

    df = pd.read_csv(
        SAMPLE_DATA,
        nrows=100000
    )

    engineer =payloadEngineering(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/payload_features_sample.csv"

    df.to_csv( OUTPUT, index=False)



import pandas as pd


class StatsFeatureEngineer:

    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()

    def add_rolling_payload_mean(self, window_size=100):

        self.df["rolling_payload_mean"] = (self.df["payload_mean"].rolling(window=window_size, min_periods=1).mean() )
        return self

    def add_rolling_payload_std(self, window_size=100):

        self.df["rolling_payload_std"] = (self.df["payload_std"].rolling(window=window_size, min_periods=1).mean() )
        return self

    def add_rolling_payload_max(self, window_size=100):

        self.df["rolling_payload_max"] = (
            self.df["payload_max"].rolling(window=window_size, min_periods=1).max())
        return self

    def add_rolling_payload_min(self, window_size=100):

        self.df["rolling_payload_min"] = (
            self.df["payload_min"]
            .rolling(window=window_size, min_periods=1) .min()
        )
        return self

    def add_rolling_entropy(self, window_size=100):
        self.df["rolling_entropy"] = ( self.df["payload_entropy"].rolling(window=window_size, min_periods=1)
            .mean()
        )
        return self

    def transform(self):

        return (
            self
            .add_rolling_payload_mean()
            .add_rolling_payload_std()
            .add_rolling_payload_max()
            .add_rolling_payload_min()
            .add_rolling_entropy()
            .df
        )
    

if __name__ == "__main__":

    SAMPLE_DATA = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/behavior_features_sample.csv"

    df = pd.read_csv(
        SAMPLE_DATA,
        nrows=100000
    )

    engineer = StatsFeatureEngineer(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/statistical_features_sample.csv"
    df.to_csv(OUTPUT, index=False )

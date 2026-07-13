import numpy as np
import pandas as pd

class CANFeatureEngineer:
     def __init__(self, df: pd.DataFrame):
        self.df = df.copy()

     def add_canid_freq(self):
         freq=self.df["can_id"].value_counts()
         self.df["canid_freq"]=self.df["can_id"].map(freq)
         return self
     
     def add_canid_normalise(self):
         total=len(self.df)
         self.df["canid_normalise"] = (self.df["canid_freq"] / total)
         return self
     
     def add_is_new_can_id(self):
        self.df["isnew_can_id"] = (~self.df["can_id"].duplicated()).astype(int)
        return self ##is neww
     
     def add_can_id_changed(self):
        self.df["can_id_changed"] = (self.df["can_id"] != self.df["can_id"].shift(1)).astype(int)
        self.df.loc[0, "can_id_changed"] = 0 
        return self

     def add_rolling_can_frequency(self, window_size=100):

        self.df["rolling_can_frequency"] = ( self.df.groupby("can_id").cumcount() + 1)

        self.df["rolling_can_frequency"] = (self.df["rolling_can_frequency"].rolling(window_size, min_periods=1).mean()
        )
        return self

     def transform(self):
        return (
            self
            .add_canid_freq()
            .add_canid_normalise()
            .add_is_new_can_id()
            .add_can_id_changed()
            .add_rolling_can_frequency()
            .df
        )
     
if __name__ == "__main__":

    SAMPLE_DATA = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/payload_features_sample.csv"

    df = pd.read_csv(
        SAMPLE_DATA,
        nrows=100000
    )
    engineer = CANFeatureEngineer(df)
    df = engineer.transform()
    print(df.head())
    OUTPUT =  "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/can_features_sample.csv"
    df.to_csv(
        OUTPUT,  index=False
    )

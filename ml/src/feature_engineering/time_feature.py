import numpy as np
import pandas as pd

class TimeFeatureEngineer:

     def __init__(self, df: pd.DataFrame):
        self.df = df.copy() ##constructorr

     def add_interval(self):
         self.df["inter_arrival_time"]=self.df["timestamp"].diff().fillna(0)
         return self
     
     def add_packet_rate(self):
         epsilon=1e-6 ## to avoid divide by zeroo
         self.df["packet_rate"]=1/ (self.df["inter_arrival_time"]+ epsilon)
         return self
      
     def add_rolling_packetrate(self,window_size=1000):
         self.df['rolling_rate']=self.df["packet_rate"].rolling(window=window_size,min_periods=1).mean()
         return self
     
     def add_elapsed_time(self):
         start_time=self.df["timestamp"].iloc[0]; ## first instance
         self.df["elapsed_time"]=self.df["timestamp"]- start_time
         return self
     
     def add_time_bucket(self,bs=1.0):
           self.df["time_bucket"] = (self.df["elapsed_time"] //bs).astype(int)
           return self
     
     def transform(self):

        return ( self
            .add_interval()
            .add_packet_rate()
            .add_rolling_packetrate()
            .add_elapsed_time()
            .add_time_bucket()
            .df
        )
        

if __name__ == "__main__":

    SAMPLE_DATA = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/processed/merged_dataset.csv"

    df= pd.read_csv( SAMPLE_DATA, nrows=100000)

    engineer = TimeFeatureEngineer(df)
    df = engineer.transform()
    OUTPUT =  "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/time_features_sample.csv"

    df.to_csv(
        OUTPUT, index=False
    )
    print(OUTPUT)

       

      

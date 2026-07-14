##it mergess then callls all the processess 
##time->canid->payload->beahviour->statss

from pathlib import Path
import pandas as pd
from behaviour_features import BehaviorFeatureEngineer
from payload_features import payloadEngineering
from can_features import CANFeatureEngineer
from time_feature import TimeFeatureEngineer
from statistical_features import StatsFeatureEngineer

class FeatureEngineeringPipeline:
    def __init__(self, input_file, output_file):
        self.input_file = Path(input_file)
        self.output_file = Path(output_file)

    def load_dataset(self):
        self.df = pd.read_csv(self.input_file)
        print(f"Dataset Shape : {self.df.shape}")

    def apply_time_features(self):

        self.df = (
            TimeFeatureEngineer(self.df).transform())

    def apply_payload_features(self):
        self.df = (
            payloadEngineering(self.df).transform()
        )

    def apply_can_features(self):
        self.df = (
            CANFeatureEngineer(self.df).transform()
        )

    def apply_behavior_features(self): self.df = (
            BehaviorFeatureEngineer(self.df).transform()
        )

    def apply_statistical_features(self):
        self.df = (StatsFeatureEngineer(self.df).transform())

    def validate(self):

        print(f"Shape : {self.df.shape}")
        print(f"Missing Values : {self.df.isnull().sum().sum()}")
        print(f"Duplicate Rows : {self.df.duplicated().sum()}")

    def save(self):

        self.output_file.parent.mkdir(
            parents=True,exist_ok=True
        )

        self.df.to_csv(
            self.output_file,
            index=False
        )


    def run(self):

        self.load_dataset()
        self.apply_time_features()
        self.apply_payload_features()
        self.apply_can_features()
        self.apply_behavior_features()
        self.apply_statistical_features()
        self.validate()
        self.save()


if __name__ == "__main__":

    INPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/processed/merged_dataset.csv"
    OUTPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/engineered_dataset.csv"

    pipeline = FeatureEngineeringPipeline(INPUT, OUTPUT)
    pipeline.run()



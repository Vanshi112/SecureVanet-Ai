import numpy as np
import pandas as pd

class TimeFeatureEngineer:

     def __init__(self, df: pd.DataFrame):
        self.df = df.copy() ##constructorr

     def add_interval

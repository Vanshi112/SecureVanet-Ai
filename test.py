import pandas as pd

df = pd.read_csv("datasets/processed/merged_dataset.csv")

print(df.shape)
print()
print(df["attack_type"].value_counts())
print()
print(df["label"].value_counts())
from pathlib import Path
import pandas as pd


##merge all the filess in 1 and drop one extra col forom the begininng

class DatasetMerger:

    def __init__(self, processed_dir: str | Path):
        self.processed_dir = Path(processed_dir)

    def merge(self):
        files = [
            "normal.csv",
            "dos.csv",
            "fuzzy.csv",
            "gear.csv",
            "rpm.csv"
        ]
        datasets = []
        for file in files:

            path = self.processed_dir / file
            df = pd.read_csv(path)
            df.drop(columns=["Unnamed: 0"], inplace=True, errors="ignore")
            datasets.append(df)

        merged = pd.concat( datasets, ignore_index=True )
        return merged

    def save(self, df):

        output_path = self.processed_dir / "merged_dataset.csv"
        df.to_csv(
            output_path, index=False
        )

if __name__ == "__main__":

    merger = DatasetMerger(
        "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/processed"
    )

    merged_dataset = merger.merge()
    merger.save(merged_dataset)
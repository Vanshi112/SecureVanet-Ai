from pathlib import Path
import pandas as pd

class DatasetMerger:

    def __init__(self, processed_dir: str | Path):
        self.processed_dir = Path(processed_dir)

    def merge(self):
        files = ['normal.csv', 'dos.csv', 'fuzzy.csv', 'gear.csv', 'rpm.csv']
        datasets = []
        for file in files:
            path = self.processed_dir / file
            df = pd.read_csv(path)
            df.drop(columns=['Unnamed: 0'], inplace=True, errors='ignore')
            datasets.append(df)
        CHUNK_SIZE = 50000
        merged_chunks = []
        max_rows = max((len(df) for df in datasets))
        for start in range(0, max_rows, CHUNK_SIZE):
            for df in datasets:
                chunk = df.iloc[start:start + CHUNK_SIZE]
                if not chunk.empty:
                    merged_chunks.append(chunk)
        merged = pd.concat(merged_chunks, ignore_index=True)
        return merged

    def save(self, df):
        output_path = self.processed_dir / 'merged_dataset.csv'
        df.to_csv(output_path, index=False)
if __name__ == '__main__':
    merger = DatasetMerger('datasets/processed')
    merged_dataset = merger.merge()
    merger.save(merged_dataset)

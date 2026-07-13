from pathlib import Path
import numpy as np
import pandas as pd

class sequencegenerator:

    def __init__(self,input_file,output_file,sequence_length=32):
       self.input_file=Path(input_file)
       self.output_dir=Path(output_file)
       self.sequence_length=sequence_length

    def load_dataset(self):
        self.df=pd.read_csv(self.input_file)
    
    def prep_features(self):

        print("\nPreparing Features...")

        drop_columns = [
            "label",
            "attack_type",
            "timestamp"
        ]

        self.X = self.df.drop(columns=drop_columns)

        self.y = self.df["label"]

    def create_seq(self,X,y):
            X_seq = []

            y_seq = []

            X = X.values

            y = y.values

            for i in range(len(X) - self.sequence_length + 1):

                X_seq.append(
                    X[i:i+self.sequence_length]
                )

                y_seq.append(
                    y[i+self.sequence_length-1]
                )

            return (

                np.array(
                    X_seq,
                    dtype=np.float32
                ),
                np.array(
                    y_seq,
                    dtype=np.int64
                )
            )

    
    def run(self):
      

        self.load_dataset()

        self.prep_features()

        print("\nSplitting Dataset...")

        total = len(self.X)

        train_end = int(0.70 * total)

        val_end = int(0.85 * total)

        X_train = self.X.iloc[:train_end]

        y_train = self.y.iloc[:train_end]

        X_val = self.X.iloc[train_end:val_end]

        y_val = self.y.iloc[train_end:val_end]

        X_test = self.X.iloc[val_end:]

        y_test = self.y.iloc[val_end:]

        print("Generating Train Sequences...")

        train_X, train_y = self.create_seq(
            X_train,
            y_train
        )

        print("Generating Validation Sequences...")

        val_X, val_y = self.create_seq(
            X_val,
            y_val
        )

        print("Generating Test Sequences...")

        test_X, test_y = self.create_seq(
            X_test,
            y_test
        )

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        np.save(
            self.output_dir / "train_X.npy",
            train_X
        )

        np.save(
            self.output_dir / "train_y.npy",
            train_y
        )

        np.save(
            self.output_dir / "val_X.npy",
            val_X
        )

        np.save(
            self.output_dir / "val_y.npy",
            val_y
        )

        np.save(
            self.output_dir / "test_X.npy",
            test_X
        )

        np.save(
            self.output_dir / "test_y.npy",
            test_y
        )

        print("\nDone.")

        print()

        print("Train :", train_X.shape)

        print("Validation :", val_X.shape)

        print("Test :", test_X.shape)


if __name__ == "__main__":

    INPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/features/engineered_dataset.csv"
    OUTPUT = "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences"

    generator = sequencegenerator(
        input_file=INPUT, output_file=OUTPUT,
        sequence_length=32
    )
    generator.run()


        
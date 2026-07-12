from pathlib import Path
import pandas as pd


#handlse ssmissing valuess,all payloads between 0 and 255,duplicates,datattypes of all,
##dlc validation 0<8 for all the filess


class DatasetValidator:
    def __init__(self, dataset_path: str | Path):
        self.dataset_path = Path(dataset_path)
        self.df = pd.read_csv(self.dataset_path)

    def validate_shape(self):
        print(f"Rows    : {self.df.shape[0]}")
        print(f"Columns : {self.df.shape[1]}")

    def validate_missing_values(self):
        missing = self.df.isnull().sum().sum()

        if missing == 0:
            print("PASS")
        else:
            print("FAIL")

    def validate_duplicates(self):
        duplicates = self.df.duplicated().sum()

        print(f"\nDuplicate Rows : {duplicates}")

        if duplicates == 0:
            print("PASS")
        else:
            print("FAIL")

    def validate_dtypes(self):
        print(self.df.dtypes)

    def validate_payload(self):

        payload_columns = [
            "d0",
            "d1",
            "d2",
            "d3",
            "d4",
            "d5",
            "d6",
            "d7",
        ]

        for col in payload_columns:

            minimum = self.df[col].min()
            maximum = self.df[col].max()

            if minimum >= 0 and maximum <= 255:
                print(f"{col:<5} PASS ({minimum} - {maximum})")
            else:
                print(f"{col:<5} FAIL ({minimum} - {maximum})")

    def validate_dlc(self):
        minimum = self.df["dlc"].min()
        maximum = self.df["dlc"].max()

        print("\nDLC Validation")
        print("-" * 40)

        if minimum >= 0 and maximum <= 8:
            print(f"PASS ({minimum} - {maximum})")
        else:
            print(f"FAIL ({minimum} - {maximum})")

    def validate_labels(self):

        labels = sorted(self.df["label"].unique())

        print("\nLabels")
        print("-" * 40)
        print(labels)

        if labels == [0, 1] or labels == [0]:
            print("PASS")
        else:
            print("FAIL")

    def validate_attack_types(self):

        attacks = sorted(self.df["attack_type"].unique())

        print("\nAttack Types")
        print("-" * 40)
        print(attacks)

    def validate_can_id(self):

        minimum = self.df["can_id"].min()

        print("\nCAN ID Validation")
        print("-" * 40)

        if minimum >= 0:
            print("PASS")
        else:
            print("FAIL")

    def run(self):

        print("=" * 70)
        print(f"VALIDATING : {self.dataset_path.name}")
        print("=" * 70)

        self.validate_shape()
        self.validate_missing_values()
        self.validate_duplicates()
        self.validate_dtypes()
        self.validate_payload()
        self.validate_dlc()
        self.validate_labels()
        self.validate_attack_types()
        self.validate_can_id()

        print("Validation sounds okay")


if __name__ == "__main__":

    validator = DatasetValidator(
        "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/processed/normal.csv"
    )

    validator.run()
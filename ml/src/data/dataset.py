
from pathlib import Path

import numpy as np
import torch
from torch.utils.data import Dataset


class CANDataset(Dataset):

    def __init__(self, x_path, y_path):

        self.x_path = Path(x_path)
        self.y_path = Path(y_path)

        print("=" * 60)
        print("Loading Dataset")
        print("=" * 60)

        self.X = np.load(self.x_path)
        self.y = np.load(self.y_path)

        print(f"X Shape : {self.X.shape}")
        print(f"y Shape : {self.y.shape}")

    def __len__(self):

        return len(self.X)

    def __getitem__(self, index):

        features = torch.tensor(
            self.X[index],
            dtype=torch.float32
        )

        label = torch.tensor(
            self.y[index],
            dtype=torch.long
        )

        return features, label



if __name__ == "__main__":

    dataset = CANDataset(
        "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/train_X.npy",
        "/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/train_y.npy"
    )

    print()

    print(f"Dataset Length : {len(dataset)}")

    print()

    X, y = dataset[0]

    print("Feature Shape :", X.shape)

    print("Label :", y)
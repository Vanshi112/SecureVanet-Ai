
from torch.utils.data import DataLoader
from data.dataset import CANDataset


class CANDataLoader:

    def __init__(
        self,
        train_x,
        train_y,
        val_x,
        val_y,
        test_x,
        test_y,
        batch_size=64
    ):

        self.batch_size = batch_size

        self.train_dataset = CANDataset(
            train_x,
            train_y
        )

        self.val_dataset = CANDataset(
            val_x,
            val_y
        )

        self.test_dataset = CANDataset(
            test_x,
            test_y
        )

    def create_dataloaders(self):

        train_loader = DataLoader(
            self.train_dataset,
            batch_size=self.batch_size,
            shuffle=True
        )

        val_loader = DataLoader(
            self.val_dataset,
            batch_size=self.batch_size,
            shuffle=False
        )

        test_loader = DataLoader(
            self.test_dataset,
            batch_size=self.batch_size,
            shuffle=False
        )

        return train_loader, val_loader, test_loader


# ----------------------------------------------------
# Testing
# ----------------------------------------------------

if __name__ == "__main__":

    loader = CANDataLoader(

        train_x="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/train_X.npy",
        train_y="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/train_y.npy",

        val_x="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/val_X.npy",
        val_y="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/val_y.npy",

        test_x="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/test_X.npy",
        test_y="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/test_y.npy",

        batch_size=64
    )

    train_loader, val_loader, test_loader = loader.create_dataloaders()

    print()

    print("Train Batches      :", len(train_loader))

    print("Validation Batches :", len(val_loader))

    print("Test Batches       :", len(test_loader))

    print()

    X, y = next(iter(train_loader))

    print("Batch Shape :", X.shape)

    print("Labels Shape:", y.shape)
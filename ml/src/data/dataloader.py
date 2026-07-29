from torch.utils.data import DataLoader
from data.dataset import CANDataset

class CANDataLoader:

    def __init__(self, train_x, train_y, val_x, val_y, test_x, test_y, batch_size=1024):
        self.batch_size = batch_size
        self.train_dataset = CANDataset(train_x, train_y)
        self.val_dataset = CANDataset(val_x, val_y)
        self.test_dataset = CANDataset(test_x, test_y)

    def create_dataloaders(self):
        train_loader = DataLoader(self.train_dataset, batch_size=self.batch_size, shuffle=True, num_workers=8, pin_memory=True, persistent_workers=True)
        val_loader = DataLoader(self.val_dataset, batch_size=self.batch_size, shuffle=False, num_workers=8, pin_memory=True, persistent_workers=True)
        test_loader = DataLoader(self.test_dataset, batch_size=self.batch_size, shuffle=False, num_workers=8, pin_memory=True, persistent_workers=True)
        return (train_loader, val_loader, test_loader)
if __name__ == '__main__':
    from pathlib import Path
    ROOT = Path(__file__).resolve().parents[3]
    loader = CANDataLoader(train_x=ROOT / 'datasets' / 'sequences' / 'train_X.npy', train_y=ROOT / 'datasets' / 'sequences' / 'train_y.npy', val_x=ROOT / 'datasets' / 'sequences' / 'val_X.npy', val_y=ROOT / 'datasets' / 'sequences' / 'val_y.npy', test_x=ROOT / 'datasets' / 'sequences' / 'test_X.npy', test_y=ROOT / 'datasets' / 'sequences' / 'test_y.npy', batch_size=64)
    train_loader, val_loader, test_loader = loader.create_dataloaders()
    print('Train Batches :', len(train_loader))
    print('Validation Batches :', len(val_loader))
    print('Test Batches :', len(test_loader))
    X, y = next(iter(train_loader))
    print('Batch Shape :', X.shape)
    print('Labels Shape :', y.shape)

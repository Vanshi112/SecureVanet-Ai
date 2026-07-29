from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
from data.dataloader import CANDataLoader
from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer
from training.trainer import Trainer

def main():
    config = ModelConfig()
    print('=' * 70)
    print('Loading Data')
    print('=' * 70)
    loader = CANDataLoader(train_x=ROOT / 'datasets' / 'sequences' / 'train_X.npy', train_y=ROOT / 'datasets' / 'sequences' / 'train_y.npy', val_x=ROOT / 'datasets' / 'sequences' / 'val_X.npy', val_y=ROOT / 'datasets' / 'sequences' / 'val_y.npy', test_x=ROOT / 'datasets' / 'sequences' / 'test_X.npy', test_y=ROOT / 'datasets' / 'sequences' / 'test_y.npy', batch_size=config.batch_size)
    train_loader, val_loader, test_loader = loader.create_dataloaders()
    print()
    print('=' * 70)
    print('Creating Model')
    print('=' * 70)
    model = SecureVANETTransformer(config)
    trainer = Trainer(model=model, train_loader=train_loader, val_loader=val_loader, config=config)
    trainer.train()
    print()
    print('=' * 70)
    print('Training Completed')
    print('=' * 70)
if __name__ == '__main__':
    main()

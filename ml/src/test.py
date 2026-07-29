import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import torch
import os
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, roc_auc_score, precision_recall_curve, auc, ConfusionMatrixDisplay
from data.dataloader import CANDataLoader
from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer
from training.metrics import Metrics
from training.checkpoint import CheckpointManager
from sklearn.metrics import confusion_matrix, classification_report

def main():
    config = ModelConfig()
    print('=' * 70)
    print('Loading Test Dataset')
    print('=' * 70)
    loader = CANDataLoader(train_x='datasets/sequences/train_X.npy', train_y='datasets/sequences/train_y.npy', val_x='datasets/sequences/val_X.npy', val_y='datasets/sequences/val_y.npy', test_x='datasets/sequences/test_X.npy', test_y='datasets/sequences/test_y.npy', batch_size=config.batch_size)
    _, _, test_loader = loader.create_dataloaders()
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print()
    print('=' * 70)
    print('Loading Model')
    print('=' * 70)
    model = SecureVANETTransformer(config)
    checkpoint = CheckpointManager()
    checkpoint.load(model=model, filename='best_model.pth')
    model.to(device)
    model.eval()
    criterion = torch.nn.CrossEntropyLoss()
    running_loss = 0
    all_predictions = []
    all_probabilities = []
    all_labels = []
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            running_loss += loss.item()
            probabilities = torch.softmax(outputs, dim=1)
            predictions = probabilities.argmax(dim=1)
            all_probabilities.extend(probabilities[:, 1].cpu().numpy())
            all_predictions.extend(predictions.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    metrics = Metrics.evaluate(all_labels, all_predictions)
    print()
    print('=' * 70)
    print('TEST RESULTS')
    print('=' * 70)
    print('\nConfusion Matrix')
    print(confusion_matrix(all_labels, all_predictions))
    print('\nClassification Report')
    print(classification_report(all_labels, all_predictions, digits=4))
    print(f'Loss      : {running_loss / len(test_loader):.4f}')
    print(f"Accuracy  : {metrics['accuracy'] * 100:.2f}%")
    print(f"Precision : {metrics['precision'] * 100:.2f}%")
    print(f"Recall    : {metrics['recall'] * 100:.2f}%")
    print(f"F1 Score  : {metrics['f1'] * 100:.2f}%")
    print('=' * 70)
if __name__ == '__main__':
    main()
    main()

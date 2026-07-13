"""
evaluator.py

Model Evaluation for SecureVANET-AI
"""

import torch
from pathlib import Path

from torch.utils.data import DataLoader

from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer

from training.checkpoint import CheckpointManager
from training.metrics import Metrics


class Evaluator:

    def __init__(
        self,
        model: SecureVANETTransformer,
        test_loader: DataLoader,
        config: ModelConfig,
    ):

        self.model = model

        self.test_loader = test_loader

        self.config = config

        self.device = torch.device(
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        self.model.to(self.device)

        self.criterion = torch.nn.CrossEntropyLoss()

        self.metrics = Metrics()

        self.checkpoint = CheckpointManager()

    # ---------------------------------------------------------

    def load_model(self):

        print("=" * 70)
        print("Loading Best Model")
        print("=" * 70)

        checkpoint = self.checkpoint.load(
            model=self.model,
            optimizer=None,
            filename="best_model.pth"
        )

        if checkpoint is None:

            raise FileNotFoundError(
                "best_model.pth not found."
            )

        print()

        print(f"Epoch     : {checkpoint['epoch']}")

        print(f"Loss      : {checkpoint['loss']:.4f}")

        print(f"Accuracy  : {checkpoint['accuracy']:.2f}%")

        print()

    # ---------------------------------------------------------

    @torch.no_grad()
    def predict(self):

        self.model.eval()

        running_loss = 0.0

        all_predictions = []

        all_labels = []

        print("=" * 70)
        print("Running Evaluation")
        print("=" * 70)

        for inputs, labels in self.test_loader:

            inputs = inputs.to(self.device)

            labels = labels.to(self.device)

            outputs = self.model(inputs)

            loss = self.criterion(
                outputs,
                labels
            )

            running_loss += loss.item()

            predictions = outputs.argmax(dim=1)

            all_predictions.extend(
                predictions.cpu().numpy()
            )

            all_labels.extend(
                labels.cpu().numpy()
            )

        average_loss = running_loss / len(self.test_loader)

        return (

            average_loss,

            all_labels,

            all_predictions

        )
    # ---------------------------------------------------------

    def evaluate(self):

        loss, labels, predictions = self.predict()

        results = self.metrics.evaluate(
            labels,
            predictions
        )

        print()
        print("=" * 70)
        print("Evaluation Results")
        print("=" * 70)

        print(f"Loss      : {loss:.4f}")
        print(f"Accuracy  : {results['accuracy']*100:.2f}%")
        print(f"Precision : {results['precision']*100:.2f}%")
        print(f"Recall    : {results['recall']*100:.2f}%")
        print(f"F1 Score  : {results['f1']*100:.2f}%")

        return (

            labels,

            predictions,

            results

        )

# ---------------------------------------------------------

    def print_confusion_matrix(
        self,
        labels,
        predictions
    ):

        print()
        print("=" * 70)
        print("Confusion Matrix")
        print("=" * 70)

        cm = self.metrics.confusion(
            labels,
            predictions
        )

        print(cm)

# ---------------------------------------------------------

    def print_classification_report(
        self,
        labels,
        predictions
    ):

        print()
        print("=" * 70)
        print("Classification Report")
        print("=" * 70)

        report = self.metrics.report(
            labels,
            predictions
        )

        print(report)

if __name__ == "__main__":

    from data.dataloader import CANDataLoader

    config = ModelConfig()

    loader = CANDataLoader(

        train_x="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/train_X.npy",
        train_y="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/train_y.npy",

        val_x="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/val_X.npy",
        val_y="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/val_y.npy",

        test_x="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/test_X.npy",
        test_y="/Users/vanshikasharma/Desktop/SecureVANET-AI/datasets/sequences/test_y.npy",

        batch_size=config.batch_size

    )

    _, _, test_loader = loader.create_dataloaders()

    model = SecureVANETTransformer(config)

    evaluator = Evaluator(

        model=model,

        test_loader=test_loader,

        config=config

    )

    evaluator.load_model()

    labels, predictions, results = evaluator.evaluate()

    evaluator.print_confusion_matrix(

        labels,

        predictions

    )

    evaluator.print_classification_report(

        labels,

        predictions

    )
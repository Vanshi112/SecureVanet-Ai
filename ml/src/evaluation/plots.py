"""
plots.py

Visualization utilities for SecureVANET-AI
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from sklearn.metrics import (
    ConfusionMatrixDisplay,
    confusion_matrix,
    roc_curve,
    auc,
    precision_recall_curve
)


class EvaluationPlots:

    def __init__(self, save_dir="ml/experiments/plots"):

        self.save_dir = Path(save_dir)

        self.save_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    # ----------------------------------------------------------

    def plot_confusion_matrix(
        self,
        labels,
        predictions,
        class_names
    ):

        cm = confusion_matrix(
            labels,
            predictions
        )

        fig, ax = plt.subplots(figsize=(8, 6))

        disp = ConfusionMatrixDisplay(
            confusion_matrix=cm,
            display_labels=class_names
        )

        disp.plot(
            cmap="Blues",
            ax=ax,
            colorbar=True
        )

        plt.title("Confusion Matrix")

        plt.tight_layout()

        plt.savefig(
            self.save_dir / "confusion_matrix.png",
            dpi=300
        )

        plt.close()

        print("Saved confusion_matrix.png")

    # ----------------------------------------------------------

    def plot_loss(
        self,
        train_loss,
        val_loss
    ):

        plt.figure(figsize=(8,5))

        plt.plot(
            train_loss,
            label="Train Loss"
        )

        plt.plot(
            val_loss,
            label="Validation Loss"
        )

        plt.xlabel("Epoch")

        plt.ylabel("Loss")

        plt.title("Loss Curve")

        plt.legend()

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(
            self.save_dir / "loss_curve.png",
            dpi=300
        )

        plt.close()

        print("Saved loss_curve.png")

    # ----------------------------------------------------------

    def plot_accuracy(
        self,
        train_acc,
        val_acc
    ):

        plt.figure(figsize=(8,5))

        plt.plot(
            train_acc,
            label="Train Accuracy"
        )

        plt.plot(
            val_acc,
            label="Validation Accuracy"
        )

        plt.xlabel("Epoch")

        plt.ylabel("Accuracy")

        plt.title("Accuracy Curve")

        plt.legend()

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(
            self.save_dir / "accuracy_curve.png",
            dpi=300
        )

        plt.close()

        print("Saved accuracy_curve.png")

    # ----------------------------------------------------------

    def plot_roc(
        self,
        labels,
        probabilities
    ):

        fpr, tpr, _ = roc_curve(
            labels,
            probabilities
        )

        roc_auc = auc(
            fpr,
            tpr
        )

        plt.figure(figsize=(7,7))

        plt.plot(
            fpr,
            tpr,
            label=f"AUC = {roc_auc:.4f}"
        )

        plt.plot(
            [0,1],
            [0,1],
            "--"
        )

        plt.xlabel("False Positive Rate")

        plt.ylabel("True Positive Rate")

        plt.title("ROC Curve")

        plt.legend()

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(
            self.save_dir / "roc_curve.png",
            dpi=300
        )

        plt.close()

        print("Saved roc_curve.png")

    # ----------------------------------------------------------

    def plot_precision_recall(
        self,
        labels,
        probabilities
    ):

        precision, recall, _ = precision_recall_curve(
            labels,
            probabilities
        )

        plt.figure(figsize=(7,7))

        plt.plot(
            recall,
            precision
        )

        plt.xlabel("Recall")

        plt.ylabel("Precision")

        plt.title("Precision Recall Curve")

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(
            self.save_dir / "precision_recall_curve.png",
            dpi=300
        )

        plt.close()

        print("Saved precision_recall_curve.png")


# ----------------------------------------------------------
# Testing
# ----------------------------------------------------------

if __name__ == "__main__":

    plots = EvaluationPlots()

    labels = np.array(
        [0,1,1,0,1,0,0,1]
    )

    predictions = np.array(
        [0,1,0,0,1,0,1,1]
    )

    probabilities = np.array(
        [0.05,0.91,0.31,0.22,0.99,0.15,0.62,0.83]
    )

    plots.plot_confusion_matrix(
        labels,
        predictions,
        ["Normal","Attack"]
    )

    plots.plot_roc(
        labels,
        probabilities
    )

    plots.plot_precision_recall(
        labels,
        probabilities
    )

    plots.plot_loss(
        [0.8,0.6,0.4,0.2],
        [0.9,0.7,0.5,0.3]
    )

    plots.plot_accuracy(
        [70,80,90,95],
        [68,78,89,94]
    )

    print("\nAll plots generated successfully.")
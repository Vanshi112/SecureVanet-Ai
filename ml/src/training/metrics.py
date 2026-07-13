
import torch
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

class Metrics:
    @staticmethod
    def accuracy(y_true, y_pred):

        return accuracy_score(
            y_true,
            y_pred
        )
    @staticmethod
    def precision(y_true, y_pred):

        return precision_score(
            y_true,
            y_pred,
            average="weighted",
            zero_division=0
        )

    @staticmethod
    def recall(y_true, y_pred):

        return recall_score(
            y_true,
            y_pred,
            average="weighted",
            zero_division=0
        )

    @staticmethod
    def f1(y_true, y_pred):

        return f1_score(
            y_true,
            y_pred,
            average="weighted",
            zero_division=0
        )

    @staticmethod
    def confusion(y_true, y_pred):

        return confusion_matrix(
            y_true,
            y_pred
        )

    @staticmethod
    def report(y_true, y_pred):

        return classification_report(
            y_true,
            y_pred,
            zero_division=0
        )

    @staticmethod
    def evaluate(y_true, y_pred):

        results = {

            "accuracy": Metrics.accuracy(
                y_true,
                y_pred
            ),

            "precision": Metrics.precision(
                y_true,
                y_pred
            ),

            "recall": Metrics.recall(
                y_true,
                y_pred
            ),

            "f1": Metrics.f1(
                y_true,
                y_pred
            )
        }

        return results


# if __name__ == "__main__":



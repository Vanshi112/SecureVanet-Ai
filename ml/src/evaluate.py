from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer
from data.dataloader import CANDataLoader
from evaluation.evaluator import Evaluator


def main():

    config = ModelConfig()

    loader = CANDataLoader(
        train_x="datasets/sequences/train_X.npy",
        train_y="datasets/sequences/train_y.npy",
        val_x="datasets/sequences/val_X.npy",
        val_y="datasets/sequences/val_y.npy",
        test_x="datasets/sequences/test_X.npy",
        test_y="datasets/sequences/test_y.npy",
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


if __name__ == "__main__":
    main()
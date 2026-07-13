import numpy as np

from models.config import ModelConfig
from inference.predictor import Predictor


def main():

    config = ModelConfig()

    predictor = Predictor(config)

    sample = np.random.rand(
    config.sequence_length,
    config.input_features
     ).astype(np.float32)

    result = predictor.predict(
        sample,
        return_attention=True
    )

    print("\nPrediction")
    print("=" * 60)

    print("Class      :", result["class"])
    print("Confidence :", result["confidence"])

    print("\nProbabilities")
    print(result["probabilities"])

    print("\nAttention Shape")
    print(result["attention"].shape)


if __name__ == "__main__":
    main()
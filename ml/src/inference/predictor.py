
from pathlib import Path
import numpy as np
import torch

from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer
from training.checkpoint import CheckpointManager

class Predictor:

    def __init__(self, config: ModelConfig):

        self.config = config

        self.device = torch.device(
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        self.model = SecureVANETTransformer(config)

        self.model.to(self.device)

        self.model.eval()

        self.checkpoint = CheckpointManager()

        self.class_names = [

            "Normal",
            "Attack"

        ]

        self.load_model()

    # ---------------------------------------------------------

    def load_model(self):

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

        print("=" * 70)

        print("Model Loaded Successfully")

        print("=" * 70)

    # ---------------------------------------------------------

    @torch.no_grad()

    def predict(

        self,

        sequence,

        return_attention=False

    ):

        if isinstance(sequence, np.ndarray):

            sequence = torch.tensor(

                sequence,

                dtype=torch.float32

            )

        if sequence.dim() == 2:

            sequence = sequence.unsqueeze(0)

        sequence = sequence.to(self.device)

        if return_attention:

            logits, attention = self.model(

                sequence,

                return_attention=True

            )

        else:

            logits = self.model(sequence)

            attention = None

        probabilities = torch.softmax(

            logits,

            dim=1

        )

        confidence, prediction = torch.max(

            probabilities,

            dim=1

        )

        result = {

            "prediction":

                int(prediction.item()),

            "class":

                self.class_names[

                    prediction.item()

                ],

            "confidence":

                float(confidence.item()),

            "probabilities":

                probabilities.squeeze()

                .cpu()

                .numpy()

        }

        if attention is not None:

            result["attention"] = (

                attention.squeeze()

                .cpu()

                .numpy()

            )

        return result


# ---------------------------------------------------------
# Testing
# ---------------------------------------------------------

if __name__ == "__main__":

    config = ModelConfig()

    predictor = Predictor(config)

    sample = np.random.rand(

        32,

        config.input_dim

    ).astype(np.float32)

    prediction = predictor.predict(

        sample,

        return_attention=True

    )

    print()

    print("=" * 70)

    print("Prediction Result")

    print("=" * 70)

    print(

        f"Predicted Class : {prediction['class']}"

    )

    print(

        f"Confidence      : {prediction['confidence']:.4f}"

    )

    print()

    print(

        "Probability Vector"

    )

    print(

        prediction["probabilities"]

    )

    print()

    print(

        "Attention Shape"

    )

    print(

        prediction["attention"].shape

    )
"""
checkpoint.py

Checkpoint Manager for SecureVANET-AI
"""

from pathlib import Path
import torch


class CheckpointManager:

    def __init__(self, checkpoint_dir="ml/checkpoints"):

        self.checkpoint_dir = Path(checkpoint_dir)

        self.checkpoint_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    def save(
        self,
        model,
        optimizer,
        epoch,
        loss,
        accuracy,
        filename="best_model.pth"
    ):

        checkpoint = {

            "epoch": epoch,

            "model_state_dict":
                model.state_dict(),

            "optimizer_state_dict":
                optimizer.state_dict(),

            "loss": loss,

            "accuracy": accuracy

        }

        save_path = self.checkpoint_dir / filename

        torch.save(
            checkpoint,
            save_path
        )

        print(f"\nCheckpoint Saved : {save_path}")

    def load(
        self,
        model,
        optimizer=None,
        filename="best_model.pth"
    ):

        checkpoint_path = self.checkpoint_dir / filename

        if not checkpoint_path.exists():

            print("Checkpoint Not Found.")

            return None

        checkpoint = torch.load(
            checkpoint_path,
            map_location="cpu"
        )

        model.load_state_dict(
            checkpoint["model_state_dict"]
        )

        if optimizer is not None:

            optimizer.load_state_dict(
                checkpoint["optimizer_state_dict"]
            )

        print(f"\nCheckpoint Loaded : {checkpoint_path}")

        return checkpoint

    def latest(self):

        checkpoints = list(
            self.checkpoint_dir.glob("*.pth")
        )

        if len(checkpoints) == 0:

            return None

        checkpoints.sort(
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )

        return checkpoints[0]
    
if __name__ == "__main__":

    import torch.nn as nn

    model = nn.Linear(10, 2)

    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=0.001
    )

    manager = CheckpointManager()

    manager.save(
        model=model,
        optimizer=optimizer,
        epoch=1,
        loss=0.25,
        accuracy=98.5
    )

    checkpoint = manager.load(
        model=model,
        optimizer=optimizer
    )

    print()

    print(checkpoint["epoch"])

    print(checkpoint["loss"])

    print(checkpoint["accuracy"])
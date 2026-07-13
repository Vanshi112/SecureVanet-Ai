
import time
from pathlib import Path
import torch
from torch.amp import autocast, GradScaler
from tqdm import tqdm
from torch.utils.tensorboard import SummaryWriter
import torch.nn as nn
from torch.optim import AdamW
from torch.utils.data import DataLoader
from training.metrics import Metrics
from training.early_stopping import EarlyStopping
from training.checkpoint import CheckpointManager
from models.config import ModelConfig
from models.transformer_model import SecureVANETTransformer


class Trainer:

    def __init__(
        self,
        model: nn.Module,
        train_loader: DataLoader,
        val_loader: DataLoader,
        config: ModelConfig
    ):

        self.model = model

        self.train_loader = train_loader

        self.val_loader = val_loader

        self.config = config

        self.device = torch.device(
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        self.model.to(self.device)

        self.criterion = nn.CrossEntropyLoss()

        self.optimizer = AdamW(

            self.model.parameters(),

            lr=config.learning_rate,

            weight_decay=config.weight_decay

        )

        self.scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(

            self.optimizer,

            T_max=config.epochs

        )

        self.best_accuracy = 0
        self.metrics = Metrics()

        self.early_stopping = EarlyStopping(
            patience=5,
            min_delta=1e-4
        )

        self.checkpoint = CheckpointManager()
        self.writer = SummaryWriter(
        log_dir="ml/experiments/runs"
         )

        self.scaler = GradScaler(
        "cuda",
        enabled=torch.cuda.is_available())

    # -----------------------------------------------------

    def train_one_epoch(self):

        self.model.train()

        running_loss = 0

        correct = 0

        total = 0

        progress = tqdm(
            self.train_loader,
            desc="Training",
            leave=False
        )

        for inputs, labels in progress:

            inputs = inputs.to(self.device)

            labels = labels.to(self.device)

            self.optimizer.zero_grad()

            with autocast(
                device_type="cuda",
                enabled=torch.cuda.is_available()
            ):

                outputs = self.model(inputs)

                loss = self.criterion(
                    outputs,
                    labels
                )

            self.scaler.scale(loss).backward()

            self.scaler.unscale_(self.optimizer)

            torch.nn.utils.clip_grad_norm_(

                self.model.parameters(),

                self.config.gradient_clip

            )

            self.scaler.step(self.optimizer)

            self.scaler.update()

            running_loss += loss.item()

            predictions = outputs.argmax(dim=1)

            correct += (predictions == labels).sum().item()

            total += labels.size(0)

            progress.set_postfix(
                loss=f"{loss.item():.4f}"
            )

        epoch_loss = running_loss / len(self.train_loader)

        epoch_accuracy = 100 * correct / total

        return epoch_loss, epoch_accuracy

    @torch.no_grad()
    def validate(self):

        self.model.eval()

        running_loss = 0

        all_predictions = []

        all_labels = []

        for inputs, labels in self.val_loader:

            inputs = inputs.to(self.device)
            labels = labels.to(self.device)

            with autocast(
            device_type="cuda",
            enabled=torch.cuda.is_available()
            ):

             outputs = self.model(inputs)

             loss = self.criterion(outputs, labels)


            running_loss += loss.item()

            predictions = outputs.argmax(dim=1)

            all_predictions.extend(
                predictions.cpu().numpy()
            )

            all_labels.extend(
                labels.cpu().numpy()
            )

        validation_loss = running_loss / len(self.val_loader)

        results = self.metrics.evaluate(
            all_labels,
            all_predictions
        )

        return validation_loss, results
    # -----------------------------------------------------

    def save_checkpoint(
            self,
            epoch,
            loss,
            accuracy
        ):

        self.checkpoint.save(

            model=self.model,

            optimizer=self.optimizer,

            epoch=epoch,

            loss=loss,

            accuracy=accuracy,

            filename="best_model.pth"

        )

    # -----------------------------------------------------

    def train(self):

        print("=" * 70)

        print("Starting Training")

        print("=" * 70)

        for epoch in range(

            self.config.epochs

        ):

            start = time.time()

            train_loss, train_acc = (

                self.train_one_epoch()

            )

            val_loss, metrics = self.validate()

            val_acc = metrics["accuracy"] * 100
            self.scheduler.step()

            if val_acc >= self.best_accuracy:

                self.best_accuracy = val_acc

                self.save_checkpoint(
                    epoch=epoch + 1,
                    loss=val_loss,
                    accuracy=val_acc
                )

            # Save every epoch
            self.checkpoint.save(
                    model=self.model,
                    optimizer=self.optimizer,
                    epoch=epoch + 1,
                    loss=val_loss,
                    accuracy=val_acc,
                    filename="last_model.pth"
                )

            elapsed = (
                time.time() - start )

            print(f"Train Loss : {train_loss:.4f}")

            print(f"Train Acc  : {train_acc:.2f}%")

            print(f"Val Loss   : {val_loss:.4f}")

            print(f"Accuracy   : {metrics['accuracy']*100:.2f}%")

            print(f"Precision  : {metrics['precision']*100:.2f}%")

            print(f"Recall     : {metrics['recall']*100:.2f}%")

            print(f"F1 Score   : {metrics['f1']*100:.2f}%")

            print(f"LR         : {self.optimizer.param_groups[0]['lr']:.8f}")

            print(f"Time       : {elapsed:.2f} sec")

            print("-"*70)
            self.writer.add_scalar(
                "Loss/Train",
                train_loss,
                epoch
            )

            self.writer.add_scalar(
                "Loss/Validation",
                val_loss,
                epoch
            )

            self.writer.add_scalar(
                "Accuracy/Train",
                train_acc,
                epoch
            )

            self.writer.add_scalar(
                "Accuracy/Validation",
                val_acc,
                epoch
            )

            self.writer.add_scalar(
                "LearningRate",
                self.optimizer.param_groups[0]["lr"],
                epoch
            )
            
            if self.early_stopping(val_loss):

                print()
                print("=" * 70)
                print("Early Stopping Triggered")
                print("=" * 70)

                break
        self.writer.close()
          

               

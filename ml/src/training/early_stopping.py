
class EarlyStopping:

    def __init__(
        self,
        patience=5,
        min_delta=0.0
    ):

        self.patience = patience
        self.min_delta = min_delta

        self.best_loss = float("inf")

        self.counter = 0

        self.stop = False

    def __call__(self, validation_loss):

        if validation_loss < self.best_loss - self.min_delta:

            self.best_loss = validation_loss

            self.counter = 0

            return False

        self.counter += 1

        print(
            f"EarlyStopping Counter : {self.counter}/{self.patience}"
        )

        if self.counter >= self.patience:

            self.stop = True

        return self.stop

    def reset(self):

        self.best_loss = float("inf")

        self.counter = 0

        self.stop = False


# ------------------------------------------------------
# Testing
# ------------------------------------------------------

if __name__ == "__main__":

    stopper = EarlyStopping(
        patience=3,
        min_delta=0.001
    )

    losses = [

        0.50,

        0.40,

        0.36,

        0.35,

        0.351,

        0.352,

        0.354,

        0.355

    ]

    for epoch, loss in enumerate(losses, start=1):

        print()

        print(f"Epoch {epoch}")

        print(f"Validation Loss : {loss}")

        if stopper(loss):

            print()

            print("Training Stopped.")

            break
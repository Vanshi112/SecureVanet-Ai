from dataclasses import dataclass

@dataclass
class ModelConfig:
    sequence_length: int = 32
    input_features: int = 41
    num_classes: int = 5
    class_weights: list | None = None
    embedding_dim: int = 128
    num_heads: int = 8
    classifier_hidden_dim: int = 128
    num_encoder_layers: int = 4
    transformer_dropout: float = 0.2
    gradient_clip: float = 1.0
    checkpoint_dir: str = 'checkpoints'
    feedforward_dim: int = 512
    lstm_hidden_size: int = 128
    lstm_num_layers: int = 2
    lstm_dropout: float = 0.2
    attention_dim: int = 128
    classifier_dropout: float = 0.5
    batch_size: int = 1024
    learning_rate: float = 0.0001
    weight_decay: float = 0.0001
    epochs: int = 50
    device: str = 'cuda'
    random_seed: int = 42

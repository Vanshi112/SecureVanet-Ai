import torch
import torch.nn as nn
from models.config import ModelConfig

class TransformerEncoderBlock(nn.Module):

    def __init__(self, config: ModelConfig):
        super().__init__()
        encoder_layer = nn.TransformerEncoderLayer(d_model=config.embedding_dim, nhead=config.num_heads, dim_feedforward=config.feedforward_dim, dropout=config.transformer_dropout, activation='gelu', batch_first=True, norm_first=True)
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=config.num_encoder_layers)

    def forward(self, x):
        return self.encoder(x)
if __name__ == '__main__':
    config = ModelConfig()
    batch_size = 8
    sequence_length = config.sequence_length
    embedding_dim = config.embedding_dim
    x = torch.randn(batch_size, sequence_length, embedding_dim)
    model = TransformerEncoderBlock(config)
    output = model(x)

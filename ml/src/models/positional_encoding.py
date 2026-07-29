import math
import torch
import torch.nn as nn

class PositionalEncoding(nn.Module):

    def __init__(self, embedding_dim: int, max_length: int=5000, dropout: float=0.1):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        position = torch.arange(max_length, dtype=torch.float32).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, embedding_dim, 2, dtype=torch.float32) * (-math.log(10000.0) / embedding_dim))
        pe = torch.zeros(max_length, embedding_dim, dtype=torch.float32)
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)

    def forward(self, x):
        x = x + self.pe[:, :x.size(1)]
        return self.dropout(x)
if __name__ == '__main__':
    batch_size = 4
    sequence_length = 32
    embedding_dim = 128
    x = torch.randn(batch_size, sequence_length, embedding_dim)
    encoder = PositionalEncoding(embedding_dim=embedding_dim)
    output = encoder(x)
    print('Input Shape :', x.shape)
    print('Output Shape:', output.shape)

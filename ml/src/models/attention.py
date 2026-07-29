import torch
import torch.nn as nn

class AttentionPooling(nn.Module):

    def __init__(self, hidden_dim: int):
        super().__init__()
        self.attention = nn.Sequential(nn.Linear(hidden_dim, hidden_dim), nn.Tanh(), nn.Linear(hidden_dim, 1))

    def forward(self, x):
        scores = self.attention(x)
        weights = torch.softmax(scores, dim=1)
        context = torch.sum(weights * x, dim=1)
        return (context, weights.squeeze(-1))
if __name__ == '__main__':
    batch_size = 4
    sequence_length = 32
    hidden_dim = 256
    x = torch.randn(batch_size, sequence_length, hidden_dim)
    attention = AttentionPooling(hidden_dim)
    context, weights = attention(x)

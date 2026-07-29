import torch
import torch.nn as nn
from models.config import ModelConfig
from models.positional_encoding import PositionalEncoding
from models.transformer_encoder import TransformerEncoderBlock
from models.attention import AttentionPooling

class SecureVANETTransformer(nn.Module):

    def __init__(self, config: ModelConfig):
        super().__init__()
        self.config = config
        self.embedding = nn.Linear(config.input_features, config.embedding_dim)
        self.position = PositionalEncoding(embedding_dim=config.embedding_dim, dropout=config.transformer_dropout)
        self.transformer = TransformerEncoderBlock(config)
        self.lstm = nn.LSTM(input_size=config.embedding_dim, hidden_size=config.lstm_hidden_size, num_layers=config.lstm_num_layers, batch_first=True, dropout=config.lstm_dropout, bidirectional=True)
        self.attention = AttentionPooling(hidden_dim=config.lstm_hidden_size * 2)
        self.classifier = nn.Sequential(nn.LayerNorm(config.lstm_hidden_size * 2), nn.Dropout(config.classifier_dropout), nn.Linear(config.lstm_hidden_size * 2, config.classifier_hidden_dim), nn.GELU(), nn.Dropout(config.classifier_dropout), nn.Linear(128, config.num_classes))

    def forward(self, x, return_attention=False):
        x = self.embedding(x)
        x = self.position(x)
        x = self.transformer(x)
        lstm_output, _ = self.lstm(x)
        context, attention_weights = self.attention(lstm_output)
        logits = self.classifier(context)
        if return_attention:
            return (logits, attention_weights)
        return logits
if __name__ == '__main__':
    config = ModelConfig()
    model = SecureVANETTransformer(config)
    x = torch.randn(8, config.sequence_length, config.input_features)
    logits, attention = model(x)

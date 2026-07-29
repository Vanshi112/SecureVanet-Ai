from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = 'SecureVANET-AI'
    APP_VERSION: str = '1.0.0'
    DATABASE_URL: str = 'postgresql://vanshikasharma@localhost:5432/securevanet'
    MODEL_PATH: str = '../ml/checkpoints/best_model.pth'

    class Config:
        env_file = '.env'
settings = Settings()

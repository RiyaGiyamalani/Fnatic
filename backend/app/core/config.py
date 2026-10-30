import os
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings:
    PROJECT_NAME: str = "Rural Sahayak (ग्रामीण सहायक)"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Paths
    KNOWLEDGE_BASE_DIR: Path = BASE_DIR / "knowledge_base"
    MODELS_DIR: Path = BASE_DIR / "models"
    
    # LLM Settings (Local Qwen3 1.7B)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "qwen3:1.7b")
    LLM_CONTEXT_WINDOW: int = int(os.getenv("LLM_CONTEXT_WINDOW", "4096"))
    
    # Database Settings (Microsoft SQL Server)
    DB_SERVER: str = os.getenv("DB_SERVER", "localhost\\SQLEXPRESS")
    DB_NAME: str = os.getenv("DB_NAME", "RuralSahayakDB")
    DB_USER: Optional[str] = os.getenv("DB_USER", "")
    DB_PASSWORD: Optional[str] = os.getenv("DB_PASSWORD", "")
    DB_DRIVER: str = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")
    
    # External API Keys (Blank by default per user request)
    HF_TOKEN: Optional[str] = os.getenv("HF_TOKEN", "")
    BHASHINI_USER_ID: Optional[str] = os.getenv("BHASHINI_USER_ID", "")
    BHASHINI_API_KEY: Optional[str] = os.getenv("BHASHINI_API_KEY", "")
    BHASHINI_PIPELINE_ID: Optional[str] = os.getenv("BHASHINI_PIPELINE_ID", "")
    FAST2SMS_API_KEY: Optional[str] = os.getenv("FAST2SMS_API_KEY", "")
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN", "")
    WHATSAPP_API_TOKEN: Optional[str] = os.getenv("WHATSAPP_API_TOKEN", "")

settings = Settings()


from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    llm_provider: str = "ollama"
    llm_api_key: str = ""
    ollama_base_url: str = "http://ollama:11434"
    cors_origins: list[str] = ["http://localhost:5173"]

settings = Settings()
from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

from ..settings import Settings


class LLMClient(ABC):
    @abstractmethod
    async def stream(self, messages: list[dict]) -> AsyncIterator[str]:
        """Yield chunk testuali (delta.content) dal provider LLM."""
        ...


class LiteLLMClient(LLMClient):
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def stream(self, messages: list[dict]) -> AsyncIterator[str]:
        raise NotImplementedError
        yield  # pragma: no cover  # rende la funzione un async generator

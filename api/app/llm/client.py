from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

import httpx

from ..settings import Settings

HTTP_TIMEOUT_SECONDS = 60.0


class LLMClient(ABC):
    @abstractmethod
    async def stream(self, messages: list[dict]) -> AsyncIterator[str]:
        """Yield chunk testuali (delta.content) dal provider LLM."""
        ...


class LiteLLMClient(LLMClient):
    """Client SSE per un gateway LiteLLM (API compatibile OpenAI)."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = httpx.AsyncClient(
            base_url=settings.litellm_base_url,
            timeout=HTTP_TIMEOUT_SECONDS,
            headers={"Authorization": f"Bearer {settings.litellm_api_key}"},
        )

    async def aclose(self) -> None:
        """Chiude il client HTTP sottostante (da invocare allo shutdown dell'app)."""
        await self._client.aclose()

    async def stream(self, messages: list[dict]) -> AsyncIterator[str]:
        raise NotImplementedError
        yield  # pragma: no cover  # rende la funzione un async generator

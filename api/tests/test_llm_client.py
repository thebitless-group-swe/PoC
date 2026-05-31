"""Test del LiteLLMClient: configurazione httpx, parsing SSE e mapping errori.

Le richieste di rete sono sempre intercettate da httpx.MockTransport: nessun
test tocca la rete reale. La fixture SSE (api/tests/fixtures/litellm_sse.txt)
è una cattura reale dal gateway LiteLLM, usata per validare il parsing.
"""

from app.llm.client import HTTP_TIMEOUT_SECONDS, LiteLLMClient
from app.settings import Settings


# --- #13 (POC-B-05): __init__ e setup httpx -------------------------------


async def test_init_configura_client_httpx() -> None:
    settings = Settings(
        litellm_base_url="http://litellm:4000/v1",
        litellm_model="gemma3:1b",
        litellm_api_key="chiave-segreta",
    )
    client = LiteLLMClient(settings)

    # httpx normalizza la base_url aggiungendo lo slash finale.
    assert str(client._client.base_url) == "http://litellm:4000/v1/"
    # httpx normalizza la chiave header in minuscolo.
    assert client._client.headers["authorization"] == "Bearer chiave-segreta"
    assert client._client.timeout.read == HTTP_TIMEOUT_SECONDS

    await client.aclose()


async def test_aclose_chiude_il_client() -> None:
    client = LiteLLMClient(Settings())

    assert client._client.is_closed is False
    await client.aclose()
    assert client._client.is_closed is True

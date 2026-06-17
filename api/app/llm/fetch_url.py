import os

from tavily import TavilyClient

MAX_CHARS = 12_000


class FetchError(Exception):
    """Errore durante l'estrazione del contenuto della pagina."""


def _get_client() -> TavilyClient:
    api_key = os.environ.get("TAVILY_API_KEY")
    return TavilyClient(api_key=api_key)


async def fetch_and_extract(url: str) -> str:
    client = _get_client()

    try:
        response = client.extract(
            urls=url,
            extract_depth="basic",
            format="text",
        )
    except Exception as exc:
        raise FetchError("Estrazione fallita") from exc

    results = response.get("results", [])
    if not results:
        raise FetchError("Nessun contenuto estraibile")

    content = results[0].get("raw_content", "")
    if not content:
        raise FetchError("Nessun contenuto estraibile")

    return content[:MAX_CHARS]
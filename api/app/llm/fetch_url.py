import httpx
from bs4 import BeautifulSoup

MAX_BYTES = 2 * 1024 * 1024 


class FetchError(Exception):
    """Errore base durante il fetch."""

class ContentTypeError(FetchError):
    """Il Content-Type non è text/html."""

class ContentTooLargeError(FetchError):
    """Il contenuto supera il limite di 2 MB."""


async def fetch_and_extract(url: str) -> str:
    async with httpx.AsyncClient(timeout=10.0) as client:
        async with client.stream("GET", url) as response:
            response.raise_for_status()

            content_type = response.headers.get("content-type", "")
            if "text/html" not in content_type:
                raise ContentTypeError("Content-Type non supportato")

            chunks = []
            size = 0
            async for chunk in response.aiter_bytes():
                size += len(chunk)
                if size > MAX_BYTES:
                    raise ContentTooLargeError("limite 2 MB")
                chunks.append(chunk)

    html = b"".join(chunks).decode("utf-8", errors="replace")
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style"]):
        tag.decompose()
    return soup.get_text(separator=" ", strip=True)


def validate_link(url: str) -> None:
    raise NotImplementedError  # TODO: B-05

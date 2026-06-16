import pytest
import respx
import httpx

from app.fetcher import fetch_and_extract, ContentTypeError, ContentTooLargeError

SAMPLE_HTML = """
<html>
  <head><title>Test</title><style>body { color: red; }</style></head>
  <body>
    <script>alert('xss')</script>
    <h1>Titolo principale</h1>
    <p>Questo è il testo della pagina di prova.</p>
  </body>
</html>
"""


# Su una pagina HTML in fixture estrae testo non vuoto
@pytest.mark.asyncio
@respx.mock
async def test_fetch_and_extract_returns_text() -> None:
    respx.get("https://example.com").mock(
        return_value=httpx.Response(
            200,
            text=SAMPLE_HTML,
            headers={"content-type": "text/html; charset=utf-8"},
        )
    )

    result = await fetch_and_extract("https://example.com")

    assert result.strip() != ""
    assert "Titolo principale" in result
    assert "alert" not in result   # script rimosso
    assert "color: red" not in result  # style rimosso


# Troppo grande → errore
@pytest.mark.asyncio
@respx.mock
async def test_fetch_and_extract_too_large() -> None:
    big_content = b"x" * (2 * 1024 * 1024 + 1)
    respx.get("https://example.com").mock(
        return_value=httpx.Response(
            200,
            content=big_content,
            headers={"content-type": "text/html"},
        )
    )

    with pytest.raises(ContentTooLargeError):
        await fetch_and_extract("https://example.com")


# Non testo → errore
@pytest.mark.asyncio
@respx.mock
async def test_fetch_and_extract_wrong_content_type() -> None:
    respx.get("https://example.com").mock(
        return_value=httpx.Response(
            200,
            content=b"%PDF-1.4",
            headers={"content-type": "application/pdf"},
        )
    )

    with pytest.raises(ContentTypeError):
        await fetch_and_extract("https://example.com")
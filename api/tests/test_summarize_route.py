import pytest
from fastapi.testclient import TestClient

from app.llm import get_llm_client
from app.main import app
from tests.conftest import DummyLLMClient

#Sostituisce il LiteLLMClient con il dummy prima di OGNI test (autouse=True)
#Una volta finito lo rimuove
@pytest.fixture(autouse=True)
def _override_llm_client():
    #Sostituisce il LiteLLMClient con il dummy, utile per test pre implementazione
    app.dependency_overrides[get_llm_client] = lambda: DummyLLMClient()
    yield
    #Cancella il dummy DOPO il test (teardown)
    app.dependency_overrides.clear()

#Controlla lo status code ed il contenuto dell'header
def test_returns_200_and_sse_content_type(client: TestClient) -> None:
    response = client.post(
        "/api/summarize",
        json={
            "text": "Un testo abbastanza lungo per fare test test. Lorem ipsum dolor sit amet.",
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")

#Controlla che i chunk del dummy arrivino formattati correttamente secondo standard SSE
def test_streams_dummy_chunks_in_sse_format(client: TestClient) -> None:
    response = client.post(
        "/api/summarize",
        json = {
            "text": "Testo abbastanza lungo, lorem ipsum dolor sit amet",
        }
    )

    body = response.text

    assert "data: chunk1 \n\n" in body
    assert "data: chunk2 \n\n" in body
    assert "data: fine\n\n" in body

#Controlla che il marker di fine stream sia corretto ("[DONE]\n\n")
def test_terminates_with_done_marker(client: TestClient) -> None:
    response = client.post(
        "/api/summarize",
        json = {
            "text": "Testo abbastanza lungo, lorem ipsum dolor sit amet",
        }
    )

    assert response.text.endswith("data: [DONE]\n\n")

#Controlla che i testi troppo corti per essere riassunti vengano bloccati con errore 422
def test_validation_error_on_short_text(client: TestClient) -> None:
    response = client.post("/api/summarize", json={"text": "corto"})

    assert response.status_code == 422

#Controlla che i chunks vengano ricevuti e formattati correttamente
def test_endpoint_uses_injected_client() -> None:
    dummy_chunks = ["AAA", "BBB"]
    app.dependency_overrides[get_llm_client] = lambda: DummyLLMClient(dummy_chunks)
    client = TestClient(app)

    response = client.post(
        "/api/summarize",
        json = {
            "text": "Testo abbastanza lungo, lorem ipsum dolor sit amet"
        }
    )

    body = response.text
    assert "data: AAA\n\n" in body
    assert "data: BBB\n\n" in body
    assert body.endswith("data: [DONE]\n\n")
    #chunk1 (default del dummyLLMClient) non deve essere presente
    assert "chunk1" not in body

    app.dependency_overrides.clear()
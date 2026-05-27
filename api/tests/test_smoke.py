from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert "model" in body


def test_summarize_stub_returns_501(client: TestClient) -> None:
    response = client.post("/api/summarize", json={"text": "testo abbastanza lungo"})
    assert response.status_code == 501
    assert response.json()["detail"]

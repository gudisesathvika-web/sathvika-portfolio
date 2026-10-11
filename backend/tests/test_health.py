"""Health endpoint tests."""


def test_health_returns_ok(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "ok"
    assert body["service"]
    assert body["version"]
    assert body["environment"]


def test_health_does_not_leak_configuration(client):
    response = client.get("/api/v1/health")
    payload = response.text.lower()
    assert "database_url" not in payload
    assert "postgresql" not in payload
    assert "password" not in payload


def test_root_metadata_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["api"] == "/api/v1"

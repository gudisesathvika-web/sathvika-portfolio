"""Project endpoint tests — published-only public listing and error shape."""

from app.models.project import Project


def _add(session_factory, **overrides):
    defaults = {
        "id": "sample",
        "title": "Sample",
        "direction": "Direction",
        "summary": "Summary text.",
        "stack": ["Python"],
        "is_published": True,
    }
    defaults.update(overrides)
    with session_factory() as db:
        db.add(Project(**defaults))
        db.commit()


def test_public_endpoint_returns_published_only(client, session_factory):
    _add(session_factory, id="skillforge", title="SkillForge", is_published=True)
    _add(session_factory, id="draft-one", title="Draft One", is_published=False)
    _add(session_factory, id="accessguard", title="AccessGuard", is_published=True)

    response = client.get("/api/v1/projects")
    assert response.status_code == 200

    ids = [project["id"] for project in response.json()]
    assert ids == ["accessguard", "skillforge"]  # alphabetical by title
    assert "draft-one" not in ids


def test_empty_database_returns_empty_list(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    assert response.json() == []


def test_unknown_route_returns_structured_error(client):
    response = client.get("/api/v1/projects/does-not-exist")
    assert response.status_code == 404

    body = response.json()
    assert body["error"]["code"] == 404
    assert "request_id" in body["error"]

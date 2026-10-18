from app.models.achievement import Achievement


def _create_owner(session_factory, email="owner@example.com", password="correct-horse-battery-staple"):
    from app.core.security import hash_password
    from app.models.auth import Owner

    with session_factory() as db:
        db.add(Owner(email=email, password_hash=hash_password(password)))
        db.commit()


def _login(client, password="correct-horse-battery-staple"):
    return client.post("/api/v1/auth/login", json={"password": password})


def _csrf(client):
    return client.cookies.get("sathvika_csrf")


def test_public_achievements_published_only(client, session_factory):
    with session_factory() as db:
        db.add(Achievement(id="pub", title="Published", detail="d", is_published=True))
        db.add(Achievement(id="draft", title="Draft", detail="d", is_published=False))
        db.commit()

    response = client.get("/api/v1/achievements")
    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == ["pub"]


def test_admin_achievements_require_auth(client):
    assert client.get("/api/v1/admin/achievements").status_code == 401


def test_admin_achievements_require_csrf(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    response = client.post("/api/v1/admin/achievements", json={"id": "new", "title": "New"})
    assert response.status_code == 403


def test_admin_achievement_crud(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    create = client.post(
        "/api/v1/admin/achievements",
        headers={"X-CSRF-Token": _csrf(client)},
        json={"id": "new", "title": "New", "detail": "Detail", "is_published": False},
    )
    assert create.status_code == 201

    update = client.patch(
        "/api/v1/admin/achievements/new",
        headers={"X-CSRF-Token": _csrf(client)},
        json={"title": "Updated", "is_published": True},
    )
    assert update.status_code == 200
    assert update.json()["title"] == "Updated"
    assert update.json()["is_published"] is True

    listing = client.get("/api/v1/admin/achievements")
    assert listing.status_code == 200
    assert any(item["id"] == "new" for item in listing.json())

    delete = client.delete("/api/v1/admin/achievements/new", headers={"X-CSRF-Token": _csrf(client)})
    assert delete.status_code == 204
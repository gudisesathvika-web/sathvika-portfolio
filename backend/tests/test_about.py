from app.models.about import AboutContent


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


def test_public_about_returns_published_content(client, session_factory):
    with session_factory() as db:
        db.add(AboutContent(title="Published About", paragraphs=["Hello"], facts=[{"label": "Focus", "value": "AI"}], is_published=True))
        db.commit()

    response = client.get("/api/v1/about")
    assert response.status_code == 200
    assert response.json()["title"] == "Published About"
    assert response.json()["is_published"] is True


def test_public_about_hides_draft(client, session_factory):
    with session_factory() as db:
        db.add(AboutContent(title="Draft About", paragraphs=["Draft"], facts=[], is_published=False))
        db.commit()

    response = client.get("/api/v1/about")
    assert response.status_code == 404


def test_admin_about_requires_auth(client):
    assert client.get("/api/v1/admin/about").status_code == 401


def test_admin_about_requires_csrf(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    response = client.put("/api/v1/admin/about", json={"title": "Updated"})
    assert response.status_code == 403


def test_admin_about_update_persists(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    response = client.put(
        "/api/v1/admin/about",
        headers={"X-CSRF-Token": _csrf(client)},
        json={
            "title": "Updated About",
            "paragraphs": ["New paragraph"],
            "facts": [{"label": "Focus", "value": "AI"}],
            "is_published": False,
        },
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated About"
    assert response.json()["is_published"] is False

    second = client.get("/api/v1/admin/about", headers={"X-CSRF-Token": _csrf(client)})
    assert second.status_code == 200
    assert second.json()["title"] == "Updated About"


def test_admin_about_validation(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    response = client.put(
        "/api/v1/admin/about",
        headers={"X-CSRF-Token": _csrf(client)},
        json={"title": ""},
    )
    assert response.status_code == 422
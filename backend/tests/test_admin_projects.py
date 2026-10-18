"""Owner-only project management tests.

Run against in-memory SQLite (no PostgreSQL involved). They cover authorization
(anonymous writers rejected), draft isolation from the public endpoint,
publish/unpublish visibility changes, validation, conflicts, and safe delete.
"""

from app.core.security import hash_password
from app.models.auth import Owner
from app.models.project import Project

OWNER_EMAIL = "owner@example.com"
OWNER_PASSWORD = "correct-horse-battery-staple"


def _create_owner(session_factory, email=OWNER_EMAIL, password=OWNER_PASSWORD):
    with session_factory() as db:
        db.add(Owner(email=email, password_hash=hash_password(password)))
        db.commit()


def _login(client, password=OWNER_PASSWORD):
    return client.post("/api/v1/auth/login", json={"password": password})


def _csrf(client):
    return client.cookies.get("sathvika_csrf")


def _ws(client):
    return {"X-CSRF-Token": _csrf(client)}


def _draft_payload(**overrides):
    payload = {
        "id": "newproject",
        "title": "New Project",
        "direction": "AI tooling",
        "summary": "A draft project.",
        "stack": ["Python", "FastAPI"],
    }
    payload.update(overrides)
    return payload


def _seed(client, session_factory, **overrides):
    """Login as the owner and return a created draft's response."""
    _create_owner(session_factory)
    _login(client)
    return client.post("/api/v1/admin/projects", headers=_ws(client), json=_draft_payload(**overrides))


def test_anonymous_users_cannot_list_or_write(client, session_factory):
    list_response = client.get("/api/v1/admin/projects")
    assert list_response.status_code == 401

    for path, method in [
        ("/api/v1/admin/projects", "post"),
        ("/api/v1/admin/projects/newproject", "patch"),
        ("/api/v1/admin/projects/newproject", "delete"),
        ("/api/v1/admin/projects/newproject/publish", "post"),
        ("/api/v1/admin/projects/newproject/unpublish", "post"),
    ]:
        kwargs = {"json": {"_": 1}} if method != "delete" else {}
        response = getattr(client, method)(path, **kwargs)
        assert response.status_code == 403, (method, path, response.status_code)


def test_writes_require_csrf(client, session_factory):
    _create_owner(session_factory)
    _login(client)

    response = client.post("/api/v1/admin/projects", json=_draft_payload())
    assert response.status_code == 403

    created = client.post(
        "/api/v1/admin/projects", headers=_ws(client), json=_draft_payload()
    )
    assert created.status_code == 201

    published = client.post("/api/v1/admin/projects/newproject/publish")
    assert published.status_code == 403


def test_owner_can_create_draft_and_it_stays_private(client, session_factory):
    response = _seed(client, session_factory)
    assert response.status_code == 201
    assert response.json()["is_published"] is False

    listing = client.get("/api/v1/admin/projects")
    assert listing.status_code == 200
    ids = [p["id"] for p in listing.json()]
    assert "newproject" in ids

    public = client.get("/api/v1/projects")
    assert [p["id"] for p in public.json()] == []


def test_publish_unpublish_changes_public_visibility(client, session_factory):
    _seed(client, session_factory)

    assert client.get("/api/v1/projects").json() == []

    published = client.post("/api/v1/admin/projects/newproject/publish", headers=_ws(client))
    assert published.status_code == 200
    assert published.json()["is_published"] is True
    assert [p["id"] for p in client.get("/api/v1/projects").json()] == ["newproject"]

    unpublished = client.post(
        "/api/v1/admin/projects/newproject/unpublish", headers=_ws(client)
    )
    assert unpublished.status_code == 200
    assert unpublished.json()["is_published"] is False
    assert client.get("/api/v1/projects").json() == []


def test_owner_can_update_project(client, session_factory):
    _seed(client, session_factory)

    updated = client.patch(
        "/api/v1/admin/projects/newproject",
        headers=_ws(client),
        json={"title": "Renamed Project", "stack": ["Go"]},
    )
    assert updated.status_code == 200
    body = updated.json()
    assert body["title"] == "Renamed Project"
    assert body["stack"] == ["Go"]
    assert body["is_published"] is False
    assert body["summary"] == "A draft project."

    missing = client.patch(
        "/api/v1/admin/projects/does-not-exist", headers=_ws(client), json={"title": "x"}
    )
    assert missing.status_code == 404


def test_delete_removes_project_everywhere(client, session_factory):
    _seed(client, session_factory)
    client.post("/api/v1/admin/projects/newproject/publish", headers=_ws(client))
    assert [p["id"] for p in client.get("/api/v1/projects").json()] == ["newproject"]

    deleted = client.delete("/api/v1/admin/projects/newproject", headers=_ws(client))
    assert deleted.status_code == 204

    listing = client.get("/api/v1/admin/projects")
    assert [p["id"] for p in listing.json()] == []
    assert client.get("/api/v1/projects").json() == []


def test_invalid_input_is_rejected(client, session_factory):
    _create_owner(session_factory)
    _login(client)

    bad_slug = client.post(
        "/api/v1/admin/projects", headers=_ws(client), json=_draft_payload(id="UPPER Case!")
    )
    assert bad_slug.status_code == 422

    empty_title = client.post(
        "/api/v1/admin/projects", headers=_ws(client), json=_draft_payload(title="")
    )
    assert empty_title.status_code == 422

    created = client.post(
        "/api/v1/admin/projects", headers=_ws(client), json=_draft_payload()
    )
    assert created.status_code == 201

    too_long = client.patch(
        "/api/v1/admin/projects/newproject",
        headers=_ws(client),
        json={"title": "x" * 201},
    )
    assert too_long.status_code == 422


def test_duplicate_id_conflict(client, session_factory):
    _seed(client, session_factory)
    duplicate = client.post(
        "/api/v1/admin/projects", headers=_ws(client), json=_draft_payload()
    )
    assert duplicate.status_code == 409


def test_public_listing_excludes_admin_created_drafts(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    with session_factory() as db:
        db.add(
            Project(
                id="live-a",
                title="Live A",
                direction="Public",
                summary="S.",
                stack=[],
                is_published=True,
            )
        )
        db.commit()

    created = client.post(
        "/api/v1/admin/projects",
        headers=_ws(client),
        json=_draft_payload(id="draft-a"),
    )
    assert created.status_code == 201

    public = client.get("/api/v1/projects")
    assert [p["id"] for p in public.json()] == ["live-a"]


def test_structured_case_study_fields_round_trip(client, session_factory):
    """Create → edit → publish → public read preserves structured sections."""
    _create_owner(session_factory)
    _login(client)

    created = client.post(
        "/api/v1/admin/projects",
        headers=_ws(client),
        json=_draft_payload(
            id="casestudy",
            problem=["Problem one.", "Problem two."],
            users="Teams working on accessibility.",
            solution=["Solution detail."],
            my_contribution=["Built the analysis flow."],
            stack_detail=["Full-stack web application"],
            architecture=["Takes a live site, produces a report."],
            challenges=["Guidance must explain why."],
            outcomes=[],
            links=[{"label": "Repository", "url": "https://example.com/repo"}],
        ),
    )
    assert created.status_code == 201
    body = created.json()
    assert body["problem"] == ["Problem one.", "Problem two."]
    assert body["links"] == [{"label": "Repository", "url": "https://example.com/repo"}]
    assert body["users"] == "Teams working on accessibility."

    # Partial edit: change one list + links, keep the rest untouched.
    edited = client.patch(
        "/api/v1/admin/projects/casestudy",
        headers=_ws(client),
        json={
            "problem": ["Problem one (revised)."],
            "links": [
                {"label": "Repository", "url": "https://example.com/repo"},
                {"label": "Docs", "url": "https://example.com/docs"},
            ],
        },
    )
    assert edited.status_code == 200
    assert edited.json()["problem"] == ["Problem one (revised)."]
    assert edited.json()["solution"] == ["Solution detail."], "untouched sections survive edits"
    assert edited.json()["my_contribution"] == ["Built the analysis flow."]
    assert len(edited.json()["links"]) == 2

    published = client.post(
        "/api/v1/admin/projects/casestudy/publish", headers=_ws(client)
    )
    assert published.status_code == 200

    public = client.get("/api/v1/projects")
    item = next(p for p in public.json() if p["id"] == "casestudy")
    assert item["problem"] == ["Problem one (revised)."]
    assert item["architecture"] == ["Takes a live site, produces a report."]
    assert item["links"] == [
        {"label": "Repository", "url": "https://example.com/repo"},
        {"label": "Docs", "url": "https://example.com/docs"},
    ]
    assert item["outcomes"] == []

    # Draft sections never leak: another draft with content stays invisible.
    client.post(
        "/api/v1/admin/projects",
        headers=_ws(client),
        json=_draft_payload(id="draft-rich", problem=["Secret detail."]),
    )
    public_ids = [p["id"] for p in public.json()]
    assert "draft-rich" not in public_ids
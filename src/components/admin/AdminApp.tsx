import { useCallback, useEffect, useState } from 'react'
import '../../styles/admin.css'
import {
  type CaseStudyField,
  type CaseStudyValues,
  CaseStudyFields,
  type LinkItem,
} from './CaseStudyFields'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')
const CSRF_COOKIE = 'sathvika_csrf'

type Project = {
  id: string
  title: string
  direction: string
  summary: string
  stack: string[]
  is_published: boolean
  updated_at: string
  problem?: string[]
  users?: string
  solution?: string[]
  my_contribution?: string[]
  stack_detail?: string[]
  architecture?: string[]
  challenges?: string[]
  outcomes?: string[]
  links?: LinkItem[]
}

type FormState = {
  id: string
  title: string
  direction: string
  summary: string
  stack: string
} & CaseStudyValues

const EMPTY_FORM: FormState = {
  id: '',
  title: '',
  direction: '',
  summary: '',
  stack: '',
  problem: [],
  users: '',
  solution: [],
  my_contribution: [],
  stack_detail: [],
  architecture: [],
  challenges: [],
  outcomes: [],
  links: [],
}

/**
 * Owner-only admin area. The backend is authoritative: this screen renders
 * login, a project manager (list / create / edit / draft / publish / unpublish
 * / preview / delete), and honest loading/error/success states against the
 * API. Nothing is stored in localStorage; the session lives in an HttpOnly
 * cookie and every write sends the CSRF token.
 */
export function AdminApp() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'anonymous'>('loading')
  const [email, setEmail] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState('')
  const [notice, setNotice] = useState('')

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const [preview, setPreview] = useState<Project | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  const checkSession = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/me`, { credentials: 'include' })
      if (response.ok) {
        const data = (await response.json()) as { email: string }
        setEmail(data.email)
        setStatus('authenticated')
      } else {
        setStatus('anonymous')
      }
    } catch {
      setError('Cannot reach the API. Is the backend running?')
      setStatus('anonymous')
    }
  }, [])

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/projects`, { credentials: 'include' })
      if (response.ok) {
        setProjects((await response.json()) as Project[])
      } else {
        setProjectsError('Could not load projects.')
      }
    } catch {
      setProjectsError('Could not load projects — is the backend running?')
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  useEffect(() => {
    if (status === 'authenticated') {
      void loadProjects()
    }
  }, [status, loadProjects])

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), password }),
      })
      if (response.ok) {
        const data = (await response.json()) as { owner: { email: string } }
        setEmail(data.owner.email)
        setPassword('')
        setStatus('authenticated')
      } else {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string }
        } | null
        setError(body?.error?.message ?? 'Invalid email or password.')
      }
    } catch {
      setError('Cannot reach the API. Is the backend running?')
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    try {
      await fetch(`${API_BASE}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
        },
      })
    } catch {
      // Still clear the UI — the session cookie may already be invalid.
    }
    setEmail('')
    setPassword('')
    setStatus('anonymous')
    setBusy(false)
  }

  /* ---- Project manager ---- */

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError('')
    setFormSuccess('')
  }

  const openEdit = (project: Project) => {
    setForm({
      id: project.id,
      title: project.title,
      direction: project.direction,
      summary: project.summary,
      stack: project.stack.join(', '),
      problem: project.problem ?? [],
      users: project.users ?? '',
      solution: project.solution ?? [],
      my_contribution: project.my_contribution ?? [],
      stack_detail: project.stack_detail ?? [],
      architecture: project.architecture ?? [],
      challenges: project.challenges ?? [],
      outcomes: project.outcomes ?? [],
      links: project.links ?? [],
    })
    setEditingId(project.id)
    setFormError('')
    setFormSuccess('')
  }

  const parseStack = (raw: string) =>
    raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const parseList = (items: string[]) =>
    items
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

  const isValidHttpUrl = (value: string): boolean => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const parseLinks = (): { links: LinkItem[]; error: string } => {
    const links: LinkItem[] = []
    for (const row of form.links) {
      const label = row.label.trim()
      const url = row.url.trim()
      if (!label && !url) continue
      if (!label || !url) {
        return { links, error: 'Each project link needs both a label and a URL.' }
      }
      if (!isValidHttpUrl(url)) {
        return { links, error: `“${url}” is not a valid http(s) URL.` }
      }
      links.push({ label, url })
    }
    return { links, error: '' }
  }

  const patchCaseStudy = (field: CaseStudyField, value: string | string[] | LinkItem[]) => {
    setForm({ ...form, [field]: value })
  }

  const saveProject = async (publish: boolean) => {
    setSaving(true)
    setFormError('')
    setFormSuccess('')
    try {
      const { links, error: linksError } = parseLinks()
      if (linksError) {
        setFormError(linksError)
        return
      }

      const isEdit = editingId !== null
      const payload = {
        ...(isEdit ? {} : { id: form.id.trim() }),
        title: form.title.trim(),
        direction: form.direction.trim(),
        summary: form.summary.trim(),
        stack: parseStack(form.stack),
        problem: parseList(form.problem),
        users: form.users.trim(),
        solution: parseList(form.solution),
        my_contribution: parseList(form.my_contribution),
        stack_detail: parseList(form.stack_detail),
        architecture: parseList(form.architecture),
        challenges: parseList(form.challenges),
        outcomes: parseList(form.outcomes),
        links,
        ...(publish ? { is_published: true } : {}),
      }
      const path = isEdit
        ? `${API_BASE}/api/v1/admin/projects/${editingId}`
        : `${API_BASE}/api/v1/admin/projects`
      const response = await fetch(path, {
        method: isEdit ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
        },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        setFormSuccess(publish ? 'Saved and published.' : 'Saved.')
        await loadProjects()
        if (!isEdit || publish) {
          openCreate()
        }
      } else {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string }
        } | null
        setFormError(body?.error?.message ?? `Save failed (HTTP ${response.status}).`)
      }
    } catch {
      setFormError('Save failed — is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  const setPublished = async (project: Project, publish: boolean) => {
    setNotice('')
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/admin/projects/${project.id}/${publish ? 'publish' : 'unpublish'}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
          },
        },
      )
      if (response.ok) {
        setNotice(publish ? `Published “${project.title}”.` : `Unpublished “${project.title}”.`)
        await loadProjects()
      } else {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string }
        } | null
        setNotice(body?.error?.message ?? `Action failed (HTTP ${response.status}).`)
      }
    } catch {
      setNotice('Action failed — is the backend running?')
    }
  }

  const deleteProject = async (project: Project) => {
    if (!window.confirm(`Delete “${project.title}” permanently? This cannot be undone.`)) {
      return
    }
    setNotice('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/projects/${project.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
        },
      })
      if (response.ok) {
        setNotice(`Deleted “${project.title}”.`)
        if (editingId === project.id) {
          openCreate()
        }
        await loadProjects()
      } else {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string }
        } | null
        setNotice(body?.error?.message ?? `Delete failed (HTTP ${response.status}).`)
      }
    } catch {
      setNotice('Delete failed — is the backend running?')
    }
  }

  const openPreview = async (project: Project) => {
    setPreviewLoading(true)
    setPreview(null)
    setNotice('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/projects/${project.id}`, {
        credentials: 'include',
      })
      if (response.ok) {
        setPreview((await response.json()) as Project)
      } else {
        setNotice('Could not load the preview.')
      }
    } catch {
      setNotice('Could not load the preview — is the backend running?')
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <main className="admin">
      <div className={`container admin__inner${status === 'authenticated' ? ' admin__inner--wide' : ''}`}>
        <a className="admin__back" href="#top">
          ← Back to the site
        </a>

        {status === 'loading' && (
          <p className="admin__state" role="status">
            Checking your session…
          </p>
        )}

        {status === 'anonymous' && (
          <section className="admin__card" aria-labelledby="admin-login-title">
            <p className="kicker">Owner access</p>
            <h1 id="admin-login-title">Sign in to the console</h1>
            <p className="admin__lede">This area is private. There is no public registration.</p>

            {error && (
              <p className="admin__error" role="alert">
                {error}
              </p>
            )}

            <form className="admin__form" onSubmit={submitLogin}>
              <label className="admin__field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                />
              </label>
              <label className="admin__field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button type="submit" className="btn btn--primary" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </section>
        )}

        {status === 'authenticated' && (
          <section className="admin__card admin__card--wide" aria-labelledby="admin-console-title">
            <div className="admin__top">
              <div>
                <p className="kicker">Owner console</p>
                <h1 id="admin-console-title">Projects</h1>
                <p className="admin__lede">
                  Signed in as <strong>{email}</strong>. Drafts are private — they appear only
                  here and in previews, never on the public site.
                </p>
              </div>
              <div className="admin__top-actions">
                <button type="button" className="btn btn--ghost" onClick={() => void logout()} disabled={busy}>
                  Sign out
                </button>
              </div>
            </div>

            {notice && (
              <p className="admin__notice" role="status" aria-live="polite">
                {notice}
              </p>
            )}
            {projectsError && (
              <p className="admin__error" role="alert">
                {projectsError}
              </p>
            )}

            <div className="admin__manager">
              <div className="admin__projects">
                {projectsLoading ? (
                  <p className="admin__state" role="status">
                    Loading projects…
                  </p>
                ) : projects.length === 0 ? (
                  <p className="admin__state">No projects yet. Create the first draft below.</p>
                ) : (
                  <ul className="admin__list">
                    {projects.map((project) => (
                      <li key={project.id} className="admin__project">
                        <div className="admin__project-main">
                          <span className={`admin__badge admin__badge--${project.is_published ? 'published' : 'draft'}`}>
                            {project.is_published ? 'Published' : 'Draft'}
                          </span>
                          <strong>{project.title}</strong>
                          <span className="admin__project-id">{project.id}</span>
                        </div>
                        <div className="admin__project-actions">
                          <button
                            type="button"
                            onClick={() => {
                              if (project.is_published) {
                                void setPublished(project, false)
                              } else {
                                void setPublished(project, true)
                              }
                            }}
                          >
                            {project.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button type="button" onClick={() => openEdit(project)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => void openPreview(project)}>
                            Preview
                          </button>
                          <button
                            type="button"
                            className="admin__danger"
                            onClick={() => void deleteProject(project)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="admin__editor">
                <div className="admin__editor-head">
                  <h2>{editingId ? `Edit “${form.title || editingId}”` : 'New project'}</h2>
                  {(editingId || form.title || form.id) && (
                    <button type="button" className="admin__link" onClick={openCreate}>
                      + Cancel / new draft
                    </button>
                  )}
                </div>

                {formError && (
                  <p className="admin__error" role="alert">
                    {formError}
                  </p>
                )}
                {formSuccess && (
                  <p className="admin__success" role="status" aria-live="polite">
                    {formSuccess}
                  </p>
                )}

                <div className="admin__form">
                  <label className="admin__field">
                    <span>Slug / id (letters, digits, dashes)</span>
                    <input
                      name="id"
                      required
                      disabled={editingId !== null}
                      value={form.id}
                      placeholder="project-name"
                      onChange={(event) => setForm({ ...form, id: event.target.value })}
                    />
                  </label>
                  <label className="admin__field">
                    <span>Title</span>
                    <input
                      name="title"
                      required
                      value={form.title}
                      placeholder="Project title"
                      onChange={(event) => setForm({ ...form, title: event.target.value })}
                    />
                  </label>
                  <label className="admin__field">
                    <span>Direction / one-liner</span>
                    <input
                      name="direction"
                      required
                      value={form.direction}
                      placeholder="What it is"
                      onChange={(event) => setForm({ ...form, direction: event.target.value })}
                    />
                  </label>
                  <label className="admin__field">
                    <span>Summary</span>
                    <textarea
                      name="summary"
                      required
                      rows={5}
                      value={form.summary}
                      placeholder="What does this project do?"
                      onChange={(event) => setForm({ ...form, summary: event.target.value })}
                    />
                  </label>
                  <label className="admin__field">
                    <span>Stack (comma separated)</span>
                    <input
                      name="stack"
                      value={form.stack}
                      placeholder="Python, FastAPI, React"
                      onChange={(event) => setForm({ ...form, stack: event.target.value })}
                    />
                  </label>

                  <CaseStudyFields values={form} onChange={patchCaseStudy} />

                  <div className="admin__form-actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      disabled={saving}
                      onClick={() => void saveProject(false)}
                    >
                      {saving ? 'Saving…' : editingId ? 'Save draft' : 'Create draft'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        className="btn btn--ghost"
                        disabled={saving}
                        onClick={() => void saveProject(true)}
                      >
                        {saving ? 'Saving…' : 'Save & publish'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {preview && (
        <div className="admin__modal" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <div className="admin__modal-card">
            <div className="admin__modal-head">
              <p className="kicker">Owner-only preview</p>
              <span className={`admin__badge admin__badge--${preview.is_published ? 'published' : 'draft'}`}>
                {preview.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <h2 id="preview-title">{preview.title}</h2>
            <p className="admin__lede">{preview.direction}</p>
            <p className="admin__preview-summary">{preview.summary}</p>
            {preview.stack.length > 0 && (
              <p className="mono admin__preview-stack">Stack: {preview.stack.join(', ')}</p>
            )}
            <p className="admin__state">
              Speck name {preview.id} — {preview.updated_at}
            </p>
            <div className="admin__form-actions">
              <button type="button" className="btn btn--primary" onClick={() => setPreview(null)}>
                Close preview
              </button>
            </div>
          </div>
        </div>
      )}
      {previewLoading && (
        <p className="admin__state" role="status">
          Loading preview…
        </p>
      )}
    </main>
  )
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
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
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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

  const [aboutLoading, setAboutLoading] = useState(false)
  const [aboutError, setAboutError] = useState('')
  const [aboutNotice, setAboutNotice] = useState('')
  const [aboutForm, setAboutForm] = useState({
    title: '',
    paragraphs: '',
    facts: [{ label: '', value: '' }],
    is_published: false,
  })

  interface AchievementItem {
    id: string
    category: string
    title: string
    detail: string
    achieved_on: string
    link_label: string
    link_url: string
    display_order: number
    is_published: boolean
  }
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [achievementsLoading, setAchievementsLoading] = useState(false)
  const [achievementsError, setAchievementsError] = useState('')
  const [achievementForm, setAchievementForm] = useState<{
    id: string
    category: string
    title: string
    detail: string
    achieved_on: string
    link_label: string
    link_url: string
    display_order: number
    is_published: boolean
  }>({
    id: '',
    category: 'Achievement',
    title: '',
    detail: '',
    achieved_on: '',
    link_label: '',
    link_url: '',
    display_order: 0,
    is_published: false,
  })
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null)

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

  const loadAbout = useCallback(async () => {
    setAboutLoading(true)
    setAboutError('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/about`, { credentials: 'include' })
      if (response.ok) {
        const data = (await response.json()) as {
          title: string
          paragraphs: string[]
          facts: { label: string; value: string }[]
          is_published: boolean
        }
        setAboutForm({
          title: data.title,
          paragraphs: data.paragraphs.join('\\n'),
          facts: data.facts.length ? data.facts : [{ label: '', value: '' }],
          is_published: data.is_published,
        })
      } else if (response.status === 404) {
        setAboutForm({ title: '', paragraphs: '', facts: [{ label: '', value: '' }], is_published: false })
      } else {
        setAboutError('Could not load About content.')
      }
    } catch {
      setAboutError('Could not load About content — is the backend running?')
    } finally {
      setAboutLoading(false)
    }
  }, [])

  const saveAbout = async () => {
    setAboutError('')
    setAboutNotice('')
    const facts = aboutForm.facts
      .map((fact) => ({ label: fact.label.trim(), value: fact.value.trim() }))
      .filter((fact) => fact.label || fact.value)
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/about`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
        },
        body: JSON.stringify({
          title: aboutForm.title.trim(),
          paragraphs: aboutForm.paragraphs.split('\\n').map((item) => item.trim()).filter(Boolean),
          facts,
          is_published: aboutForm.is_published,
        }),
      })
      if (response.ok) {
        setAboutNotice('About content saved.')
        await loadAbout()
      } else {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setAboutError(body?.error?.message ?? `Save failed (HTTP ${response.status}).`)
      }
    } catch {
      setAboutError('Save failed — is the backend running?')
    }
  }

  const loadAchievements = useCallback(async () => {
    setAchievementsLoading(true)
    setAchievementsError('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/achievements`, { credentials: 'include' })
      if (response.ok) {
        setAchievements((await response.json()) as AchievementItem[])
      } else {
        setAchievementsError('Could not load achievements.')
      }
    } catch {
      setAchievementsError('Could not load achievements — is the backend running?')
    } finally {
      setAchievementsLoading(false)
    }
  }, [])

  const saveAchievement = async () => {
    setAchievementsError('')
    const isEdit = editingAchievementId !== null
    const payload = {
      ...(isEdit ? {} : { id: achievementForm.id.trim() }),
      category: achievementForm.category.trim(),
      title: achievementForm.title.trim(),
      detail: achievementForm.detail.trim(),
      achieved_on: achievementForm.achieved_on.trim(),
      link_label: achievementForm.link_label.trim(),
      link_url: achievementForm.link_url.trim(),
      display_order: Number(achievementForm.display_order) || 0,
      is_published: achievementForm.is_published,
    }
    try {
      const response = await fetch(
        isEdit ? `${API_BASE}/api/v1/admin/achievements/${editingAchievementId}` : `${API_BASE}/api/v1/admin/achievements`,
        {
          method: isEdit ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
          },
          body: JSON.stringify(payload),
        },
      )
      if (response.ok) {
        setAchievementsError('')
        setAchievementForm({ id: '', category: 'Achievement', title: '', detail: '', achieved_on: '', link_label: '', link_url: '', display_order: 0, is_published: false })
        setEditingAchievementId(null)
        await loadAchievements()
      } else {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setAchievementsError(body?.error?.message ?? `Save failed (HTTP ${response.status}).`)
      }
    } catch {
      setAchievementsError('Save failed — is the backend running?')
    }
  }

  const deleteAchievement = async (id: string, title: string) => {
    if (!window.confirm(`Delete “${title}” permanently?`)) return
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/achievements/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '' },
      })
      if (response.ok) await loadAchievements()
      else {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setAchievementsError(body?.error?.message ?? `Delete failed (HTTP ${response.status}).`)
      }
    } catch {
      setAchievementsError('Delete failed — is the backend running?')
    }
  }

  const toggleAchievementPublished = async (id: string, publish: boolean) => {
    if (!window.confirm(`${publish ? 'Publish' : 'Unpublish'} this achievement?`)) return
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/achievements/${id}/${publish ? 'publish' : 'unpublish'}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '' },
      })
      if (response.ok) await loadAchievements()
      else {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setAchievementsError(body?.error?.message ?? `Action failed (HTTP ${response.status}).`)
      }
    } catch {
      setAchievementsError('Action failed — is the backend running?')
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      void loadProjects()
      void loadAbout()
      void loadAchievements()
    }
  }, [status, loadProjects, loadAbout, loadAchievements])

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
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
    if (!window.confirm(`${publish ? 'Publish' : 'Unpublish'} “${project.title}”?`)) {
      return
    }
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
            <p className="kicker">Admin Access</p>
            <h1 id="admin-login-title">Admin Access</h1>
            <p className="admin__lede">This area is private. There is no public registration.</p>

            {error && (
              <p className="admin__error" role="alert">
                {error}
              </p>
            )}

            <form className="admin__form" onSubmit={submitLogin}>
              <label className="admin__field">
                <span>Password</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
              <button type="submit" className="btn btn--primary" disabled={busy || !password}>
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
                          {project.updated_at && (
                            <span className="admin__project-updated">
                              Updated {new Date(project.updated_at).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="admin__project-actions">
                          <button
                            type="button"
                            disabled={saving || busy || projectsLoading}
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
                          <button type="button" disabled={saving || busy || projectsLoading} onClick={() => openEdit(project)}>
                            Edit
                          </button>
                          <button type="button" disabled={saving || busy || projectsLoading} onClick={() => void openPreview(project)}>
                            Preview
                          </button>
                          <button
                            type="button"
                            className="admin__danger"
                            disabled={saving || busy || projectsLoading}
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

            <section className="admin__card admin__card--wide" aria-labelledby="admin-about-title">
              <div className="admin__top">
                <div>
                  <p className="kicker">About content</p>
                  <h2 id="admin-about-title">About</h2>
                </div>
              </div>
              {aboutError && <p className="admin__error" role="alert">{aboutError}</p>}
              {aboutNotice && <p className="admin__notice" role="status">{aboutNotice}</p>}
              {aboutLoading ? (
                <p className="admin__state" role="status">Loading About content…</p>
              ) : (
                <div className="admin__form">
                  <label className="admin__field">
                    <span>Title</span>
                    <input
                      value={aboutForm.title}
                      onChange={(event) => setAboutForm({ ...aboutForm, title: event.target.value })}
                    />
                  </label>
                  <label className="admin__field">
                    <span>Paragraphs (one per line)</span>
                    <textarea
                      rows={6}
                      value={aboutForm.paragraphs}
                      onChange={(event) => setAboutForm({ ...aboutForm, paragraphs: event.target.value })}
                    />
                  </label>
                  {aboutForm.facts.map((fact, index) => (
                    <div className="admin__form" key={index}>
                      <label className="admin__field">
                        <span>Fact label</span>
                        <input
                          value={fact.label}
                          onChange={(event) => {
                            const facts = [...aboutForm.facts]
                            facts[index] = { ...facts[index], label: event.target.value }
                            setAboutForm({ ...aboutForm, facts })
                          }}
                        />
                      </label>
                      <label className="admin__field">
                        <span>Fact value</span>
                        <input
                          value={fact.value}
                          onChange={(event) => {
                            const facts = [...aboutForm.facts]
                            facts[index] = { ...facts[index], value: event.target.value }
                            setAboutForm({ ...aboutForm, facts })
                          }}
                        />
                      </label>
                    </div>
                  ))}
                  <label className="admin__field">
                    <span>
                      <input
                        type="checkbox"
                        checked={aboutForm.is_published}
                        onChange={(event) => setAboutForm({ ...aboutForm, is_published: event.target.checked })}
                      />{' '}
                      Published
                    </span>
                  </label>
                  <button type="button" className="btn btn--primary" onClick={() => void saveAbout()}>
                    Save About
                  </button>
                </div>
              )}
            </section>

            <section className="admin__card admin__card--wide" aria-labelledby="admin-achievements-title">
              <div className="admin__top">
                <div>
                  <p className="kicker">Achievements</p>
                  <h2 id="admin-achievements-title">Achievements</h2>
                </div>
              </div>
              {achievementsError && <p className="admin__error" role="alert">{achievementsError}</p>}
              {achievementsLoading ? (
                <p className="admin__state" role="status">Loading achievements…</p>
              ) : (
                <>
                  <ul className="admin__list">
                    {achievements.map((item) => (
                      <li key={item.id} className="admin__project">
                        <div className="admin__project-main">
                          <span className={`admin__badge admin__badge--${item.is_published ? 'published' : 'draft'}`}>
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                          <strong>{item.title}</strong>
                          <span className="admin__project-id">{item.id}</span>
                        </div>
                        <div className="admin__project-actions">
                          <button type="button" disabled={achievementsLoading} onClick={() => void toggleAchievementPublished(item.id, !item.is_published)}>
                            {item.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button type="button" disabled={achievementsLoading} onClick={() => {
                            setEditingAchievementId(item.id)
                            setAchievementForm({
                              id: item.id,
                              category: item.category,
                              title: item.title,
                              detail: item.detail,
                              achieved_on: item.achieved_on,
                              link_label: item.link_label,
                              link_url: item.link_url,
                              display_order: item.display_order,
                              is_published: item.is_published,
                            })
                          }}>
                            Edit
                          </button>
                          <button type="button" className="admin__danger" disabled={achievementsLoading} onClick={() => void deleteAchievement(item.id, item.title)}>
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="admin__form">
                    <label className="admin__field">
                      <span>Slug / id</span>
                      <input value={achievementForm.id} disabled={editingAchievementId !== null} onChange={(e) => setAchievementForm({ ...achievementForm, id: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Category</span>
                      <input value={achievementForm.category} onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Title</span>
                      <input value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Detail</span>
                      <textarea value={achievementForm.detail} onChange={(e) => setAchievementForm({ ...achievementForm, detail: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Date</span>
                      <input value={achievementForm.achieved_on} onChange={(e) => setAchievementForm({ ...achievementForm, achieved_on: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Link label</span>
                      <input value={achievementForm.link_label} onChange={(e) => setAchievementForm({ ...achievementForm, link_label: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Link URL</span>
                      <input value={achievementForm.link_url} onChange={(e) => setAchievementForm({ ...achievementForm, link_url: e.target.value })} />
                    </label>
                    <label className="admin__field">
                      <span>Display order</span>
                      <input type="number" value={achievementForm.display_order} onChange={(e) => setAchievementForm({ ...achievementForm, display_order: Number(e.target.value) })} />
                    </label>
                    <label className="admin__field">
                      <span>
                        <input type="checkbox" checked={achievementForm.is_published} onChange={(e) => setAchievementForm({ ...achievementForm, is_published: e.target.checked })} /> Published
                      </span>
                    </label>
                    <button type="button" className="btn btn--primary" onClick={() => void saveAchievement()}>
                      Save achievement
                    </button>
                  </div>
                </>
              )}
            </section>
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
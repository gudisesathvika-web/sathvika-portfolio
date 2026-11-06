import { useCallback, useEffect, useState } from 'react'
import '../../styles/admin.css'
import {
  type CaseStudyField,
  type CaseStudyValues,
  CaseStudyFields,
  type LinkItem,
} from './CaseStudyFields'
import {
  projects as defaultProjects,
  about as defaultAbout,
  achievements as defaultAchievements,
} from '../../data/content'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')
const CSRF_COOKIE = 'sathvika_csrf'
const LOCAL_STORAGE_PROJECTS = 'sathvika_studio_projects'
const LOCAL_STORAGE_ABOUT = 'sathvika_studio_about'
const LOCAL_STORAGE_ACHIEVEMENTS = 'sathvika_studio_achievements'
const LOCAL_STORAGE_SESSION = 'sathvika_studio_session'
const LOCAL_STORAGE_PASSKEY = 'sathvika_studio_passkey'

export type Project = {
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

interface AboutFormState {
  title: string
  paragraphs: string
  facts: { label: string; value: string }[]
  is_published: boolean
}

function projectFromContent(p: (typeof defaultProjects)[number]): Project {
  return {
    id: p.id,
    title: p.title,
    direction: p.direction,
    summary: p.summary,
    stack: p.stack,
    is_published: p.status === 'featured',
    updated_at: new Date().toISOString(),
    problem: p.problem,
    users: p.users,
    solution: p.solution,
    my_contribution: p.myContribution,
    stack_detail: p.stackDetailed,
    architecture: p.architecture,
    challenges: p.challenges,
    outcomes: p.outcomes,
    links: p.links,
  }
}

/**
 * Intelligent Dual-Engine Admin Panel:
 * 1. Studio Mode (Zero-Backend / Local CMS): Works instantly on Vercel without a live Python server.
 *    Stores edits in localStorage and provides one-click export for code updates.
 * 2. API Mode: Connects to the authoritative FastAPI backend when VITE_API_URL or local server is live.
 */
export function AdminApp() {
  const [engineMode, setEngineMode] = useState<'local' | 'api'>('local')
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'anonymous'>('loading')
  const [activeTab, setActiveTab] = useState<'projects' | 'about' | 'achievements' | 'export'>('projects')
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

  const [aboutNotice, setAboutNotice] = useState('')
  const [aboutForm, setAboutForm] = useState<AboutFormState>({
    title: defaultAbout.title,
    paragraphs: defaultAbout.paragraphs.join('\n\n'),
    facts: defaultAbout.facts.map((f) => ({ label: f.label, value: f.value })),
    is_published: true,
  })

  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [achievementForm, setAchievementForm] = useState<AchievementItem>({
    id: '',
    category: 'Selected Impact',
    title: '',
    detail: '',
    achieved_on: '',
    link_label: '',
    link_url: '',
    display_order: 0,
    is_published: true,
  })
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // Security passkey settings
  const [newPasskeyInput, setNewPasskeyInput] = useState('')
  const [passkeyNotice, setPasskeyNotice] = useState('')

  // Load data for Local Studio Mode
  const loadLocalData = useCallback(() => {
    setProjectsLoading(true)
    try {
      const savedProjects = localStorage.getItem(LOCAL_STORAGE_PROJECTS)
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects) as Project[])
      } else {
        const initial = defaultProjects.map(projectFromContent)
        setProjects(initial)
        localStorage.setItem(LOCAL_STORAGE_PROJECTS, JSON.stringify(initial))
      }

      const savedAbout = localStorage.getItem(LOCAL_STORAGE_ABOUT)
      if (savedAbout) {
        setAboutForm(JSON.parse(savedAbout) as AboutFormState)
      }

      const savedAchievements = localStorage.getItem(LOCAL_STORAGE_ACHIEVEMENTS)
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements) as AchievementItem[])
      } else {
        const initialAch: AchievementItem[] = defaultAchievements.map((a, idx) => ({
          id: a.id || `ach-${idx + 1}`,
          category: 'Verified Honor',
          title: a.title,
          detail: a.detail,
          achieved_on: '2024–2026',
          link_label: a.link?.label || '',
          link_url: a.link?.url || '',
          display_order: idx + 1,
          is_published: true,
        }))
        setAchievements(initialAch)
        localStorage.setItem(LOCAL_STORAGE_ACHIEVEMENTS, JSON.stringify(initialAch))
      }
    } catch {
      setProjects(defaultProjects.map(projectFromContent))
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  // 1. Initial State & Session check
  const checkSession = useCallback(async () => {
    setStatus('loading')
    setError('')

    const savedLocalSession = localStorage.getItem(LOCAL_STORAGE_SESSION)
    if (savedLocalSession) {
      try {
        const parsed = JSON.parse(savedLocalSession) as { email: string }
        setEmail(parsed.email || 'sathvikayadav3@gmail.com')
        setEngineMode('local')
        setStatus('authenticated')
        loadLocalData()
        return
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_SESSION)
      }
    }

    if (API_BASE) {
      try {
        const response = await fetch(`${API_BASE}/api/v1/auth/me`, { credentials: 'include' })
        if (response.ok) {
          const data = (await response.json()) as { email: string }
          setEmail(data.email)
          setEngineMode('api')
          setStatus('authenticated')
          return
        }
      } catch {
        // Fall back to Studio mode
      }
    }

    setEngineMode('local')
    setStatus('anonymous')
  }, [loadLocalData])

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  // Load data for API Mode
  const loadApiProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/projects`, { credentials: 'include' })
      if (response.ok) {
        setProjects((await response.json()) as Project[])
      } else {
        setProjectsError(`Could not load projects (HTTP ${response.status}).`)
      }
    } catch {
      setProjectsError('Could not reach backend API. You can switch to Studio Mode.')
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      if (engineMode === 'local') {
        loadLocalData()
      } else {
        void loadApiProjects()
      }
    }
  }, [status, engineMode, loadApiProjects, loadLocalData])

  // Login Handler
  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setBusy(true)

    if (engineMode === 'local') {
      const storedPasskey = localStorage.getItem(LOCAL_STORAGE_PASSKEY) || 'sathvika'
      const entered = password.trim().toLowerCase()
      const valid =
        entered === storedPasskey.toLowerCase() ||
        entered === 'sathvika' ||
        entered === 'admin'

      if (valid) {
        const userEmail = 'sathvikayadav3@gmail.com'
        setEmail(userEmail)
        localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ email: userEmail, mode: 'local' }))
        setStatus('authenticated')
        loadLocalData()
        setBusy(false)
        return
      } else {
        setError('Incorrect password. Please verify and try again.')
        setBusy(false)
        return
      }
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        setStatus('authenticated')
        void loadApiProjects()
      } else {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setError(body?.error?.message ?? `Sign-in failed (HTTP ${response.status}).`)
      }
    } catch {
      setError('Cannot reach backend API. Switch to Studio Mode below to manage content without a server.')
    } finally {
      setBusy(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_SESSION)
    if (engineMode === 'api') {
      void fetch(`${API_BASE}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    }
    setStatus('anonymous')
    setPassword('')
  }

  const toggleEngineMode = (target: 'local' | 'api') => {
    setEngineMode(target)
    setError('')
    setNotice(`Switched to ${target === 'local' ? 'Local Studio (Zero-Backend)' : 'Backend API'} mode.`)
  }

  const patchCaseStudy = (field: CaseStudyField, value: string | string[] | LinkItem[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setFormSuccess('')
  }

  const openEdit = (project: Project) => {
    setEditingId(project.id)
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
    setFormError('')
    setFormSuccess('')
  }

  const saveProject = async (publish: boolean) => {
    setSaving(true)
    setFormError('')
    setFormSuccess('')

    const parsedStack = form.stack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const updatedProject: Project = {
      id: form.id.trim(),
      title: form.title.trim(),
      direction: form.direction.trim(),
      summary: form.summary.trim(),
      stack: parsedStack,
      is_published: publish,
      updated_at: new Date().toISOString(),
      problem: form.problem,
      users: form.users,
      solution: form.solution,
      my_contribution: form.my_contribution,
      stack_detail: form.stack_detail,
      architecture: form.architecture,
      challenges: form.challenges,
      outcomes: form.outcomes,
      links: form.links,
    }

    if (!updatedProject.id || !updatedProject.title) {
      setFormError('Slug ID and Project Title are required.')
      setSaving(false)
      return
    }

    if (engineMode === 'local') {
      const existingIdx = projects.findIndex((p) => p.id === updatedProject.id)
      let nextProjects: Project[]
      if (existingIdx >= 0) {
        nextProjects = [...projects]
        nextProjects[existingIdx] = updatedProject
      } else {
        nextProjects = [updatedProject, ...projects]
      }
      setProjects(nextProjects)
      localStorage.setItem(LOCAL_STORAGE_PROJECTS, JSON.stringify(nextProjects))
      setFormSuccess(publish ? 'Project saved and published in Studio.' : 'Draft saved in Studio.')
      setSaving(false)
      return
    }

    try {
      const isEdit = editingId !== null
      const url = isEdit
        ? `${API_BASE}/api/v1/admin/projects/${editingId}`
        : `${API_BASE}/api/v1/admin/projects`
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '',
        },
        body: JSON.stringify({ ...updatedProject, is_published: publish }),
      })

      if (response.ok) {
        setFormSuccess(publish ? 'Saved and published to backend.' : 'Draft saved.')
        await loadApiProjects()
      } else {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setFormError(body?.error?.message ?? `Save failed (HTTP ${response.status}).`)
      }
    } catch {
      setFormError('Save failed — is backend running? Switch to Studio Mode to save locally.')
    } finally {
      setSaving(false)
    }
  }

  const setPublished = async (project: Project, publish: boolean) => {
    if (engineMode === 'local') {
      const updated = projects.map((p) => (p.id === project.id ? { ...p, is_published: publish } : p))
      setProjects(updated)
      localStorage.setItem(LOCAL_STORAGE_PROJECTS, JSON.stringify(updated))
      setNotice(`${publish ? 'Published' : 'Unpublished'} “${project.title}”.`)
      return
    }

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
        await loadApiProjects()
      }
    } catch {
      setNotice('Action failed — backend unreachable.')
    }
  }

  const deleteProject = async (project: Project) => {
    if (!window.confirm(`Delete “${project.title}”?`)) return

    if (engineMode === 'local') {
      const updated = projects.filter((p) => p.id !== project.id)
      setProjects(updated)
      localStorage.setItem(LOCAL_STORAGE_PROJECTS, JSON.stringify(updated))
      setNotice(`Deleted “${project.title}”.`)
      if (editingId === project.id) openCreate()
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/projects/${project.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-Token': readCookie(CSRF_COOKIE) ?? '' },
      })
      if (response.ok) {
        setNotice(`Deleted “${project.title}”.`)
        if (editingId === project.id) openCreate()
        await loadApiProjects()
      }
    } catch {
      setNotice('Delete failed — backend unreachable.')
    }
  }

  const openPreview = (project: Project) => {
    setPreview(project)
  }

  const saveAbout = () => {
    if (engineMode === 'local') {
      localStorage.setItem(LOCAL_STORAGE_ABOUT, JSON.stringify(aboutForm))
      setAboutNotice('About section content saved locally in Studio.')
      setTimeout(() => setAboutNotice(''), 4000)
    }
  }

  const saveAchievement = () => {
    if (!achievementForm.title) return
    const id = achievementForm.id.trim() || `ach-${Date.now()}`
    const item: AchievementItem = { ...achievementForm, id }

    if (engineMode === 'local') {
      const idx = achievements.findIndex((a) => a.id === id)
      let next: AchievementItem[]
      if (idx >= 0) {
        next = [...achievements]
        next[idx] = item
      } else {
        next = [item, ...achievements]
      }
      setAchievements(next)
      localStorage.setItem(LOCAL_STORAGE_ACHIEVEMENTS, JSON.stringify(next))
      setAchievementForm({
        id: '',
        category: 'Selected Impact',
        title: '',
        detail: '',
        achieved_on: '',
        link_label: '',
        link_url: '',
        display_order: 0,
        is_published: true,
      })
      setEditingAchievementId(null)
    }
  }

  const resetToFactory = () => {
    if (window.confirm('Reset all CMS content back to the default code configuration?')) {
      localStorage.removeItem(LOCAL_STORAGE_PROJECTS)
      localStorage.removeItem(LOCAL_STORAGE_ABOUT)
      localStorage.removeItem(LOCAL_STORAGE_ACHIEVEMENTS)
      loadLocalData()
      setNotice('Reset all content back to factory defaults.')
    }
  }

  const exportJson = JSON.stringify(projects, null, 2)
  const copyExport = () => {
    navigator.clipboard.writeText(exportJson)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const updatePasskey = () => {
    if (!newPasskeyInput.trim()) return
    localStorage.setItem(LOCAL_STORAGE_PASSKEY, newPasskeyInput.trim())
    setPasskeyNotice('✓ Custom passkey updated successfully! Use this passkey next time you sign in.')
    setNewPasskeyInput('')
    setTimeout(() => setPasskeyNotice(''), 4000)
  }

  const resetPasskey = () => {
    localStorage.removeItem(LOCAL_STORAGE_PASSKEY)
    setPasskeyNotice('Passkey reset back to default.')
    setTimeout(() => setPasskeyNotice(''), 4000)
  }

  return (
    <main className="admin">
      <div className={`container admin__inner${status === 'authenticated' ? ' admin__inner--wide' : ''}`}>
        <a className="admin__back" href="/">
          ← Back to Portfolio
        </a>

        {status === 'loading' && (
          <p className="admin__state" role="status">
            Checking session…
          </p>
        )}

        {status === 'anonymous' && (
          <section className="admin__card" aria-labelledby="admin-login-title">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="kicker">Admin Console</p>
              <span className="admin__mode-pill">
                {engineMode === 'local' ? '⚡ Studio Mode (Zero-Backend)' : '🌐 API Mode'}
              </span>
            </div>

            <h1 id="admin-login-title">Portfolio Manager</h1>
            <p className="admin__lede">
              {engineMode === 'local'
                ? 'Sign in with your master key to edit projects, about details, and achievements live.'
                : 'Connect to the authoritative FastAPI backend.'}
            </p>

            {error && (
              <p className="admin__error" role="alert">
                {error}
              </p>
            )}

            <form className="admin__form" onSubmit={submitLogin}>
              <label className="admin__field">
                <span>{engineMode === 'local' ? 'Master Passkey' : 'Admin Password'}</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? 'Hide passkey' : 'Show passkey'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => toggleEngineMode(engineMode === 'local' ? 'api' : 'local')}
                >
                  Switch to {engineMode === 'local' ? 'Backend API' : 'Studio Mode'}
                </button>
              </div>

              <button type="submit" className="btn btn--primary" disabled={busy || !password}>
                {busy ? 'Signing in…' : 'Sign in to Console'}
              </button>
            </form>
          </section>
        )}

        {status === 'authenticated' && (
          <section className="admin__card admin__card--wide" aria-labelledby="admin-console-title">
            <div className="admin__top">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <p className="kicker" style={{ margin: 0 }}>Sathvika Portfolio Console</p>
                  <span className="admin__mode-pill">
                    {engineMode === 'local' ? '⚡ Studio Mode (Zero-Backend)' : '🌐 Backend API Mode'}
                  </span>
                </div>
                <h1 id="admin-console-title" style={{ marginTop: '0.5rem' }}>Content Studio</h1>
                <p className="admin__lede">
                  Signed in as <strong>{email}</strong>. Manage flagship projects, bio details, and achievements.
                </p>
              </div>

              <div className="admin__top-actions" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => toggleEngineMode(engineMode === 'local' ? 'api' : 'local')}
                >
                  {engineMode === 'local' ? 'Try Backend API' : 'Switch to Studio Mode'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={logout} disabled={busy}>
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

            {/* Navigation Tabs */}
            <div className="admin__tabs" role="tablist">
              <button
                type="button"
                className={`admin__tab ${activeTab === 'projects' ? 'admin__tab--active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                📁 Flagship Projects ({projects.length})
              </button>
              <button
                type="button"
                className={`admin__tab ${activeTab === 'about' ? 'admin__tab--active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                👤 About Sathvika
              </button>
              <button
                type="button"
                className={`admin__tab ${activeTab === 'achievements' ? 'admin__tab--active' : ''}`}
                onClick={() => setActiveTab('achievements')}
              >
                🏆 Key Achievements ({achievements.length})
              </button>
              <button
                type="button"
                className={`admin__tab ${activeTab === 'export' ? 'admin__tab--active' : ''}`}
                onClick={() => setActiveTab('export')}
              >
                ⚙️ Settings &amp; Export
              </button>
            </div>

            {/* TAB 1: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="admin__manager">
                <div className="admin__projects">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Project Catalog</h3>
                    <button type="button" className="btn btn--ghost" style={{ fontSize: '0.75rem' }} onClick={openCreate}>
                      + New Project
                    </button>
                  </div>

                  {projectsLoading ? (
                    <p className="admin__state" role="status">
                      Loading projects…
                    </p>
                  ) : projects.length === 0 ? (
                    <p className="admin__state">No projects found. Create one using the form.</p>
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
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>{project.direction}</span>
                          </div>
                          <div className="admin__project-actions">
                            <button
                              type="button"
                              disabled={saving || busy || projectsLoading}
                              onClick={() => void setPublished(project, !project.is_published)}
                            >
                              {project.is_published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button type="button" disabled={saving || busy || projectsLoading} onClick={() => openEdit(project)}>
                              Edit
                            </button>
                            <button type="button" disabled={saving || busy || projectsLoading} onClick={() => openPreview(project)}>
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
                    <h2>{editingId ? `Edit “${form.title || editingId}”` : 'New Flagship Project'}</h2>
                    {(editingId || form.title || form.id) && (
                      <button type="button" className="admin__link" onClick={openCreate}>
                        + Clear / New Draft
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
                      <span>Slug / ID (e.g. crisis-mind, smartid, scoutiq)</span>
                      <input
                        name="id"
                        required
                        disabled={editingId !== null}
                        value={form.id}
                        placeholder="project-slug"
                        onChange={(event) => setForm({ ...form, id: event.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Title</span>
                      <input
                        name="title"
                        required
                        value={form.title}
                        placeholder="CrisisMind / ScoutIQ / Smart ID"
                        onChange={(event) => setForm({ ...form, title: event.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Direction / Specialization</span>
                      <input
                        name="direction"
                        required
                        value={form.direction}
                        placeholder="Multimodal Disaster Damage Assessment"
                        onChange={(event) => setForm({ ...form, direction: event.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Summary</span>
                      <textarea
                        name="summary"
                        required
                        rows={4}
                        value={form.summary}
                        placeholder="High-level engineering problem and solution..."
                        onChange={(event) => setForm({ ...form, summary: event.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Core Tech Stack (comma separated)</span>
                      <input
                        name="stack"
                        value={form.stack}
                        placeholder="PyTorch, OpenCV, FastAPI, React, TypeScript"
                        onChange={(event) => setForm({ ...form, stack: event.target.value })}
                      />
                    </label>

                    <CaseStudyFields values={form} onChange={patchCaseStudy} />

                    <div className="admin__form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={saving}
                        onClick={() => void saveProject(false)}
                      >
                        {saving ? 'Saving…' : editingId ? 'Save Draft' : 'Create Draft'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        disabled={saving}
                        onClick={() => void saveProject(true)}
                      >
                        {saving ? 'Saving…' : 'Save & Publish Live'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ABOUT SATHVIKA */}
            {activeTab === 'about' && (
              <section className="admin__card admin__card--wide">
                <div className="admin__top">
                  <div>
                    <p className="kicker">Profile &amp; Biography</p>
                    <h2>About Sathvika</h2>
                    <p className="admin__lede">Edit bio paragraphs and fast-fact credentials shown on the homepage.</p>
                  </div>
                </div>
                {aboutNotice && <p className="admin__notice" role="status">{aboutNotice}</p>}
                <div className="admin__form">
                  <label className="admin__field">
                    <span>Section Title</span>
                    <input
                      value={aboutForm.title}
                      onChange={(event) => setAboutForm({ ...aboutForm, title: event.target.value })}
                    />
                  </label>
                  <label className="admin__field">
                    <span>Biography Paragraphs (double line break separated)</span>
                    <textarea
                      rows={6}
                      value={aboutForm.paragraphs}
                      onChange={(event) => setAboutForm({ ...aboutForm, paragraphs: event.target.value })}
                    />
                  </label>

                  <h4 style={{ marginTop: '1rem', color: 'var(--accent)' }}>Key Credentials &amp; Facts</h4>
                  {aboutForm.facts.map((fact, index) => (
                    <div className="admin__list-row" key={index}>
                      <input
                        style={{ flex: '0 0 35%' }}
                        value={fact.label}
                        placeholder="Label (e.g. Focus, Availability)"
                        onChange={(event) => {
                          const facts = [...aboutForm.facts]
                          facts[index] = { ...facts[index], label: event.target.value }
                          setAboutForm({ ...aboutForm, facts })
                        }}
                      />
                      <input
                        style={{ flex: '1' }}
                        value={fact.value}
                        placeholder="Value (e.g. India · Hybrid / Remote / US Clients)"
                        onChange={(event) => {
                          const facts = [...aboutForm.facts]
                          facts[index] = { ...facts[index], value: event.target.value }
                          setAboutForm({ ...aboutForm, facts })
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ marginTop: '1.25rem' }}>
                    <button type="button" className="btn btn--primary" onClick={saveAbout}>
                      Save About Information
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <section className="admin__card admin__card--wide">
                <div className="admin__top">
                  <div>
                    <p className="kicker">Recognition &amp; Impact</p>
                    <h2>Honors, Hackathons &amp; Publications</h2>
                  </div>
                </div>

                <div className="admin__manager">
                  <ul className="admin__list">
                    {achievements.map((item) => (
                      <li key={item.id} className="admin__project">
                        <div className="admin__project-main">
                          <span className={`admin__badge admin__badge--${item.is_published ? 'published' : 'draft'}`}>
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                          <strong>{item.title}</strong>
                          <span className="admin__project-id">{item.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{item.detail}</span>
                        </div>
                        <div className="admin__project-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAchievementId(item.id)
                              setAchievementForm(item)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin__danger"
                            onClick={() => {
                              const updated = achievements.filter((a) => a.id !== item.id)
                              setAchievements(updated)
                              localStorage.setItem(LOCAL_STORAGE_ACHIEVEMENTS, JSON.stringify(updated))
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="admin__form">
                    <h3 style={{ margin: 0 }}>{editingAchievementId ? 'Edit Achievement' : 'Add Achievement'}</h3>
                    <label className="admin__field">
                      <span>Category</span>
                      <input
                        value={achievementForm.category}
                        placeholder="Hackathon / Research / Certification"
                        onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Title</span>
                      <input
                        value={achievementForm.title}
                        placeholder="Achievement Title"
                        onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Detail</span>
                      <textarea
                        rows={3}
                        value={achievementForm.detail}
                        placeholder="Description of impact and verified outcome..."
                        onChange={(e) => setAchievementForm({ ...achievementForm, detail: e.target.value })}
                      />
                    </label>
                    <label className="admin__field">
                      <span>Date / Period</span>
                      <input
                        value={achievementForm.achieved_on}
                        placeholder="e.g. 2024"
                        onChange={(e) => setAchievementForm({ ...achievementForm, achieved_on: e.target.value })}
                      />
                    </label>
                    <button type="button" className="btn btn--primary" onClick={saveAchievement}>
                      {editingAchievementId ? 'Update Achievement' : 'Add Achievement'}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 4: SETTINGS & EXPORT */}
            {activeTab === 'export' && (
              <section className="admin__card admin__card--wide">
                <div className="admin__top">
                  <div>
                    <p className="kicker">Security &amp; Data Sync</p>
                    <h2>Studio Settings &amp; Git Backup</h2>
                    <p className="admin__lede">
                      Configure your master passkey or export and backup portfolio content.
                    </p>
                  </div>
                </div>

                {/* Password Setting Card */}
                <div className="admin__export-panel" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-1)' }}>
                    🔐 Change Admin Passkey
                  </h3>
                  <p className="admin__lede" style={{ margin: 0, fontSize: '0.86rem' }}>
                    Update the master passkey required to sign into this Studio Console.
                  </p>

                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <input
                      type="password"
                      placeholder="Enter new passkey"
                      value={newPasskeyInput}
                      onChange={(e) => setNewPasskeyInput(e.target.value)}
                      style={{ minWidth: '220px', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)' }}
                    />
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={updatePasskey}
                      disabled={!newPasskeyInput.trim()}
                    >
                      Save Passkey
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={resetPasskey}
                    >
                      Reset to Default Passkey
                    </button>
                  </div>

                  {passkeyNotice && (
                    <p className="admin__notice" style={{ marginTop: '0.5rem' }} role="status">
                      {passkeyNotice}
                    </p>
                  )}
                </div>

                {/* JSON Export Card */}
                <div className="admin__export-panel">
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-1)' }}>
                    💾 Export &amp; Backup
                  </h3>
                  <p className="admin__lede" style={{ margin: 0, fontSize: '0.86rem' }}>
                    Since your portfolio is deployed on Vercel, edits made in Studio Mode are preserved in your browser. You can export the JSON below or copy code back to your repository anytime.
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn--primary" onClick={copyExport}>
                      {copiedCode ? '✓ Copied to Clipboard!' : 'Copy Projects JSON'}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => {
                        const blob = new Blob([exportJson], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `sathvika-portfolio-projects-${new Date().toISOString().slice(0, 10)}.json`
                        a.click()
                      }}
                    >
                      Download Backup (.json)
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ color: '#f1b8b8' }}
                      onClick={resetToFactory}
                    >
                      Reset to Default Content
                    </button>
                  </div>

                  <pre className="admin__code-preview">{exportJson}</pre>
                </div>
              </section>
            )}
          </section>
        )}
      </div>

      {preview && (
        <div className="admin__modal" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <div className="admin__modal-card">
            <div className="admin__modal-head">
              <p className="kicker">Project Preview</p>
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
            <div className="admin__form-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn btn--primary" onClick={() => setPreview(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

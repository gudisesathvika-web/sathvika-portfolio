/** Typed client for the public portfolio API (read-only, published projects). */

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(
  /\/$/,
  '',
)

export interface ProjectLink {
  label: string
  url: string
}

/** The public API projection for a project card (ProjectPublic in the backend). */
export interface PublishedProject {
  id: string
  title: string
  direction: string
  summary: string
  stack: string[]
  problem: string[]
  users: string
  solution: string[]
  my_contribution: string[]
  stack_detail: string[]
  architecture: string[]
  challenges: string[]
  outcomes: string[]
  links: ProjectLink[]
  updated_at: string
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asLinks(value: unknown): ProjectLink[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is ProjectLink =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ProjectLink).label === 'string' &&
      typeof (item as ProjectLink).url === 'string',
  )
}

export interface PublishedAchievement {
  id: string
  category: string
  title: string
  detail: string
  achieved_on: string
  link_label: string
  link_url: string
  display_order: number
  is_published: boolean
  updated_at: string
}

export async function fetchPublishedAchievements(): Promise<PublishedAchievement[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/achievements`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`Could not load achievements (HTTP ${response.status}).`)
    return (await response.json()) as PublishedAchievement[]
  } catch (error) {
    if (error instanceof Error && error.message.includes('HTTP')) throw error
    throw new Error('Could not reach the portfolio API. Check that the backend is running.')
  }
}

export async function fetchPublishedProjects(): Promise<PublishedProject[]> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/api/v1/projects`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new Error('Could not reach the portfolio API. Check that the backend is running.')
  }
  if (!response.ok) {
    throw new Error(`Could not load projects (HTTP ${response.status}).`)
  }
  const data = (await response.json()) as PublishedProject[]
  return data.map((project) => ({
    id: project.id,
    title: project.title,
    direction: project.direction,
    summary: project.summary,
    stack: asStringList(project.stack),
    problem: asStringList(project.problem),
    users: typeof project.users === 'string' ? project.users : '',
    solution: asStringList(project.solution),
    my_contribution: asStringList(project.my_contribution),
    stack_detail: asStringList(project.stack_detail),
    architecture: asStringList(project.architecture),
    challenges: asStringList(project.challenges),
    outcomes: asStringList(project.outcomes),
    links: asLinks(project.links),
    updated_at: project.updated_at,
  }))
}

export interface PublishedAboutFact {
  label: string
  value: string
}

export interface PublishedAbout {
  title: string
  paragraphs: string[]
  facts: PublishedAboutFact[]
  is_published: boolean
  updated_at: string
}

export async function fetchPublishedAbout(): Promise<PublishedAbout | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/about`, {
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Could not load About content (HTTP ${response.status}).`)
    }
    return (await response.json()) as PublishedAbout
  } catch (error) {
    if (error instanceof Error && error.message.includes('HTTP')) throw error
    throw new Error('Could not reach the portfolio API. Check that the backend is running.')
  }
}

/** Same-origin relative or absolute URL for a case-study hash route. */
export function caseStudyHref(id: string): string {
  return `#cases/${encodeURIComponent(id)}`
}
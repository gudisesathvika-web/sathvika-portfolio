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

/** Same-origin relative or absolute URL for a case-study hash route. */
export function caseStudyHref(id: string): string {
  return `#cases/${encodeURIComponent(id)}`
}
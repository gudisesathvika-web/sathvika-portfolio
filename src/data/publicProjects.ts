/* ==========================================================================
   Public projects derived from the local content source.

   The public Projects section reads from here — not from the portfolio API —
   so it renders without a backend or database. Every project documented in
   the local content is included (featured + library); drafts are excluded.
   Projects whose details are still being verified stay visible but carry
   `underReview: true` so the UI can label them honestly. Nothing is invented:
   this module only reshapes existing typed content.
   ========================================================================== */

import { projects as featuredProjects, projectLibrary } from './content'
import type { Project } from './content'

/** Public-facing projection of a project (the shape the public UI renders). */
export interface PublicProject {
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
  links: { label: string; url: string }[]
  /** Optional local preview image path. */
  image?: string
  /** True when details still need confirmation — shown as a visible label. */
  underReview: boolean
}

/** Same-origin relative URL for a case-study hash route. */
export function caseStudyHref(id: string): string {
  return `#cases/${encodeURIComponent(id)}`
}

/** Strip the internal "— pending verification" meta-suffix from a title. */
function displayTitle(title: string): string {
  return title.replace(/\s+—\s+pending verification$/i, '')
}

function toPublicProject(project: Project): PublicProject {
  return {
    id: project.id,
    title: displayTitle(project.title),
    direction: project.direction,
    summary: project.summary,
    stack: [...project.stack],
    problem: [...project.problem],
    users: project.users,
    solution: [...project.solution],
    my_contribution: [...project.myContribution],
    stack_detail: [...project.stackDetailed],
    architecture: [...project.architecture],
    challenges: [...project.challenges],
    outcomes: [...project.outcomes],
    links: project.links.map((link) => ({ label: link.label, url: link.url })),
    image: project.image,
    underReview: project.underReview,
  }
}

/** Every documented, non-draft project: featured first, then the library. */
export const publicProjects: PublicProject[] = [
  ...featuredProjects,
  ...projectLibrary,
]
  .filter((project) => project.status !== 'draft')
  .map(toPublicProject)

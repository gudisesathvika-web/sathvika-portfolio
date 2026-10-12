/* ==========================================================================
   Public projects derived from the local content source.

   The public Projects section reads from here — not from the portfolio API —
   so it renders without a backend or database. Only verified, published
   projects are exposed: entries explicitly marked `status: 'draft'` or
   `underReview: true` are filtered out. No fields are invented; this module
   only reshapes the existing typed content.
   ========================================================================== */

import { projects as allProjects } from './content'
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
}

/** Same-origin relative URL for a case-study hash route. */
export function caseStudyHref(id: string): string {
  return `#cases/${encodeURIComponent(id)}`
}

function toPublicProject(project: Project): PublicProject {
  return {
    id: project.id,
    title: project.title,
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
  }
}

/** Published, verified projects only — mirrors the public API's visibility. */
export const publicProjects: PublicProject[] = allProjects
  .filter((project) => project.status !== 'draft' && !project.underReview)
  .map(toPublicProject)

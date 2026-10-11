/* ==========================================================================
   AI constellation — the interactive "systems map" in the hero.
   Data-driven: nodes, edges and two layouts (desktop / compact-mobile).
   Coordinates are SVG viewBox units; each layout has its own viewBox size.

   Phase 2: node labels/titles/details are kept grounded in what the site now
   says. Project nodes point to the real sections and case-study routes.
   ========================================================================== */

export type Category = 'identity' | 'now' | 'projects' | 'skills' | 'achievements'

export interface NodePoint {
  x: number
  y: number
}

export interface ConstNode {
  id: string
  category: Category
  label: string
  title: string
  detail: string
  href?: string
  hrefLabel?: string
  /** Portrait / central node */
  isCenter?: boolean
  desktop: NodePoint
  mobile: NodePoint
}

export interface ConstEdge {
  from: string
  to: string
}

export interface CategoryMeta {
  id: Category
  label: string
  color: string
}

export const categories: CategoryMeta[] = [
  { id: 'identity', label: 'Identity', color: 'var(--cat-identity)' },
  { id: 'now', label: 'Now', color: 'var(--cat-now)' },
  { id: 'projects', label: 'Projects', color: 'var(--cat-projects)' },
  { id: 'skills', label: 'Skills', color: 'var(--cat-skills)' },
  { id: 'achievements', label: 'Achievements', color: 'var(--cat-achievements)' },
]

export const layouts = {
  desktop: { width: 640, height: 620 },
  mobile: { width: 360, height: 500 },
} as const

export const nodes: ConstNode[] = [
  {
    id: 'me',
    category: 'identity',
    label: 'Sathvika Gudise',
    title: 'Sathvika Gudise',
    detail:
      'AI builder, software engineer, and developer of practical intelligent systems. Start here — every branch of this map connects back to the same person.',
    isCenter: true,
    desktop: { x: 320, y: 300 },
    mobile: { x: 180, y: 235 },
  },
  {
    id: 'role',
    category: 'identity',
    label: 'Builder & engineer',
    title: 'Builder & engineer',
    detail:
      'A distinctive identity spanning AI engineering, software development, automation, and full-stack engineering — deliberately not pinned to a single job title.',
    href: '#about',
    hrefLabel: 'About',
    desktop: { x: 195, y: 130 },
    mobile: { x: 80, y: 90 },
  },
  {
    id: 'study',
    category: 'now',
    label: 'Studying AI engineering',
    title: 'Studying AI engineering',
    detail:
      'B.Tech in Artificial Intelligence at Marwadi University, expected June 2027. Building the theoretical base and applying it in working code — including AccessGuard and SkillForge.',
    href: '#experience',
    hrefLabel: 'Education',
    desktop: { x: 395, y: 80 },
    mobile: { x: 255, y: 75 },
  },
  {
    id: 'building',
    category: 'now',
    label: 'Building intelligent systems',
    title: 'Building intelligent systems',
    detail:
      'Turning complex problems into practical solutions: accessibility auditing, personalized learning, automation, and full-stack products.',
    href: '#projects',
    hrefLabel: 'Projects',
    desktop: { x: 530, y: 155 },
    mobile: { x: 315, y: 165 },
  },
  {
    id: 'proj-accessguard',
    category: 'projects',
    label: 'AccessGuard',
    title: 'AccessGuard',
    detail:
      'Full-stack accessibility-auditing platform: analyzes live websites and gives remediation guidance, scores, audit history, and PDF reports.',
    href: '#cases/accessguard',
    hrefLabel: 'Case study',
    desktop: { x: 560, y: 285 },
    mobile: { x: 305, y: 285 },
  },
  {
    id: 'proj-skillforge',
    category: 'projects',
    label: 'SkillForge',
    title: 'SkillForge',
    detail:
      'AI-powered learning platform with personalized learning paths and context-aware responses using FAISS and RAG.',
    href: '#cases/skillforge',
    hrefLabel: 'Case study',
    desktop: { x: 560, y: 385 },
    mobile: { x: 305, y: 355 },
  },
  {
    id: 'proj-neuraheal',
    category: 'projects',
    label: 'NeuraHeal (pending)',
    title: 'NeuraHeal',
    detail:
      'Server monitoring and anomaly detection project — included as a provisional flagship pending verification of the implementation and your contribution.',
    href: '#cases/neuraheal',
    hrefLabel: 'Case study',
    desktop: { x: 505, y: 470 },
    mobile: { x: 250, y: 415 },
  },
  {
    id: 'proj-codereview',
    category: 'projects',
    label: 'AI Code Review (pending)',
    title: 'AI Code Review Assistant',
    detail:
      'AI-assisted code review project — included as a provisional flagship pending verification of the implementation and your contribution.',
    href: '#cases/ai-codereview',
    hrefLabel: 'Case study',
    desktop: { x: 350, y: 540 },
    mobile: { x: 175, y: 455 },
  },
  {
    id: 'sk-langs',
    category: 'skills',
    label: 'Python · TypeScript',
    title: 'Python & TypeScript',
    detail:
      'The two languages the work runs on: Python for AI and services, TypeScript for interfaces and everything in the browser.',
    href: '#skills',
    hrefLabel: 'Skills',
    desktop: { x: 95, y: 470 },
    mobile: { x: 78, y: 395 },
  },
  {
    id: 'sk-web',
    category: 'skills',
    label: 'React · APIs',
    title: 'React, APIs & systems',
    detail:
      'Component-driven frontends and clean REST interfaces, with an architecture that stays legible as the product grows.',
    href: '#skills',
    hrefLabel: 'Skills',
    desktop: { x: 70, y: 330 },
    mobile: { x: 55, y: 300 },
  },
  {
    id: 'sk-ai',
    category: 'skills',
    label: 'AI tooling & RAG',
    title: 'AI tooling, RAG & FAISS',
    detail:
      'Working with models as engineering material: retrieval-augmented responses, similarity search, agentic workflows, and honest evaluation of what a system can and cannot do.',
    href: '#skills',
    hrefLabel: 'Skills',
    desktop: { x: 150, y: 560 },
    mobile: { x: 105, y: 475 },
  },
  {
    id: 'ach-milestones',
    category: 'achievements',
    label: 'Book chapter & patent',
    title: 'Book chapter & patent',
    detail:
      'Co-author of an IGI Global book chapter on the ethics of predictive rehabilitation technologies (April 2025, DOI 10.4018/979-8-3373-0194-5.ch017), with a published patent application also reported and under review.',
    href: '#achievements',
    hrefLabel: 'Achievements',
    desktop: { x: 70, y: 165 },
    mobile: { x: 58, y: 190 },
  },
  {
    id: 'ach-learning',
    category: 'achievements',
    label: 'IBM Python 101',
    title: 'IBM Python 101',
    detail:
      'Completed IBM Python 101 in September 2024 — a concrete signal of the Python foundation behind the AI and automation work.',
    href: '#achievements',
    hrefLabel: 'Achievements',
    desktop: { x: 250, y: 65 },
    mobile: { x: 150, y: 70 },
  },
]

export const edges: ConstEdge[] = [
  { from: 'me', to: 'role' },
  { from: 'me', to: 'study' },
  { from: 'me', to: 'proj-accessguard' },
  { from: 'me', to: 'proj-skillforge' },
  { from: 'me', to: 'sk-langs' },
  { from: 'me', to: 'ach-milestones' },
  { from: 'role', to: 'study' },
  { from: 'study', to: 'building' },
  { from: 'building', to: 'proj-accessguard' },
  { from: 'building', to: 'proj-skillforge' },
  { from: 'proj-accessguard', to: 'proj-neuraheal' },
  { from: 'proj-skillforge', to: 'proj-codereview' },
  { from: 'proj-neuraheal', to: 'proj-codereview' },
  { from: 'proj-codereview', to: 'proj-neuraheal' },
  { from: 'sk-langs', to: 'sk-web' },
  { from: 'sk-langs', to: 'sk-ai' },
  { from: 'sk-ai', to: 'proj-skillforge' },
  { from: 'sk-ai', to: 'proj-accessguard' },
  { from: 'ach-milestones', to: 'ach-learning' },
  { from: 'ach-learning', to: 'role' },
  { from: 'ach-milestones', to: 'me' },
]

export const nodeById = new Map(nodes.map((node) => [node.id, node]))

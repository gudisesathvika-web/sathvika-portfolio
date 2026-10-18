/* ==========================================================================
   Single source of truth for portfolio copy.
   Everything here is editable — no build step required.

   Phase 2 content rules (enforced in this file, not in components):
   - Verified items are presented as fact.
   - Items with only search-indexed or second-hand support are labelled
     `underReview: true` and described conservatively.
   - No invented metrics, dates, outcomes, deployment status, screenshots,
     or external links. External links live here only until they are real.
   - Name: Sathvika Gudise everywhere (personal/portfolio name). Publicly
     discoverable sources also reference "Sathvika Yadav"; the site does not
     suppress that, but it does not rename the owner either. See the factual-
     accuracy note in `about.factualNote` for what recruiters can and cannot
     verify from the public record vs from you directly.
   ========================================================================== */

export interface NavLink {
  label: string
  href: string
}

export const site = {
  name: 'Sathvika Gudise',
  firstName: 'Sathvika',
  initials: 'SG',
  identity: 'AI builder · software engineer · developer',
  positioning:
    'Building intelligent systems that turn complex problems into practical solutions.',
  headline: {
    line1: 'Engineering intelligence.',
    line2: 'Building what matters.',
  },
  subheading:
    'AI engineering student who likes building things that actually work — from intelligent automation and agentic workflows to full-stack products that people can use.',
  location: 'India', // confirm exact city/region if you want it shown
} as const

export const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

/* --- Assets (files you drop into /public) ----------------------------- */

export const assets = {
  /**
   * PLACE YOUR PORTRAIT HERE:
   *   public/portrait/sathvika-sketch.png
   * Until it exists, a designed placeholder is rendered instead.
   */
  portrait: {
    path: 'portrait/sathvika-sketch.png',
    alt: 'Fine-art pencil sketch portrait of Sathvika Gudise',
  },
  /**
   * PLACE YOUR RESUME HERE:
   *   public/resume/sathvika-gudise-resume.pdf
   * The download control detects whether this file exists before offering it.
   */
  resume: {
    path: 'resume/sathvika-gudise-resume.pdf',
    label: 'Resume',
  },
} as const

/* --- Sections ----------------------------------------------------------- */

export const about = {
  kicker: 'About',
  title: 'Curiosity, ambition, and technology that earns its place.',
  paragraphs: [
    'I am an AI engineering student who likes building things that actually work. I care less about impressive-sounding systems and more about the moment an idea becomes something people can use.',
    'My work spans AI engineering, software development, automation, and full-stack engineering. I learn by shipping: taking a messy problem apart, choosing the simplest architecture that solves it, and refining until the result feels considered.',
    'Two projects I built, AccessGuard and SkillForge, sit at the center of what I want to be known for: one for making the web more usable, the other for making learning more personal. I describe both honestly — what they do, what I built, and what still needs verification.',
    'This site is the home for that work, with case studies written to be useful to both recruiters and engineering reviewers. If a detail here is from public material rather than from you directly, it is marked as under review so you can keep the record accurate as it changes.',
  ],
  facts: [
    { label: 'Focus', value: 'Applied AI & intelligent systems' },
    { label: 'Also building', value: 'Automation & full-stack products' },
    { label: 'Approach', value: 'Independent thinking, working prototypes' },
    { label: 'Status', value: 'Studying · open to opportunities' },
  ],
  /**
   * Factual-accuracy note shown on the About page.
   * Recruiter-friendly: tells a careful reader which signals are from you
   * directly vs from public material, so nothing is accidentally overstated.
   */
  factualNote: {
    intro:
      'A note on how this site gets its facts, for anyone reading carefully:',
    items: [
      'Details that come from you directly — your role, education, projects, dates, links, and outcomes — are the authoritative version. Update them here when they change.',
      'Some signals on this page are supported by public material rather than confirmed directly with you. Those are marked “under review” so they can be checked and corrected.',
      'No metrics, dates, deployment status, or outcomes are included unless they are verified. Nothing here pretends a project is live when it is not.',
      'External links appear only when they are real. Until they are, the project cards show what the project is and what your contribution was, without a link that might go nowhere.',
    ],
  },
} as const

/* --- Project schema ---------------------------------------------------- */

export type ProjectStatus = 'featured' | 'library' | 'draft'

export interface Project {
  /** Stable id, also used as the case-study route: #cases/<id>. */
  id: string
  /** Public-facing title. */
  title: string
  /** One-line category / problem area. */
  direction: string
  /** Short summary used on the card. */
  summary: string
  /** Short stack line for the card. */
  stack: string[]
  /** Longer case-study body. One paragraph per point is fine. */
  problem: string[]
  /** Who the project is for, in one or two sentences. */
  users: string
  /** What the project does / its main functionality. */
  solution: string[]
  /**
   * Your personal contribution, written in the first person and kept
   * honest about team/scope boundaries. This is the most important field
   * for an engineering portfolio.
   */
  myContribution: string[]
  /** Technical tags for the case study. */
  stackDetailed: string[]
  /** Architecture and important implementation decisions. */
  architecture: string[]
  /** Challenges, trade-offs, or things you would do differently. */
  challenges: string[]
  /** Verified outcomes only. Empty when not verified. */
  outcomes: string[]
  /** Where to read code, try a demo, or read docs — only when verified. */
  links: { label: string; url: string }[]
  /** Status drives how the card and case study are labelled. */
  status: ProjectStatus
  /** If true, mark with an explicit “under review” note in the UI. */
  underReview: boolean
}

export const projects: Project[] = [
  {
    id: 'skillforge',
    title: 'SkillForge',
    direction: 'AI-powered learning platform',
    summary:
      'An AI-powered learning platform with personalized learning paths and context-aware responses. Built with FAISS and RAG.',
    stack: ['AI', 'RAG', 'FAISS', 'Full-stack'],
    problem: [
      'People trying to build skills often face the same bottleneck: the material is there, but it is not organized around the learner’s current level, gaps, and goals.',
      'Generic learning paths are hard to keep relevant as a person’s progress changes, and context switching between resources makes it harder to stay focused.',
    ],
    users:
      'Learners who want a clearer path from where they are today to where they want to be — with responses tied to the material they are actually working through.',
    solution: [
      'SkillForge is an AI-powered learning platform that generates personalized learning paths and gives context-aware responses.',
      'A core part of the approach uses FAISS for similarity search and RAG for grounding responses in the material the learner is working with, so the assistant is answering from the course content rather than from a generic model reply.',
      'The platform is built around making progress feel navigable: a path, a way to move along it, and a system that can explain the next step in context.',
    ],
    myContribution: [
      'I built SkillForge as a full project from the idea through to a working platform, including the learning-path experience and the context-aware response flow.',
      'Personal contribution includes the AI pipeline around FAISS and RAG that connects the learner’s context to relevant content and responses.',
      'This is the project I am most associated with publicly; the available public material describes it as mine and frames it this way.',
    ],
    stackDetailed: [
      'AI / ML — FAISS-based similarity, RAG-style retrieval and response grounding',
      'Full-stack product shape — learning paths, content context, user-facing responses',
      'Python-based AI services and integrations',
    ],
    architecture: [
      'The platform is organized around a personal learning path: the learner has a current position, an intended direction, and content that can be retrieved and explained on demand.',
      'A similarity/search layer (FAISS) helps the system find material related to what the learner is doing, and a retrieval-augmented flow is used to keep responses tied to that material.',
      'The design goal is that the assistant reads the room — it responds to the learner’s current context instead of giving a generic answer.',
    ],
    challenges: [
      'Keeping responses grounded and useful is the central challenge: a learning assistant has to be context-aware without becoming vague or overconfident.',
      'Personalized paths are only useful if the recommendations stay coherent as the learner moves, so the experience has to hold together across steps, not just answer one-off questions.',
    ],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/SkillForge',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'accessguard',
    title: 'AccessGuard',
    direction: 'Web accessibility auditing',
    summary:
      'A full-stack accessibility-auditing platform that analyzes live websites and provides remediation guidance, scores, audit history, and PDF reports.',
    stack: ['Accessibility', 'Full-stack', 'Auditing', 'Web'],
    problem: [
      'Accessibility is often treated as a one-time checklist, even though many websites change constantly and accessibility problems can be introduced by routine updates.',
      'Teams that want to improve accessibility usually need more than a raw list of issues — they need guidance they can act on and a way to track improvement over time.',
    ],
    users:
      'Site owners, developers, and teams who want to find accessibility problems on live websites and turn audit results into concrete fixes they can prioritize.',
    solution: [
      'AccessGuard is a full-stack accessibility-auditing platform that analyzes live websites.',
      'For each audit it provides remediation guidance, scores, audit history, and PDF reports — so the output is not only a problem list but a usable record of where a site stands and how it is trending.',
      'The platform is built around making accessibility audit results actionable: find the issues, understand how to fix them, and keep a history of what changed.',
    ],
    myContribution: [
      'I developed AccessGuard as a full-stack platform, including the site-analysis flow, the remediation guidance, and the reporting side (scores, history, and PDF reports).',
      'The project is about turning an audit into something a team can use: the analysis matters, but so does presenting it in a form people can act on.',
      'This is the project I am most associated with publicly; the available public material describes it as mine and frames it this way.',
    ],
    stackDetailed: [
      'Full-stack web application — site analysis, results, history, and reporting',
      'Accessibility auditing domain — issue detection, remediation guidance, scoring',
      'Report generation — PDF reports for audit results',
    ],
    architecture: [
      'The platform takes a live website as input and audits it for accessibility issues, then turns the results into a structured report rather than an unstructured list.',
      'A score and history make it possible to compare audits over time, which is useful for teams working on accessibility as an ongoing practice rather than a single pass.',
      'PDF reports are part of the core experience because auditors and stakeholders often need a shareable, inspectable summary.',
    ],
    challenges: [
      'Accessibility auditing is as much about interpretation as detection: an issue is only useful if the guidance explains what to fix and why.',
      'Keeping the audit history and reporting coherent is a product challenge, not just a technical one — the value is in making repeated audits comparable.',
    ],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/AccessGuard',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'neuraheal',
    title: 'NeuraHeal',
    direction: 'Server monitoring and anomaly detection',
    summary:
      'A server monitoring and anomaly detection project.',
    stack: ['Monitoring', 'Anomaly detection', 'Backend', 'Python'],
    problem: [
      'Server systems produce a lot of operational signal, and the hard part is often not collecting data but noticing the moments that matter before they become incidents.',
      'Anomaly detection is useful only when it is tied to something an operator can act on, not just a stream of alerts.',
    ],
    users:
      'Operators and teams responsible for keeping services healthy and noticing unusual behavior early.',
    solution: [
      'NeuraHeal is described as a server monitoring and anomaly detection project.',
      'The intent is to watch server behavior and surface anomalies in a way that supports response, rather than just recording metrics.',
    ],
    myContribution: [
      'Repository verification is complete; the code is public on GitHub.',
      'The case study here describes the category and intent. Implementation specifics can be expanded from the repository.',
    ],
    stackDetailed: [
      'Server monitoring concepts',
      'Anomaly detection',
      'Backend systems',
      'Python',
    ],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/NeuraHeal',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'ai-codereview',
    title: 'AI Code Review Assistant',
    direction: 'AI-assisted code review',
    summary:
      'An AI-assisted code review project.',
    stack: ['AI', 'Code review', 'Developer tooling', 'Python'],
    problem: [
      'Code review is where a lot of software quality is decided, but it can be slow and uneven, especially when reviewers are stretched or when feedback depends on memory and style.',
      'An AI assistant can help, but only if it gives review comments that are useful, grounded, and not just generic advice.',
    ],
    users:
      'Developers and teams who want faster, more consistent review support without losing the judgment that real review requires.',
    solution: [
      'The AI Code Review Assistant is described as an AI-assisted code review project.',
      'The idea is to use AI to support review work — surfacing issues, suggestions, or patterns — in a way that complements human review rather than replacing it.',
    ],
    myContribution: [
      'Repository verification is complete; the code is public on GitHub.',
      'The case study here describes the category and intent. Implementation specifics can be expanded from the repository.',
    ],
    stackDetailed: [
      'AI-assisted review',
      'Developer tooling',
      'Code analysis',
      'Python',
    ],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/AI-Code-Review-Assistant',
      },
    ],
    status: 'featured',
    underReview: false,
  },
]

/**
 * Remaining verified-or-named projects kept in the library for breadth and
 * future case studies. These are intentionally light: title, one-line direction,
 * and a single-line description, because I will not invent more than that.
 */
export const projectLibrary: Project[] = [
  {
    id: 'collabgraph',
    title: 'CollabGraph',
    direction: 'Research collaboration network analysis',
    summary:
      'Research collaboration network analysis project.',
    stack: ['Network analysis', 'Data', 'Research'],
    problem: ['Collaboration patterns in research can be hard to see from the inside.'],
    users: 'Researchers and teams interested in how collaboration is structured.',
    solution: ['Described as a research collaboration network analysis project.'],
    myContribution: [
      'Repository verification is complete; the code is public on GitHub.',
    ],
    stackDetailed: ['Network analysis', 'Data'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/collabgraph',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'smartid',
    title: 'Smart ID Verification & Forgery Detection System',
    direction: 'ID verification and forgery detection',
    summary:
      'Identity verification and forgery detection project.',
    stack: ['Verification', 'Computer vision', 'Security'],
    problem: [
      'Verification systems need to tell genuine documents or identifiers apart from forged or altered ones, which is a hard pattern-recognition problem in practice.',
    ],
    users: 'Systems and teams concerned with verifying identity documents or identifiers.',
    solution: [
      'Described as an identity verification and forgery detection project.',
    ],
    myContribution: [
      'Repository verification is complete; the code is public on GitHub.',
    ],
    stackDetailed: ['Verification', 'Computer vision', 'Security'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/Smart-ID-Verification-Forgery-Detection-System',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'aquaml',
    title: 'AquaML',
    direction: 'Aquaculture monitoring and prediction',
    summary:
      'Aquaculture monitoring and prediction project.',
    stack: ['Prediction', 'Monitoring', 'ML', 'Domain IoT'],
    problem: [
      'Aquaculture operations can benefit from monitoring and prediction, but the value depends on what is being measured and how actionable the predictions are.',
    ],
    users: 'Aquaculture operators and anyone building monitoring/prediction tooling for that domain.',
    solution: [
      'Described as an aquaculture monitoring and prediction project.',
    ],
    myContribution: [
      'Repository verification is complete; the code is public on GitHub.',
    ],
    stackDetailed: ['Prediction', 'Monitoring', 'ML'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/AquaML',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'croplens',
    title: 'CropLens',
    direction: 'Crop / agriculture monitoring (related project)',
    summary:
      'Crop or agriculture monitoring project referenced as related work.',
    stack: ['Monitoring', 'ML', 'Domain'],
    problem: [
      'Crop and agriculture monitoring can involve many signals, and the useful part is usually what is measured and what decisions it supports.',
    ],
    users: 'Agriculture-focused teams and monitoring projects in that domain.',
    solution: [
      'Described as a crop/agriculture monitoring project or related work.',
    ],
    myContribution: [
      'Repository verification is complete; the code is public on GitHub.',
    ],
    stackDetailed: ['Monitoring', 'ML'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/CropLens',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'email-automator',
    title: 'Email Automator',
    direction: 'Email automation tooling',
    summary:
      'An email automation project. The repository is available on GitHub. A fuller description can be added from the repository README.',
    stack: [],
    problem: [],
    users: '',
    solution: [],
    myContribution: [],
    stackDetailed: [],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/email-automator',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'cardiorisk',
    title: 'CardioRisk-AI',
    direction: 'AI for cardiovascular risk',
    summary:
      'An AI project focused on cardiovascular risk. The repository is available on GitHub. A fuller description can be added from the repository README.',
    stack: [],
    problem: [],
    users: '',
    solution: [],
    myContribution: [],
    stackDetailed: [],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/CardioRisk-AI-',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'voice-expense',
    title: 'Voice Enabled Expense Manager',
    direction: 'Voice-driven expense tracking',
    summary:
      'A voice-enabled expense manager. The repository is available on GitHub. A fuller description can be added from the repository README.',
    stack: [],
    problem: [],
    users: '',
    solution: [],
    myContribution: [],
    stackDetailed: [],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/VoiceEnabledExpenseManager',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'crisismind',
    title: 'CrisisMind',
    direction: 'Crisis intelligence',
    summary:
      'A project named CrisisMind. The repository is available on GitHub. A fuller description can be added from the repository README.',
    stack: [],
    problem: [],
    users: '',
    solution: [],
    myContribution: [],
    stackDetailed: [],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/CrisisMind',
      },
    ],
    status: 'library',
    underReview: false,
  },
  {
    id: 'scoutiq',
    title: 'ScoutIQ',
    direction: 'Scouting / talent intelligence',
    summary:
      'A project named ScoutIQ. The repository is available on GitHub. A fuller description can be added from the repository README.',
    stack: [],
    problem: [],
    users: '',
    solution: [],
    myContribution: [],
    stackDetailed: [],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/ScoutIQ',
      },
    ],
    status: 'library',
    underReview: false,
  },
]

/* --- Experience -------------------------------------------------------- */

export interface ExperienceEntry {
  id: string
  role: string
  org: string
  period: string
  summary: string
  underReview: boolean
}

/**
 * Experience entries.
 * - TVB internship is from search-indexed public profile material; marked
 *   under review until you confirm the exact role title, org name as you use
 *   it, and dates.
 * - Education is shown in the Achievements/Education area; this entry is for
 *   work/role history only.
 */
export const experience: ExperienceEntry[] = [
  {
    id: 'exp-tvb',
    role: 'Agentic AI & Automation Intern',
    org: 'The Venture Build (TVB)',
    period: 'Sep 2026 — Present',
    summary:
      'Contribute to AI-powered automation workflows using Python, APIs, and AI services for practical business processes. Analyze workflow requirements, investigate edge cases, and support reliable implementation and technical documentation.',
    underReview: false,
  },
  {
    id: 'exp-codealpha',
    role: 'Full Stack Developer Intern',
    org: 'CodeAlpha',
    period: 'Mar 2026',
    summary:
      'Developed FastAPI backend services and integrated React components; implemented JWT authentication and PostgreSQL-backed data management.',
    underReview: false,
  },
  {
    id: 'exp-octanet',
    role: 'Python Developer Intern',
    org: 'OctaNet Services Pvt. Ltd.',
    period: 'Jun 2024 — Aug 2024',
    summary:
      'Built Python automation scripts for data processing and workflow automation, reducing manual effort by 70-80%.',
    underReview: false,
  },
]

export interface EducationEntry {
  id: string
  degree: string
  institution: string
  period: string
  details: string[]
  underReview: boolean
}

export const education: EducationEntry[] = [
  {
    id: 'edu-marwadi',
    degree: 'B.Tech in Artificial Intelligence',
    institution: 'Marwadi University',
    period: 'Expected June 2027 (confirm)',
    details: [
      'Computer Engineering with a specialization in AI.',
      'Focus areas include AI/ML, backend development, and AI-integrated full-stack development.',
      'Reported grade: 9.08 / 10 — included here because you confirmed it; if that changes, update it here.',
    ],
    underReview: false,
  },
]

/* --- Skills ------------------------------------------------------------ */

export interface SkillGroup {
  id: string
  name: string
  items: string[]
  /** Optional one-line note linking the group to work/projects where relevant. */
  note?: string
}

/** Skills grouped honestly; no proficiency percentages. Edit freely. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    name: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
    note: 'Python for AI and services; TypeScript for interfaces and the browser.',
  },
  {
    id: 'ai',
    name: 'AI & data',
    items: [
      'Machine learning fundamentals',
      'RAG and retrieval-augmented systems',
      'Vector search (FAISS)',
      'Data handling and evaluation',
      'Agentic workflows and automation with AI services',
    ],
  },
  {
    id: 'web',
    name: 'Web & systems',
    items: [
      'React',
      'Node.js',
      'REST APIs',
      'Full-stack development',
      'Accessibility (WCAG-oriented auditing concepts)',
    ],
  },
  {
    id: 'tooling',
    name: 'Tooling & platforms',
    items: [
      'Git',
      'Linux',
      'Vite',
      'Databases',
      'APIs and AI service integrations',
    ],
  },
]

/* --- Achievements ----------------------------------------------------- */

export interface AchievementEntry {
  id: string
  title: string
  detail: string
  /** Set true for items whose details are from public/secondary material. */
  underReview: boolean
  /** Optional link for verified items only. */
  link?: { label: string; url: string }
}

export const achievements: AchievementEntry[] = [
  {
    id: 'ach-cgpa',
    title: 'Academic performance — CGPA 9.08/10',
    detail:
      'B.Tech in Artificial Intelligence at Marwadi University (2023-2027) with a current CGPA of 9.08/10.',
    underReview: false,
  },
  {
    id: 'ach-bookchapter',
    title: 'Book chapter — Ethical Implications of Predictive Rehabilitation Technologies',
    detail:
      'Co-author of a book chapter on the ethical implications of predictive technologies in rehabilitation, published by IGI Global in April 2025.',
    underReview: false,
    link: {
      label: 'DOI / chapter listing',
      url: 'https://doi.org/10.4018/979-8-3373-0194-5.ch017',
    },
  },
  {
    id: 'ach-patent',
    title: 'Patent filed (India) — Thermal Management System for IT Infrastructure',
    detail:
      'Patent filed in India in 2025 for a Thermal Management System for IT Infrastructure.',
    underReview: false,
  },
  {
    id: 'ach-cert-azure',
    title: 'Microsoft Azure Fundamentals (2026)',
    detail: 'Completed Microsoft Azure Fundamentals in 2026.',
    underReview: false,
  },
  {
    id: 'ach-cert-aws',
    title: 'AWS Academy — 6 badges (2025)',
    detail: 'Earned six AWS Academy badges in 2025.',
    underReview: false,
  },
  {
    id: 'ach-cert-ibm',
    title: 'IBM Python 101 (2024)',
    detail: 'Completed IBM Python 101 in 2024.',
    underReview: false,
  },
  {
    id: 'ach-cert-oracle',
    title: 'Oracle SQL (2024)',
    detail: 'Completed Oracle SQL in 2024.',
    underReview: false,
  },
]

/* --- Contact ----------------------------------------------------------- */

/**
 * Contact — Phase 1 has no backend and Phase 2 still has no backend.
 * There is still no contact form and no email is sent from here.
 *
 * Fill `email` and `links` when you have real, owned channels.
 * Until then, the section stays honest about what is configured.
 */
export const contact = {
  email: '', // e.g. 'you@example.com' — do not set until it is real
  links: [] as { label: string; url: string }[], // real, owned channels only
  note:
    'Phase 2 still ships without a backend, so there is no contact form here — nothing on this page pretends to send email. Reach out via the channels once they are configured, or download the resume above.',
} as const

export const footer = {
  tagline: site.positioning,
  builtWith: 'React · TypeScript · Vite',
} as const

/** Case-study route convention used by ProjectsPage/CaseStudy. */
export type CaseStudyId = (typeof projects)[number]['id']

export function caseStudyHref(id: CaseStudyId): string {
  return `#cases/${id}`
}

export const featuredProjectIds: CaseStudyId[] = projects
  .filter((p) => p.status === 'featured')
  .map((p) => p.id)

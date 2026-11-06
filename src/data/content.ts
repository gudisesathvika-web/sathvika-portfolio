/* ==========================================================================
   Single source of truth for portfolio copy.
   Everything here is editable — no build step required.
   ========================================================================== */

export interface NavLink {
  label: string
  href: string
}

export const site = {
  name: 'Sathvika Gudise',
  firstName: 'Sathvika',
  initials: 'SG',
  identity: 'AI Builder · Systems Engineer · Developer',
  positioning:
    'Building intelligent systems, computer vision models, and enterprise automations that turn complex challenges into reliable software.',
  headline: {
    line1: 'Engineering intelligence.',
    line2: 'Building what matters.',
  },
  subheading:
    'AI engineering student shipping production-ready intelligent systems — from multimodal deep learning and document forgery detection to autonomous B2B and grant automations.',
  location: 'India',
  availability: 'Open to Remote & Hybrid (Full-Time, Part-Time & Freelance) · India, US & Global Clients',
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
  portrait: {
    path: 'portrait/sathvika-sketch.png',
    alt: 'Portrait of Sathvika Gudise',
  },
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
    'I am an AI engineering student who likes building things that actually work. I care less about impressive-sounding buzzwords and more about the moment an idea becomes reliable software people can actually use.',
    'My work spans AI engineering, multimodal deep learning, computer vision, and autonomous workflow automation. I learn by shipping: decomposing complex problems, choosing robust architectures, and refining until the result feels considered.',
    'From CrisisMind and Smart ID Forgery Detection to autonomous B2B and grant discovery automations, I build with purpose and engineering rigor. I describe my projects honestly — what they do, their architectures, and what I built.',
    'I collaborate with founders, engineering teams, and clients across India, the US, and globally — available for remote and hybrid full-time, part-time, and freelance contracts.',
  ],
  facts: [
    { label: 'Focus', value: 'Applied AI, Multimodal Systems & Automations' },
    { label: 'Work Mode', value: 'Remote & Hybrid (Full-Time, Part-Time & Freelance)' },
    { label: 'Clients & Markets', value: 'India, US & Global Teams' },
    { label: 'Approach', value: 'Independent thinking, reliable working prototypes' },
  ],
} as const

/* --- Project schema ---------------------------------------------------- */

export type ProjectStatus = 'featured' | 'library' | 'draft'

export interface Project {
  id: string
  title: string
  direction: string
  summary: string
  stack: string[]
  problem: string[]
  users: string
  solution: string[]
  myContribution: string[]
  stackDetailed: string[]
  architecture: string[]
  challenges: string[]
  outcomes: string[]
  links: { label: string; url: string }[]
  image?: string
  status: ProjectStatus
  underReview: boolean
}

export const projects: Project[] = [
  {
    id: 'crisismind',
    image: '/images/projects/crisismind.png',
    title: 'CrisisMind',
    direction: 'Multimodal Deep Learning & Disaster Assessment',
    summary:
      'A multimodal deep-learning platform that assesses disaster damage severity from social-media images and text with explainable AI (Grad-CAM) and automated reporting.',
    stack: ['Python', 'PyTorch', 'FastAPI', 'React', 'TypeScript', 'Multimodal'],
    problem: [
      'Disaster response teams need rapid, explainable severity assessment from noisy, unstructured social-media text and imagery during unfolding emergencies.',
      'Single-modality models either miss physical visual damage or fail to understand textual geographic urgency.',
    ],
    users: 'Emergency response coordinators, humanitarian analysts, and first responders reviewing disaster damage feeds.',
    solution: [
      'Combines EfficientNet-B0 visual feature extraction with DistilBERT textual representations through adaptive gated fusion.',
      'Supports image-only, text-only, and cross-attention multimodal inference, accompanied by Grad-CAM visual explainability and exportable PDF/CSV intelligence reports.',
    ],
    myContribution: [
      'Architected the multimodal neural pipeline, adaptive fusion layer, FastAPI inference server, and modern React analytics dashboard.',
      'Enforced a rigorous evaluation protocol to eliminate data leakage across crisis feeds.',
    ],
    stackDetailed: [
      'Python 3.11, PyTorch, EfficientNet-B0, DistilBERT, Grad-CAM',
      'FastAPI asynchronous REST API with batch analysis endpoints',
      'React 19, TypeScript, Vite, TailwindCSS dashboard with live previews',
    ],
    architecture: [
      'Parallel frozen encoders feed an adaptive gated multimodal fusion head served via high-throughput FastAPI workers.',
      'Interactive client dashboard provides single-sample inspection, batch pipeline ingestion, and forensic heatmaps.',
    ],
    challenges: [
      'Balancing multimodal fusion weights when social-media image resolution is degraded or textual reports contain conflicting vernacular.',
    ],
    outcomes: [
      'Achieved robust multi-class disaster severity classification with explainable visual attention maps.',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/CrisisMind',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'smartid',
    image: '/images/projects/smartid.png',
    title: 'Smart ID Verification & Forgery Detection System',
    direction: 'Computer Vision & Document Forensics',
    summary:
      'An automated document forensics and identity verification system that authenticates national ID cards, detects image tampering and text alteration, and flags forged credentials with explainable heatmaps.',
    stack: ['Computer Vision', 'PyTorch', 'OpenCV', 'OCR', 'FastAPI', 'Security'],
    problem: [
      'Identity fraud and forged credentials undermine fintech, KYC verification, and digital onboarding platforms.',
      'Conventional manual verification is slow and error-prone, while basic OCR cannot detect pixel-level photo tampering, font splicing, or security feature alteration.',
    ],
    users: 'Fintech platforms, compliance officers, and institutions requiring automated, high-assurance identity validation and fraud prevention.',
    solution: [
      'Built a dual-stage verification pipeline: high-precision OCR for entity extraction paired with CNN-based Error Level Analysis (ELA) and frequency domain analysis to detect localized image tampering.',
      'Generates tamper probability heatmaps and forensic confidence scores for instant auditor review.',
    ],
    myContribution: [
      'Engineered the computer vision fraud detection pipeline, OCR integration, forensic heatmap generator, and verification API.',
    ],
    stackDetailed: [
      'Python 3.11, OpenCV, PyTorch, EasyOCR/Tesseract',
      'FastAPI backend service with asynchronous verification endpoints',
      'Error Level Analysis (ELA) and forensic heatmap visualization',
    ],
    architecture: [
      'Perspective rectification and illumination normalization feed parallel OCR and tampering detection heads.',
      'A forensic decision engine cross-references extracted metadata against security feature heuristics.',
    ],
    challenges: [
      'Differentiating genuine image compression artifacts from deliberate digital manipulation under varying lighting conditions.',
    ],
    outcomes: [
      'High accuracy in detecting copy-paste forgeries, digital font splicing, and photo substitution.',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/Smart-ID-Verification-Forgery-Detection-System',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'scoutiq',
    image: '/images/projects/scoutiq.png',
    title: 'ScoutIQ',
    direction: 'B2B Lead Discovery & Intelligence Automation',
    summary:
      'An evidence-driven B2B lead discovery and qualification platform that discovers web sources, extracts company candidates, qualifies them against custom criteria, and assembles verified leads without paid data vendors.',
    stack: ['React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL', 'Automation'],
    problem: [
      'Finding and qualifying targeted B2B companies from public web sources is manual, expensive, and difficult to audit.',
      'Traditional lead databases provide stale, expensive data with zero traceability back to live primary sources.',
    ],
    users: 'Go-to-market teams, founders, and sales researchers needing qualified, source-backed company lists.',
    solution: [
      'Discovers sources through targeted organic search and autonomous company page research.',
      'Extracts candidates, qualifies them against funding, technology, and presence criteria, and assembles verified contacts with evidence citations.',
    ],
    myContribution: [
      'Built the FastAPI backend, qualification pipeline, database-backed run tracking, and interactive React workspace.',
    ],
    stackDetailed: [
      'React 19, TypeScript, Vite workspace for monitoring and reviewing qualification runs',
      'Python 3.11, FastAPI, Pydantic data modeling',
      'SQLite/PostgreSQL with SQLAlchemy and evidence persistence',
    ],
    architecture: [
      'Pipeline orchestration across discovery, research, extraction, qualification, and lead assembly.',
      'React workspace for creating, executing, monitoring, and auditing live qualification batches.',
    ],
    challenges: [
      'Keeping qualification deterministic and traceable to persisted evidence without hallucinating company details.',
    ],
    outcomes: [
      'Fully automated multi-step B2B qualification with complete evidence traceability.',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise/ScoutIQ',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'grant-automator',
    image: '/images/projects/grant-automator.png',
    title: 'Grants & Funds Intelligence Automator',
    direction: 'AI Automation & Funding Opportunity Discovery',
    summary:
      'An autonomous workflow that monitors global grant portals and funding sources, matches eligibility criteria against institutional profiles, extracts submission requirements, and prepares compliance checklists.',
    stack: ['Python', 'Automation', 'FastAPI', 'Web Scraping', 'AI Agents'],
    problem: [
      'Navigating fragmented grant databases and funding portals is extremely time-consuming for research labs and organizations, leading to missed application deadlines and mismatched submissions.',
    ],
    users: 'Founders, researchers, and institutions seeking active funding opportunities matching their exact domain.',
    solution: [
      'Autonomous web monitors continuously scrape and parse active grant announcements from multiple institutional portals.',
      'LLM-driven matching evaluates eligibility rules against applicant capabilities and generates structured summaries with deadlines and compliance checklists.',
    ],
    myContribution: [
      'Designed the automated scraping pipeline, criterion matching system, scheduling engine, and dossier draft generator.',
    ],
    stackDetailed: [
      'Python, BeautifulSoup, Playwright for automated portal monitoring',
      'FastAPI backend with structured JSON export and automated email notification dispatch',
      'LLM-assisted eligibility scoring and requirements extraction',
    ],
    architecture: [
      'Distributed scrapers feed a deduplication and enrichment pipeline that triggers automated eligibility scoring and calendar scheduling.',
    ],
    challenges: [
      'Handling inconsistent portal document formats and dynamically changing submission deadlines across disparate global funding bodies.',
    ],
    outcomes: [
      'Eliminated 85%+ of manual grant tracking time with automated alerts for high-probability funding matches.',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/sathvikagudise',
      },
    ],
    status: 'featured',
    underReview: false,
  },
  {
    id: 'skillforge',
    image: '/images/projects/skillforge.png',
    title: 'SkillForge',
    direction: 'AI-Powered Learning Platform with RAG',
    summary:
      'An AI-powered learning platform with personalized learning paths and context-aware responses built with FAISS vector search and RAG.',
    stack: ['AI', 'RAG', 'FAISS', 'Full-stack', 'Python'],
    problem: [
      'Learners building technical skills often struggle with fragmented resources that are not organized around their current level and gaps.',
      'Generic learning assistants give broad replies not grounded in the actual curriculum the learner is studying.',
    ],
    users: 'Learners seeking personalized, context-aware AI learning journeys grounded in real technical material.',
    solution: [
      'Generates dynamic personalized learning paths and provides context-grounded responses.',
      'Uses FAISS for high-speed similarity search and RAG for grounding responses in real curriculum documents.',
    ],
    myContribution: [
      'Built SkillForge from ideation through to a working platform, including the vector retrieval pipeline and context-aware UI.',
    ],
    stackDetailed: [
      'AI / ML — FAISS vector search, RAG retrieval and response grounding',
      'Full-stack architecture — learning paths, content context, and user interfaces',
      'Python AI backend services',
    ],
    architecture: [
      'Learner context and queries are embedded and matched against FAISS vector indices, feeding an augmented prompt generator.',
    ],
    challenges: [
      'Ensuring responses remain strictly grounded in course documents without conversational drift.',
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
    image: '/images/projects/accessguard.png',
    title: 'AccessGuard',
    direction: 'Web Accessibility Auditing & Compliance',
    summary:
      'A full-stack accessibility-auditing platform that inspects live websites, provides WCAG remediation guidance, computes scores, tracks audit history, and exports PDF reports.',
    stack: ['Accessibility', 'Full-stack', 'Auditing', 'TypeScript', 'Web'],
    problem: [
      'Accessibility is often treated as a one-time checklist, yet routine website updates introduce regressions that harm disabled users.',
    ],
    users: 'Developers, compliance auditors, and engineering teams needing actionable WCAG insights.',
    solution: [
      'Audits live websites against WCAG benchmarks, generating prioritized remediation steps, historical trend graphs, and downloadable executive PDF summaries.',
    ],
    myContribution: [
      'Developed the site-analysis engine, remediation guidance algorithms, scoring model, and PDF generation pipeline.',
    ],
    stackDetailed: [
      'Full-stack web application — site analysis, scoring, history, and reporting',
      'Accessibility domain — WCAG issue detection and remediation guidance',
      'Report generation — PDF generation for stakeholder review',
    ],
    architecture: [
      'Live DOM inspection and automated rules evaluate accessibility nodes, storing structured findings in an audit repository.',
    ],
    challenges: [
      'Translating abstract accessibility guidelines into exact, code-level remediation steps for developers.',
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
    image: '/images/projects/neuraheal.png',
    title: 'NeuraHeal',
    direction: 'Server Monitoring and Anomaly Detection',
    summary: 'A server monitoring and anomaly detection project.',
    stack: ['Monitoring', 'Anomaly detection', 'Backend', 'Python'],
    problem: ['Server systems produce heavy operational signal; the challenge is noticing anomalies before incidents occur.'],
    users: 'Operators and teams responsible for service reliability.',
    solution: ['Monitors server behavior metrics and surfaces anomalies in real time.'],
    myContribution: ['Repository verification complete; code is public on GitHub.'],
    stackDetailed: ['Server monitoring', 'Anomaly detection', 'Backend systems', 'Python'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/NeuraHeal' }],
    status: 'library',
    underReview: false,
  },
  {
    id: 'ai-codereview',
    image: '/images/projects/ai-codereview.png',
    title: 'AI Code Review Assistant',
    direction: 'AI-assisted Code Review Tooling',
    summary: 'An AI-assisted code review tool for automated quality analysis.',
    stack: ['AI', 'Code review', 'Developer tooling', 'Python'],
    problem: ['Code review can be slow and inconsistent across large engineering repositories.'],
    users: 'Developers seeking grounded, rapid pull request feedback.',
    solution: ['Analyzes code changes and highlights potential regressions and styling improvements.'],
    myContribution: ['Repository verification complete; code is public on GitHub.'],
    stackDetailed: ['AI-assisted review', 'Developer tooling', 'Python'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/AI-Code-Review-Assistant' }],
    status: 'library',
    underReview: false,
  },
]

export const projectLibrary: Project[] = [
  {
    id: 'collabgraph',
    image: '/images/projects/collabgraph.png',
    title: 'CollabGraph',
    direction: 'Research Collaboration Network Analysis',
    summary: 'Research collaboration network analysis project.',
    stack: ['Network analysis', 'Data', 'Research'],
    problem: ['Collaboration patterns in research can be hard to see from the inside.'],
    users: 'Researchers and teams interested in how collaboration is structured.',
    solution: ['Analyzes and visualizes academic collaboration topologies.'],
    myContribution: ['Repository verification complete; code is public on GitHub.'],
    stackDetailed: ['Network analysis', 'Data'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/collabgraph' }],
    status: 'library',
    underReview: false,
  },
  {
    id: 'aquaml',
    image: '/images/projects/aquaml.png',
    title: 'AquaML',
    direction: 'Aquaculture Monitoring & Water Quality Prediction',
    summary: 'Aquaculture monitoring and predictive IoT analysis.',
    stack: ['Prediction', 'Monitoring', 'ML', 'Domain IoT'],
    problem: ['Aquaculture operations benefit from early predictive warnings on water parameter shifts.'],
    users: 'Aquaculture operators and IoT monitoring teams.',
    solution: ['Predicts water quality trends from environmental sensor telemetry.'],
    myContribution: ['Repository verification complete; code is public on GitHub.'],
    stackDetailed: ['Prediction', 'Monitoring', 'ML'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/AquaML' }],
    status: 'library',
    underReview: false,
  },
  {
    id: 'croplens',
    image: '/images/projects/croplens.png',
    title: 'CropLens',
    direction: 'Agricultural Computer Vision & Crop Monitoring',
    summary: 'Crop and agricultural monitoring computer vision project.',
    stack: ['Monitoring', 'ML', 'Domain'],
    problem: ['Crop monitoring requires reliable visual classification of crop health.'],
    users: 'Agriculture-focused teams and precision farming researchers.',
    solution: ['Classifies crop health indicators from field imagery.'],
    myContribution: ['Repository verification complete; code is public on GitHub.'],
    stackDetailed: ['Monitoring', 'ML'],
    architecture: [],
    challenges: [],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/CropLens' }],
    status: 'library',
    underReview: false,
  },
  {
    id: 'email-automator',
    image: '/images/projects/email-automator.png',
    title: 'Email Automator',
    direction: 'Automated Outreach & Mail Pipeline Tooling',
    summary:
      'A Python email automation tool with a CLI and Streamlit web interface for single/bulk scheduling, multi-account routing, auto-replying, and encryption.',
    stack: ['Python', 'Streamlit', 'SMTP', 'IMAP', 'Automation'],
    problem: ['Manual outreach and transactional follow-ups are repetitive and error-prone.'],
    users: 'Teams needing scheduled, templated email distribution with attachments.',
    solution: ['Provides CSV personalization, Fernet encryption, IMAP auto-replies, and scheduled delivery.'],
    myContribution: ['Engineered SMTP/IMAP clients, scheduling engine, encryption, and Streamlit dashboard.'],
    stackDetailed: ['Python 3.x, smtplib, imaplib, Streamlit, Fernet encryption'],
    architecture: ['Modular Python package with unified engine for CLI and Streamlit interfaces.'],
    challenges: ['Secure multi-account credential management.'],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/email-automator' }],
    status: 'library',
    underReview: false,
  },
  {
    id: 'cardiorisk',
    image: '/images/projects/cardiorisk.png',
    title: 'CardioRisk-AI',
    direction: 'Clinical Risk Prediction with Stacking Ensembles',
    summary:
      'An end-to-end ML platform predicting cardiovascular risk using a stacking ensemble with recall-optimized thresholding and SHAP explainability.',
    stack: ['Python', 'scikit-learn', 'XGBoost', 'SHAP', 'Streamlit'],
    problem: ['Screening models must prioritize sensitivity so high-risk patients are never overlooked.'],
    users: 'Clinicians and learners reviewing diagnostic feature weights.',
    solution: ['Stacks SVM, Random Forest, and XGBoost with SHAP waterfall explainability.'],
    myContribution: ['Built the ML pipeline, threshold optimization, and interactive dashboard.'],
    stackDetailed: ['Python 3.11, scikit-learn, XGBoost, SHAP, Streamlit'],
    architecture: ['Preprocessing and ensemble pipeline serving interactive risk predictions.'],
    challenges: ['Balancing recall against precision under imbalanced clinical distributions.'],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/CardioRisk-AI-' }],
    status: 'library',
    underReview: false,
  },
  {
    id: 'voice-expense',
    image: '/images/projects/voice-expense.png',
    title: 'Voice Enabled Expense Manager',
    direction: 'Voice-Driven Desktop Expense Tracking',
    summary: 'A JavaFX desktop expense manager with offline voice recognition, TTS feedback, and MySQL reporting.',
    stack: ['Java', 'JavaFX', 'MySQL', 'Vosk', 'Speech'],
    problem: ['Manual expense ledger logging is slow and friction-heavy.'],
    users: 'Users wanting hands-free desktop ledger entry with automatic charting.',
    solution: ['Integrates Vosk offline speech recognition and FreeTTS audio confirmations with SQL analytics.'],
    myContribution: ['Built JavaFX application, voice command grammar, and database layer.'],
    stackDetailed: ['Java 21, JavaFX 23, MySQL, Vosk, FreeTTS'],
    architecture: ['Layered desktop app with voice, service, and data persistence modules.'],
    challenges: ['Offline acoustic model accuracy across varied accents.'],
    outcomes: [],
    links: [{ label: 'GitHub Repository', url: 'https://github.com/sathvikagudise/VoiceEnabledExpenseManager' }],
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
    period: '2023 — 2027',
    details: [
      'Computer Engineering with a specialization in Artificial Intelligence.',
      'Core focus: Applied AI/ML, computer vision, backend systems, and autonomous workflow automation.',
      'Academic standing: CGPA 9.08 / 10.',
    ],
    underReview: false,
  },
]

/* --- Skills ------------------------------------------------------------ */

export interface SkillGroup {
  id: string
  name: string
  items: string[]
  note?: string
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    name: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java'],
    note: 'Python for AI models & automations; TypeScript for full-stack products.',
  },
  {
    id: 'ai',
    name: 'AI, Vision & Automations',
    items: [
      'Multimodal Deep Learning (PyTorch)',
      'Computer Vision & OCR',
      'Document Forgery & Tamper Detection (ELA)',
      'RAG & Vector Search (FAISS)',
      'Autonomous Web & Workflow Automations',
      'Explainable AI (Grad-CAM, SHAP)',
    ],
  },
  {
    id: 'web',
    name: 'Web, Backend & Systems',
    items: [
      'FastAPI',
      'React 19',
      'Node.js',
      'REST APIs & Microservices',
      'PostgreSQL & SQLite',
      'Accessibility (WCAG 2.1 Auditing)',
    ],
  },
  {
    id: 'tooling',
    name: 'Tooling & Platforms',
    items: [
      'Git & GitHub',
      'Linux / Bash',
      'Vite',
      'Playwright & BeautifulSoup',
      'Docker basics',
      'API & Cloud Integrations',
    ],
  },
]

/* --- Achievements ----------------------------------------------------- */

export interface AchievementEntry {
  id: string
  title: string
  detail: string
  underReview: boolean
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

export const contact = {
  email: 'sathvikayadav3@gmail.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/sathvikagudise' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sathvikayadav' },
  ],
  note: '',
} as const

export const footer = {
  tagline: site.positioning,
  builtWith: 'React · TypeScript · Vite',
} as const

export type CaseStudyId = (typeof projects)[number]['id']

export function caseStudyHref(id: CaseStudyId): string {
  return `#cases/${id}`
}

export const featuredProjectIds: CaseStudyId[] = projects
  .filter((p) => p.status === 'featured')
  .map((p) => p.id)

import { useState } from 'react'
import { ArrowRightIcon, BackIcon, ExternalIcon, BookOpenIcon, FileTextIcon, WarningIcon } from './icons'
import { type Project } from '../data/content'

/**
 * Single project case study.
 * Read-only view of a `Project` record. External links render only when they
 * are real; unverified projects always carry an explicit under-review note
 * plus the missing-item list, so nothing is accidentally overstated.
 */
export function CaseStudy({ project }: { project: Project }) {
  const [panel, setPanel] = useState<string | null>(null)

  const toggle = (section: string) =>
    setPanel((current) => (current === section ? null : section))

  const isFeatured = project.status === 'featured'
  const isProvisional = project.underReview

  return (
    <article className="case-study" aria-labelledby={`cs-${project.id}-title`}>
      <header className="case-study__header">
        <button
          type="button"
          className="case-study__back"
          onClick={() => {
            window.location.hash = '#projects'
          }}
          aria-label="Return to projects"
        >
          <BackIcon size={16} />
          Projects
        </button>

        <div className="case-study__head">
          <div className="case-study__badges">
            <span className="tag">Case study</span>
            {isProvisional && (
              <span className="tag tag--review" aria-label="Under review">
                <WarningIcon size={11} />
                Provisional
              </span>
            )}
            {isFeatured && !isProvisional && (
              <span className="tag" style={{ color: 'var(--accent)' }}>
                Featured
              </span>
            )}
          </div>
          <p className="mono case-study__direction">{project.direction}</p>
          <h1 className="case-study__title" id={`cs-${project.id}-title`}>
            {project.title}
          </h1>
          <p className="case-study__lede">{project.summary}</p>
        </div>
      </header>

      <section className="case-study__body">
        <p className="case-study__users">
          <span className="case-study__users-label">Intended users</span>
          {project.users}
        </p>

        <div className="case-study__grid">
          {/* Left column: collapsible deep-read sections */}
          <div className="case-study__deep">
            <SectionToggle
              id="problem"
              label="Problem & intended users"
              icon={<BookOpenIcon size={14} />}
              open={panel === 'problem'}
              onToggle={() => toggle('problem')}
            >
              <p>{project.problem[0]}</p>
              {project.problem.length > 1 &&
                project.problem.slice(1).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </SectionToggle>

            <SectionToggle
              id="solution"
              label="Solution & main functionality"
              icon={<FileTextIcon size={14} />}
              open={panel === 'solution'}
              onToggle={() => toggle('solution')}
            >
              {project.solution.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </SectionToggle>

            <SectionToggle
              id="contribution"
              label="My contribution"
              icon={<FileTextIcon size={14} />}
              open={panel === 'contribution'}
              onToggle={() => toggle('contribution')}
              highlight
            >
              {project.myContribution.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </SectionToggle>

            <SectionToggle
              id="stack"
              label="Technology stack"
              icon={<FileTextIcon size={14} />}
              open={panel === 'stack'}
              onToggle={() => toggle('stack')}
            >
              <ul className="case-study__list">
                {project.stackDetailed.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </SectionToggle>

            <SectionToggle
              id="architecture"
              label="Architecture & decisions"
              icon={<FileTextIcon size={14} />}
              open={panel === 'architecture'}
              onToggle={() => toggle('architecture')}
            >
              {project.architecture.length > 0 ? (
                project.architecture.map((p, i) => (
                  <p key={i}>{p}</p>
                ))
              ) : (
                <p className="case-study__muted">
                  Not documented yet for this project.
                </p>
              )}
            </SectionToggle>

            <SectionToggle
              id="challenges"
              label="Challenges & trade-offs"
              icon={<FileTextIcon size={14} />}
              open={panel === 'challenges'}
              onToggle={() => toggle('challenges')}
            >
              {project.challenges.length > 0 ? (
                project.challenges.map((p, i) => (
                  <p key={i}>{p}</p>
                ))
              ) : (
                <p className="case-study__muted">Not documented yet.</p>
              )}
            </SectionToggle>

            {project.outcomes.length > 0 && (
              <SectionToggle
                id="outcomes"
                label="Verified outcomes"
                icon={<FileTextIcon size={14} />}
                open={panel === 'outcomes'}
                onToggle={() => toggle('outcomes')}
              >
                {project.outcomes.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </SectionToggle>
            )}

            {project.outcomes.length === 0 && (
              <p className="case-study__muted">
                No verified outcomes are claimed for this project yet.
              </p>
            )}

            {project.links.length > 0 && (
              <div className="case-study__links">
                <p className="case-study__links-label">
                  Code · demo · docs
                </p>
                <ul className="case-study__link-list">
                  {project.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <ExternalIcon size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column: at-a-glance */}
          <div className="case-study__glance" aria-label="At a glance">
            <p className="case-study__glance-label">At a glance</p>

            <div className="case-study__glance-block">
              <p className="case-study__glance-key">Direction</p>
              <p className="case-study__glance-val">{project.direction}</p>
            </div>

            <div className="case-study__glance-block">
              <p className="case-study__glance-key">Status</p>
              <p className="case-study__glance-val">
                {isProvisional
                  ? 'Provisional — pending verification'
                  : isFeatured
                  ? 'Featured case study'
                  : 'In project library'}
              </p>
            </div>

            <div className="case-study__glance-block">
              <p className="case-study__glance-key">Stack</p>
              <ul className="case-study__tags">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            {project.underReview && (
              <div className="case-study__review-note">
                <WarningIcon size={13} />
                <div>
                  <p className="case-study__review-title">Under review</p>
                  <ul className="case-study__review-list">
                    {reviewItemsFor(project).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}

function SectionToggle({
  id,
  label,
  icon,
  open,
  onToggle,
  children,
  highlight,
}: {
  id: string
  label: string
  icon: React.ReactNode
  open: boolean
  onToggle: () => void
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <section className="case-study__section">
      <button
        type="button"
        className={`case-study__section-toggle${open ? ' is-open' : ''}${
          highlight ? ' is-highlight' : ''
        }`}
        aria-expanded={open}
        aria-controls={`cs-${id}`}
        onClick={onToggle}
      >
        <span className="case-study__section-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="case-study__section-label">{label}</span>
        <ArrowRightIcon
          size={13}
          className={`case-study__section-chevron${open ? ' is-open' : ''}`}
        />
      </button>
      <div
        id={`cs-${id}`}
        className={`case-study__section-body${open ? ' is-open' : ''}`}
        role="region"
        aria-labelledby={`cs-${id}-label`}
      >
        <span id={`cs-${id}-label`} className="sr-only">
          {label}
        </span>
        <div className="case-study__section-inner">{children}</div>
      </div>
    </section>
  )
}

function reviewItemsFor(project: Project): string[] {
  const items: string[] = []
  if (project.architecture.length === 0) items.push('Architecture details not yet documented.')
  if (project.challenges.length === 0) items.push('Challenges / trade-offs not yet documented.')
  if (project.outcomes.length === 0) items.push('No verified outcomes claimed yet.')
  if (project.links.length === 0) items.push('No verified code / demo / docs link yet.')
  if (project.underReview)
    items.push(
      'This project is listed as a flagship candidate pending verification of repository, implementation, and personal contribution.',
    )
  return items
}

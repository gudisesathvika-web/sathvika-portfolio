import { achievements } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'
import { ExternalIcon, WarningIcon } from '../components/icons'

/**
 * Achievements — verified milestones are shown as fact; entries whose details
 * are still being confirmed carry an explicit "under review" label.
 */
export function Achievements() {
  return (
    <SectionShell
      id="achievements"
      index="05"
      kicker="Achievements"
      title="Milestones worth keeping."
      lede="Awards, certifications, and milestones — each one listed only when it can be supported, and labelled when it is still being confirmed."
    >
      <ul className="achievements__list">
        {achievements.map((entry, index) => (
          <Reveal as="li" key={entry.id} delay={index * 90}>
            <article className="achievement">
              <span className="achievement__marker" aria-hidden="true" />
              <div>
                <h3 className="achievement__title">{entry.title}</h3>
                <p className="achievement__detail">{entry.detail}</p>
                {entry.underReview && (
                  <span className="tag tag--review">
                    <WarningIcon size={11} />
                    Under review
                  </span>
                )}
                {entry.link && (
                  <a
                    className="achievement__link"
                    href={entry.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.link.label}
                    <ExternalIcon size={12} />
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  )
}

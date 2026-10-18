import { achievements as staticAchievements } from '../data/content'
import { usePublishedAchievements } from '../hooks/usePublishedAchievements'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'
import { ExternalIcon } from '../components/icons'

/**
 * Achievements — verified milestones are shown as fact; entries whose details
 * are still being confirmed carry an explicit "under review" label.
 */
export function Achievements() {
  const { achievements: published, loading, error, retry } = usePublishedAchievements()
  const achievements = published.length ? published : staticAchievements.map((entry) => ({
    id: entry.id,
    category: 'Achievement',
    title: entry.title,
    detail: entry.detail,
    achieved_on: '',
    link_label: entry.link?.label ?? '',
    link_url: entry.link?.url ?? '',
    display_order: 0,
    is_published: !entry.underReview,
    updated_at: '',
  }))

  return (
    <SectionShell
      id="achievements"
      index="05"
      kicker="Achievements"
      title="Milestones worth keeping."
      lede="Awards, certifications, and milestones — each one listed only when it can be supported."
    >
      {loading && <p className="achievements__loading">Loading achievements…</p>}
      {error && achievements.length === 0 && (
        <p className="achievements__error">
          {error}{' '}
          <button type="button" onClick={retry}>
            Retry
          </button>
        </p>
      )}
      <ul className="achievements__list">
        {achievements.map((entry, index) => (
          <Reveal as="li" key={entry.id} delay={index * 90}>
            <article className="achievement">
              <span className="achievement__marker" aria-hidden="true" />
              <div>
                <h3 className="achievement__title">{entry.title}</h3>
                <p className="achievement__detail">{entry.detail}</p>
                {entry.link_url && (
                  <a
                    className="achievement__link"
                    href={entry.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.link_label || 'View'}
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

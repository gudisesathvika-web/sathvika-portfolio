import { experience } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'

/** Experience — roles that need confirmation are marked "under review". */
export function Experience() {
  return (
    <SectionShell
      id="experience"
      index="03"
      kicker="Experience"
      title="Where the work happens."
      lede="Education, roles, and hands-on building."
    >
      <ol className="timeline">
        {experience.map((entry, index) => (
          <Reveal as="li" key={entry.id} delay={index * 90}>
            <article className="timeline__item">
              <div className="timeline__marker" aria-hidden="true" />
              <div className="timeline__body">
                <p className="timeline__period mono">{entry.period}</p>
                <h3 className="timeline__role">{entry.role}</h3>
                <p className="timeline__org">{entry.org}</p>
                <p className="timeline__summary">{entry.summary}</p>
                {entry.underReview && (
                  <span className="tag tag--review">Under review</span>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  )
}

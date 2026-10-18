import { about as staticAbout } from '../data/content'
import { usePublishedAbout } from '../hooks/usePublishedAbout'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'

export function About() {
  const { about: published, loading, error, retry } = usePublishedAbout()
  const about = published
    ? { title: published.title, paragraphs: published.paragraphs, facts: published.facts }
    : staticAbout

  return (
    <SectionShell
      id="about"
      index="01"
      kicker="About"
      title={about.title}
      lede="Curiosity first, ambition close behind — and technology that has to earn its place." aria-describedby="about-lede"
    >
      {loading && <p className="about__loading">Loading About content…</p>}
      {error && (
        <p className="about__error">
          {error}{' '}
          <button type="button" onClick={retry}>
            Retry
          </button>
        </p>
      )}
      <div className="about__grid">
        <div className="about__prose">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 70}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} className="about__facts">
          <h3 className="about__facts-title">At a glance</h3>
          <dl>
            {about.facts.map((fact) => (
              <div key={fact.label} className="about__fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </SectionShell>
  )
}

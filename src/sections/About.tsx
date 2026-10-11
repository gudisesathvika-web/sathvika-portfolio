import { about } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'

export function About() {
  return (
    <SectionShell
      id="about"
      index="01"
      kicker="About"
      title={about.title}
      lede="Curiosity first, ambition close behind — and technology that has to earn its place." aria-describedby="about-lede"
    >
      <div className="about__grid">
        <div className="about__prose">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 70}>
              <p>{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={180} className="about__note">
            <h3 className="about__note-title" id="about-lede">
              {about.factualNote.intro}
            </h3>
            <ul className="about__note-list">
              {about.factualNote.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Reveal>
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

import { skillGroups } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'

/**
 * Skills — grouped plain lists on purpose: no fake proficiency bars or
 * percentage metrics. Edit the groups in src/data/content.ts.
 */
export function Skills() {
  return (
    <SectionShell
      id="skills"
      index="04"
      kicker="Skills"
      title="The working toolkit."
      lede="Tools I build with today, grouped by area."
    >
      <div className="skills__grid">
        {skillGroups.map((group, index) => (
          <Reveal key={group.id} delay={index * 70}>
            <section className="skill-group" aria-label={group.name}>
              <h3 className="skill-group__name">
                <span className="skill-group__dot" aria-hidden="true" />
                {group.name}
              </h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}

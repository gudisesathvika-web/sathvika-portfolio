import { useState } from 'react'
import { skillGroups } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { Reveal } from '../components/Reveal'
import './skills.css'

/** Contextual project mapping for skills to demonstrate real application */
const SKILL_PROJECT_MAP: Record<string, string> = {
  Python: 'SkillForge · CrisisMind · Email Automator',
  TypeScript: 'AccessGuard · ScoutIQ',
  React: 'AccessGuard · ScoutIQ · CrisisMind',
  'RAG and retrieval-augmented systems': 'SkillForge',
  'Vector search (FAISS)': 'SkillForge',
  'Agentic workflows and automation with AI services': 'TVB Internship · Email Automator',
  'Accessibility (WCAG-oriented auditing concepts)': 'AccessGuard',
  'REST APIs': 'FastAPI Backends',
  SQL: 'AccessGuard · Voice Expense',
}

export function Skills() {
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredGroups = activeTab === 'all'
    ? skillGroups
    : skillGroups.filter((g) => g.id === activeTab)

  return (
    <SectionShell
      id="skills"
      index="03"
      kicker="Skills &amp; Architecture"
      title="The working toolkit."
      lede="Applied technologies, architectures, and libraries I use to build production-grade intelligent systems."
    >
      <div className="skills-matrix">
        {/* Category Tabs */}
        <div className="skills-tabs" role="tablist" aria-label="Skills categories">
          <button
            type="button"
            className={`skills-tab ${activeTab === 'all' ? 'skills-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            All Areas ({skillGroups.reduce((acc, g) => acc + g.items.length, 0)})
          </button>
          {skillGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`skills-tab ${activeTab === group.id ? 'skills-tab--active' : ''}`}
              onClick={() => setActiveTab(group.id)}
              role="tab"
              aria-selected={activeTab === group.id}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        <div className="skills__grid">
          {filteredGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 70}>
              <div className="skill-card glass-panel">
                <header className="skill-card__head">
                  <div className="skill-card__indicator" />
                  <h3 className="skill-card__name">{group.name}</h3>
                  <span className="skill-card__count mono">{group.items.length} items</span>
                </header>

                {group.note && <p className="skill-card__note">{group.note}</p>}

                <ul className="skill-card__list" role="list">
                  {group.items.map((item) => {
                    const projectUsed = SKILL_PROJECT_MAP[item]
                    return (
                      <li key={item} className="skill-item" title={projectUsed ? `Applied in: ${projectUsed}` : undefined}>
                        <span className="skill-item__name">{item}</span>
                        {projectUsed && (
                          <span className="skill-item__badge" aria-label={`Applied in ${projectUsed}`}>
                            ★
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Highlight footer */}
        <div className="skills-matrix__footer">
          <p className="skills-matrix__footer-text">
            <span className="skills-matrix__star">★</span> Indicates technologies deployed in verified public GitHub repositories.
          </p>
        </div>
      </div>
    </SectionShell>
  )
}

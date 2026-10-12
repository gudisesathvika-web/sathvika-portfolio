import { Link } from './RouterLink'
import { ArrowUpRightIcon } from './icons'

interface CardDef {
  index: string
  to: string
  title: string
  blurb: string
}

const CARDS: CardDef[] = [
  {
    index: '01',
    to: '/projects',
    title: 'Projects',
    blurb: 'Verified work and case studies — SkillForge, AccessGuard, and more.',
  },
  {
    index: '02',
    to: '/resume',
    title: 'Resume',
    blurb: 'Preview or download the current resume as a PDF.',
  },
  {
    index: '03',
    to: '/experience',
    title: 'Experience',
    blurb: 'Roles, internships, education, and hands-on building.',
  },
  {
    index: '04',
    to: '/achievements',
    title: 'Achievements',
    blurb: 'Certifications, publications, and milestones worth keeping.',
  },
]

/** Four prominent navigation cards. */
export function HomeCards() {
  return (
    <section
      className="home-cards"
      id="explore"
      aria-labelledby="home-cards-title"
    >
      <div className="container">
        <header className="home-cards__head">
          <p className="kicker mono">Explore</p>
          <h2 className="home-cards__title" id="home-cards-title">
            Where to go next
          </h2>
          <p className="home-cards__lede">
            Four doors into the work — each one a real page, not a scroll.
          </p>
        </header>

        <ul className="home-cards__grid" role="list">
          {CARDS.map((card) => (
            <li key={card.to}>
              <Link className="home-card" to={card.to}>
                <span className="home-card__index mono" aria-hidden="true">
                  {card.index}
                </span>
                <span className="home-card__body">
                  <span className="home-card__title">{card.title}</span>
                  <span className="home-card__blurb">{card.blurb}</span>
                </span>
                <span className="home-card__arrow" aria-hidden="true">
                  <ArrowUpRightIcon size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

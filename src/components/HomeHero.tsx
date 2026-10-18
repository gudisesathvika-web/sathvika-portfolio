import { site } from '../data/content'
import { Link } from './RouterLink'
import { Portrait } from './Portrait'
import { ArrowRightIcon, DownloadIcon } from './icons'

/**
 * Homepage hero — identity, professional introduction and the approved
 * portrait. Dark navy, restrained accents, generous whitespace.
 */
export function HomeHero() {
  return (
    <section className="home-hero" id="top" aria-labelledby="home-hero-title">
      <div className="container home-hero__grid">
        <div className="home-hero__copy">
          <p className="home-hero__kicker mono">{site.name}</p>
          <h1 className="home-hero__title" id="home-hero-title">
            AI builder and software engineer.
          </h1>
          <p className="home-hero__role">{site.identity}</p>
          <p className="home-hero__intro">
            I design and ship practical intelligent systems — from AI-powered
            learning and accessibility platforms to full-stack products people
            can actually use.
          </p>

          <div className="home-hero__actions">
            <Link className="btn btn--primary home-hero__cta" to="/projects">
              View projects
              <ArrowRightIcon size={15} />
            </Link>
            <Link className="btn btn--ghost home-hero__cta" to="/resume">
              Resume
              <DownloadIcon size={15} />
            </Link>
          </div>

          <dl className="home-hero__facts">
            <div>
              <dt>Focus</dt>
              <dd>Applied AI &amp; intelligent systems</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{site.location}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Studying · open to opportunities</dd>
            </div>
          </dl>
        </div>

        <div className="home-hero__stage">
          <Portrait />
        </div>
      </div>
    </section>
  )
}

import { assets, site } from '../data/content'
import { Link } from './RouterLink'
import { Portrait } from './Portrait'
import { ArrowRightIcon, DownloadIcon } from './icons'

const resumeUrl = `${import.meta.env.BASE_URL}${assets.resume.path}`

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
            {site.headline.line1}
            <span className="home-hero__title-em">{site.headline.line2}</span>
          </h1>
          <p className="home-hero__role">{site.identity}</p>
          <p className="home-hero__intro">
            I build intelligent systems and full-stack products that turn messy
            problems into tools people can actually use. Currently an AI
            engineering student shipping real work — SkillForge and AccessGuard
            among it.
          </p>

          <div className="home-hero__actions">
            <Link className="btn btn--primary home-hero__cta" to="/projects">
              View projects
              <ArrowRightIcon size={15} />
            </Link>
            <a
              className="btn btn--ghost home-hero__cta"
              href={resumeUrl}
              download
            >
              <DownloadIcon size={15} />
              Download resume
            </a>
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

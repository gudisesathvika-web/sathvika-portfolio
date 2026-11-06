import { site } from '../data/content'
import { Link } from './RouterLink'
import { Portrait } from './Portrait'
import { ArrowRightIcon, DownloadIcon, GitHubIcon } from './icons'

/**
 * Modern Homepage Hero — status indicator, punchy typography, action buttons,
 * and high-tech portrait presentation.
 */
export function HomeHero() {
  return (
    <section className="home-hero" id="top" aria-labelledby="home-hero-title">
      <div className="container home-hero__grid">
        <div className="home-hero__copy">
          {/* Status Indicator */}
          <div className="home-hero__status">
            <span className="home-hero__status-dot" aria-hidden="true" />
            <span className="mono">Open to Remote &amp; Hybrid · Full-Time, Part-Time &amp; Freelance</span>
          </div>

          <h1 className="home-hero__title" id="home-hero-title">
            Engineering intelligence. <br />
            <span className="home-hero__title-accent">Building what matters.</span>
          </h1>

          <p className="home-hero__role">
            <span className="home-hero__chip">Applied AI &amp; Vision</span>
            <span className="home-hero__chip">Agentic Automations</span>
            <span className="home-hero__chip">Full-Stack Systems</span>
          </p>

          <p className="home-hero__intro">
            I am {site.name}, an AI engineering student who designs and ships practical intelligent systems —
            from multimodal deep learning and document forgery detection to autonomous B2B and grant intelligence pipelines.
          </p>

          <div className="home-hero__actions">
            <a className="btn btn--primary home-hero__cta" href="#featured-work">
              Explore Featured Work
              <ArrowRightIcon size={15} />
            </a>
            <Link className="btn btn--ghost home-hero__cta" to="/resume">
              Resume
              <DownloadIcon size={15} />
            </Link>
            <a
              className="btn btn--ghost home-hero__cta"
              href="https://github.com/Sathvikagudise"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <GitHubIcon size={15} />
              GitHub
            </a>
          </div>

          <dl className="home-hero__facts">
            <div>
              <dt>Focus</dt>
              <dd>Applied AI, Computer Vision &amp; Automations</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Remote &amp; Hybrid · Full-Time, Part-Time &amp; Freelance</dd>
            </div>
            <div>
              <dt>Clients &amp; Market</dt>
              <dd>India, US &amp; Global Teams</dd>
            </div>
            <div>
              <dt>Core Stack</dt>
              <dd>Python · PyTorch · FastAPI · LangChain · React</dd>
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

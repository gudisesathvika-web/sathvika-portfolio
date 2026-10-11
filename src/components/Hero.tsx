import { assets, site } from '../data/content'
import { Constellation } from './Constellation'
import { ResumeAction } from './ResumeAction'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons'
import './hero.css'

/**
 * Opening screen: identity, headline, subheading, actions, portrait and the
 * interactive AI constellation.
 */
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <Reveal className="hero__identity">
            <p className="kicker">{site.name}</p>
            <p className="hero__role">{site.identity}</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="hero__headline" id="hero-title">
              <span className="hero__headline-line">{site.headline.line1}</span>
              <em className="hero__headline-em">{site.headline.line2}</em>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="hero__sub">{site.subheading}</p>
          </Reveal>

          <Reveal delay={240} className="hero__actions">
            <ResumeAction variant="primary" />
            <a className="btn btn--ghost" href="#projects">
              Projects
              <ArrowRightIcon size={15} />
            </a>
          </Reveal>

          <Reveal delay={300}>
            <p className="hero__positioning">{site.positioning}</p>
            <ul className="hero__facts" aria-label="Quick facts">
              <li>
                <span className="hero__facts-key">Focus</span>
                <span className="hero__facts-val">
                  Applied AI &amp; intelligent systems
                </span>
              </li>
              <li>
                <span className="hero__facts-key">Building</span>
                <span className="hero__facts-val">SkillForge · AccessGuard</span>
              </li>
              <li>
                <span className="hero__facts-key">Status</span>
                <span className="hero__facts-val">
                  Studying · open to opportunities
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero__stage">
          <Constellation />
        </Reveal>
      </div>

      <a className="hero__scroll" href="#about">
        <span className="hero__scroll-line" aria-hidden="true" />
        Explore
      </a>

      <p className="sr-only">
        Place your portrait at <code>public/{assets.portrait.path}</code> and
        your resume PDF at <code>public/{assets.resume.path}</code> — until then
        designed placeholders are shown.
      </p>
    </section>
  )
}

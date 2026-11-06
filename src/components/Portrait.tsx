import { useState } from 'react'
import { assets, site } from '../data/content'
import './portrait.css'

const portraitUrl = `${import.meta.env.BASE_URL}${assets.portrait.path}`

/**
 * Modern Portrait stage with floating interactive badges.
 */
export function Portrait() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="portrait">
      <div className="portrait__stage">
        {/* Floating tech badge 1 */}
        <div className="portrait__badge portrait__badge--top">
          <span className="portrait__badge-icon">⚡</span>
          <span>Applied AI Systems</span>
        </div>

        <div className="portrait__frame">
          {/* Fallback placeholder */}
          <div className="portrait__placeholder" aria-hidden={failed ? undefined : true}>
            <svg viewBox="0 0 200 200" role="img" aria-label="Portrait placeholder">
              <title>Portrait pending</title>
              <defs>
                <pattern
                  id="hatch"
                  width="7"
                  height="7"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(35)"
                >
                  <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(135, 169, 107, 0.35)" strokeWidth="1" />
                </pattern>
                <radialGradient id="shade" cx="50%" cy="38%" r="70%">
                  <stop offset="0%" stopColor="rgba(213, 133, 31, 0.2)" />
                  <stop offset="100%" stopColor="rgba(20, 18, 14, 0)" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="96" fill="url(#shade)" />
              <circle cx="100" cy="100" r="96" fill="url(#hatch)" />
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(135, 169, 107, 0.6)" strokeWidth="1.5" />
              <text
                x="100"
                y="118"
                textAnchor="middle"
                fontFamily="Instrument Serif, Georgia, serif"
                fontSize="64"
                fill="rgba(247, 244, 238, 0.95)"
              >
                {site.initials}
              </text>
            </svg>
          </div>

          {!failed && (
            <img
              className="portrait__image"
              src={portraitUrl}
              alt={assets.portrait.alt}
              loading="eager"
              decoding="async"
              onError={() => setFailed(true)}
            />
          )}
        </div>

        {/* Floating tech badge 2 */}
        <div className="portrait__badge portrait__badge--bottom">
          <span className="portrait__badge-dot" />
          <span>Full-Stack &amp; Agents</span>
        </div>
      </div>

      <p className="portrait__caption">
        <span className="portrait__caption-dot" aria-hidden="true" />
        {failed ? `Portrait pending · public/${assets.portrait.path}` : `${site.name} · AI Engineer`}
      </p>
    </div>
  )
}

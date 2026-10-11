import { useState } from 'react'
import { assets, site } from '../data/content'
import './portrait.css'

const portraitUrl = `${import.meta.env.BASE_URL}${assets.portrait.path}`

/**
 * Portrait treatment for the hero's central constellation node.
 *
 * Real asset:  public/portrait/sathvika-sketch.png
 * Until it is supplied, an elegant crosshatch monogram placeholder renders.
 * An unrelated stock photo is never shown as if it were Sathvika.
 */
export function Portrait() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="portrait">
      <div className="portrait__frame">
        {/* Placeholder — always underneath, revealed if the image is missing */}
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
                <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(86,212,255,0.28)" strokeWidth="1" />
              </pattern>
              <radialGradient id="shade" cx="50%" cy="38%" r="70%">
                <stop offset="0%" stopColor="rgba(86,212,255,0.14)" />
                <stop offset="100%" stopColor="rgba(4,6,12,0)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#shade)" />
            <circle cx="100" cy="100" r="96" fill="url(#hatch)" />
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(86,212,255,0.5)" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(148,166,199,0.35)" strokeWidth="1" strokeDasharray="3 6" />
            <text
              x="100"
              y="118"
              textAnchor="middle"
              fontFamily="Instrument Serif, Georgia, serif"
              fontSize="64"
              fill="rgba(234,239,249,0.9)"
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
      <p className="portrait__caption">
        <span className="portrait__caption-dot" aria-hidden="true" />
        {failed
          ? `Portrait pending · public/${assets.portrait.path}`
          : 'Pencil sketch portrait'}
      </p>
    </div>
  )
}

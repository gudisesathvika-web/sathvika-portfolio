import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import '../styles/about.css' // shared section layout (about facts + factual note)
import '../styles/sections.css' // project / experience / skills / achievements / contact

interface SectionShellProps {
  id: string
  index: string
  kicker: string
  title: string
  lede?: string
  children: ReactNode
}

/** Shared scaffold for every content section: heading block + body slot. */
export function SectionShell({
  id,
  index,
  kicker,
  title,
  lede,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <Reveal className="section__head">
          <p className="kicker">
            <span aria-hidden="true">{index}</span> {kicker}
          </p>
          <h2 className="section__title" id={`${id}-title`}>
            {title}
          </h2>
          {lede && <p className="section__lede">{lede}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

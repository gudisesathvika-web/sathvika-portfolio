import { useId, useState } from 'react'
import {
  categories,
  edges,
  layouts,
  nodeById,
  nodes,
  type Category,
} from '../data/constellation'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Portrait } from './Portrait'
import { ArrowRightIcon } from './icons'
import './constellation.css'

const colorFor = (category: Category) =>
  categories.find((entry) => entry.id === category)?.color ?? 'var(--accent)'

const labelFor = (category: Category) =>
  categories.find((entry) => entry.id === category)?.label ?? ''

/**
 * Interactive AI constellation — a map of identity, current work, projects,
 * skills and achievements rendered as a node graph.
 *
 * - Pointer: hover highlights, click selects and reveals details.
 * - Keyboard: every node is tabbable; Enter/Space selects, Escape clears.
 * - Touch: compact layout with 44px+ tap targets below 860px.
 * - Reduced motion: decorative animation is disabled by CSS.
 * - No-JS / non-interactive users: the hero copy and every section below
 *   still communicate the same content, plus an sr-only node index.
 */
export function Constellation() {
  const gradientId = useId()
  const isCompact = useMediaQuery('(max-width: 860px)')
  const layout = isCompact ? layouts.mobile : layouts.desktop
  const variant = isCompact ? 'mobile' : 'desktop'
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = activeId ? nodeById.get(activeId) : undefined
  const positionOf = (id: string) => {
    const node = nodeById.get(id)
    return node ? node[variant] : undefined
  }

  const toggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id))
  }

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(id)
    }
    if (event.key === 'Escape') {
      setActiveId(null)
    }
  }

  const center = positionOf('me')

  return (
    <div className="constellation">
      <div
        className="constellation__stage"
        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
      >
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="constellation__svg"
          role="group"
          aria-label="AI constellation: interactive map of identity, current work, projects, skills and achievements"
        >
          <defs>
            <linearGradient id={`${gradientId}-edge`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(86,212,255,0.55)" />
              <stop offset="100%" stopColor="rgba(77,139,255,0.25)" />
            </linearGradient>
            <radialGradient id={`${gradientId}-halo`}>
              <stop offset="0%" stopColor="rgba(86,212,255,0.22)" />
              <stop offset="100%" stopColor="rgba(86,212,255,0)" />
            </radialGradient>
          </defs>

          {/* Ambient field */}
          <g className="constellation__ambient" aria-hidden="true">
            <circle cx={center?.x} cy={center?.y} r={layout.width * 0.42} fill={`url(#${gradientId}-halo)`} />
            {Array.from({ length: 26 }, (_, index) => {
              const angle = (index * 137.5 * Math.PI) / 180
              const radius = layout.width * 0.16 + ((index * 53) % (layout.width * 0.34))
              return (
                <circle
                  key={index}
                  cx={(center?.x ?? 0) + Math.cos(angle) * radius}
                  cy={(center?.y ?? 0) + Math.sin(angle) * radius * 0.86}
                  r={index % 3 === 0 ? 1.6 : 1}
                  className="constellation__star"
                  style={{ animationDelay: `${(index % 7) * 0.7}s` }}
                />
              )
            })}
          </g>

          {/* Edges */}
          <g className="constellation__edges" aria-hidden="true">
            {edges.map(({ from, to }) => {
              const start = positionOf(from)
              const end = positionOf(to)
              if (!start || !end) return null
              const lit =
                activeId !== null && (activeId === from || activeId === to)
              return (
                <line
                  key={`${from}-${to}`}
                  className={`constellation__edge${lit ? ' is-lit' : ''}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={`url(#${gradientId}-edge)`}
                />
              )
            })}
          </g>

          {/* Center ring (portrait sits on top as HTML) */}
          <g aria-hidden="true" className="constellation__center">
            <circle
              cx={center?.x}
              cy={center?.y}
              r={isCompact ? 52 : 66}
              className="constellation__center-ring"
            />
            <circle
              cx={center?.x}
              cy={center?.y}
              r={isCompact ? 60 : 78}
              className="constellation__center-orbit"
            />
          </g>

          {/* Nodes */}
          <g className="constellation__nodes">
            {nodes
              .filter((node) => !node.isCenter)
              .map((node) => {
                const point = node[variant]
                const isActive = activeId === node.id
                const color = colorFor(node.category)
                return (
                  <g
                    key={node.id}
                    className={`constellation__node${isActive ? ' is-active' : ''}`}
                    style={{ ['--node-color' as string]: color }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={`${node.title} — ${labelFor(node.category)} node`}
                    transform={`translate(${point.x} ${point.y})`}
                    onClick={() => toggle(node.id)}
                    onKeyDown={(event) => handleKeyDown(event, node.id)}
                  >
                    <circle className="constellation__hit" r={isCompact ? 26 : 24} />
                    <circle className="constellation__pulse" r={14} />
                    <circle className="constellation__node-ring" r={11} />
                    <circle className="constellation__node-core" r={5} />
                    <text className="constellation__node-label" y={26}>
                      {node.label}
                    </text>
                  </g>
                )
              })}
          </g>
        </svg>

        {/* Center node: portrait (also a selectable button) */}
        <button
          type="button"
          className={`constellation__center-node${activeId === 'me' ? ' is-active' : ''}`}
          style={{
            left: `${((center?.x ?? 0) / layout.width) * 100}%`,
            top: `${((center?.y ?? 0) / layout.height) * 100}%`,
            width: `${((isCompact ? 88 : 108) / layout.width) * 100}%`,
          }}
          aria-pressed={activeId === 'me'}
          aria-label="Sathvika Gudise — identity node"
          onClick={() => toggle('me')}
          onKeyDown={(event) => handleKeyDown(event, 'me')}
        >
          <span className="constellation__portrait">
            <Portrait />
          </span>
        </button>
      </div>

      {/* Legend */}
      <ul className="constellation__legend" aria-label="Node categories">
        {categories.map((category) => (
          <li key={category.id} style={{ ['--dot' as string]: category.color }}>
            <span className="constellation__legend-dot" aria-hidden="true" />
            {category.label}
          </li>
        ))}
      </ul>

      {/* Detail panel */}
      <div className="constellation__panel" aria-live="polite">
        {active ? (
          <div className="constellation__panel-inner">
            <div className="constellation__panel-head">
              <span
                className="constellation__panel-chip"
                style={{ ['--chip' as string]: colorFor(active.category) }}
              >
                {labelFor(active.category)}
              </span>
              <button
                type="button"
                className="constellation__panel-close"
                onClick={() => setActiveId(null)}
                aria-label="Clear selection"
              >
                Clear
              </button>
            </div>
            <h3 className="constellation__panel-title">{active.title}</h3>
            <p className="constellation__panel-detail">{active.detail}</p>
            {active.href && (
              <a className="constellation__panel-link" href={active.href}>
                {active.hrefLabel}
                <ArrowRightIcon size={13} />
              </a>
            )}
          </div>
        ) : (
          <div className="constellation__panel-inner">
            <p className="constellation__panel-hint">
              <strong>Systems map.</strong> Select a node — tap, click, or focus
              one and press Enter — to see how identity, current work, projects,
              skills and achievements connect.
            </p>
          </div>
        )}
      </div>

      {/* Text alternative for screen readers and non-interactive contexts */}
      <div className="sr-only">
        <h3>Constellation contents in text</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.label}:{' '}
              <ul>
                {nodes
                  .filter((node) => node.category === category.id)
                  .map((node) => (
                    <li key={node.id}>
                      {node.title} — {node.detail}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

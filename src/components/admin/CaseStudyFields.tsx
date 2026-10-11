export interface LinkItem {
  label: string
  url: string
}

export interface CaseStudyValues {
  problem: string[]
  users: string
  solution: string[]
  my_contribution: string[]
  stack_detail: string[]
  architecture: string[]
  challenges: string[]
  outcomes: string[]
  links: LinkItem[]
}

export type CaseStudyField =
  | 'problem'
  | 'users'
  | 'solution'
  | 'my_contribution'
  | 'stack_detail'
  | 'architecture'
  | 'challenges'
  | 'outcomes'
  | 'links'

const SECTIONS: { key: CaseStudyField; label: string; placeholder: string }[] = [
  { key: 'problem', label: 'Problem', placeholder: 'The problem this project addresses' },
  { key: 'solution', label: 'Solution', placeholder: 'What was built and how it works' },
  { key: 'my_contribution', label: 'My contribution', placeholder: 'What I personally did' },
  { key: 'stack_detail', label: 'Stack details', placeholder: 'Specific technologies and services' },
  { key: 'architecture', label: 'Architecture & data flow', placeholder: 'How the system is organized' },
  { key: 'challenges', label: 'Challenges & lessons', placeholder: 'Trade-offs, lessons, or decisions' },
  { key: 'outcomes', label: 'Verified outcomes', placeholder: 'Measured results — only when verified' },
]

interface CaseStudyFieldsProps {
  values: CaseStudyValues
  onChange: (field: CaseStudyField, value: string | string[] | LinkItem[]) => void
}

/** Structured case-study editor: list sections stay arrays, links stay {label,url}. */
export function CaseStudyFields({ values, onChange }: CaseStudyFieldsProps) {
  return (
    <>
      {SECTIONS.map(({ key, label, placeholder }) => (
        <StringListSection
          key={key}
          label={label}
          placeholder={placeholder}
          values={values[key] as string[]}
          onChange={(next) => onChange(key, next)}
        />
      ))}

      <label className="admin__field">
        <span>Target users</span>
        <textarea
          name="users"
          rows={3}
          value={values.users}
          placeholder="Who this project is for"
          onChange={(event) => onChange('users', event.target.value)}
        />
      </label>

      <LinksEditor links={values.links} onChange={(next) => onChange('links', next)} />
    </>
  )
}

function StringListSection({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string
  placeholder: string
  values: string[]
  onChange: (next: string[]) => void
}) {
  const items = values.length === 0 ? [''] : values
  return (
    <fieldset className="admin__fieldset">
      <legend className="admin__fieldset-label">{label}</legend>
      <div className="admin__list">
        {items.map((item, index) => (
          <div className="admin__list-row" key={index}>
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              aria-label={`${label} entry ${index + 1}`}
              onChange={(event) => {
                const next = [...items]
                next[index] = event.target.value
                onChange(next)
              }}
            />
            <button
              type="button"
              className="btn btn--ghost admin__list-remove"
              aria-label={`Remove ${label} entry ${index + 1}`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--ghost admin__list-add" onClick={() => onChange([...values, ''])}>
        + Add {label.toLowerCase()}
      </button>
    </fieldset>
  )
}

function LinksEditor({ links, onChange }: { links: LinkItem[]; onChange: (next: LinkItem[]) => void }) {
  const rows = links.length === 0 ? [{ label: '', url: '' }] : links
  return (
    <fieldset className="admin__fieldset">
      <legend className="admin__fieldset-label">Project links</legend>
      <div className="admin__list">
        {rows.map((link, index) => (
          <div className="admin__list-row admin__list-row--links" key={index}>
            <input
              type="text"
              value={link.label}
              placeholder="Link label (e.g. Repository)"
              aria-label={`Link ${index + 1} label`}
              onChange={(event) => {
                const next = [...links]
                const current = next[index] ?? { label: '', url: '' }
                next[index] = { ...current, label: event.target.value }
                onChange(next)
              }}
            />
            <input
              type="text"
              value={link.url}
              placeholder="https://…"
              aria-label={`Link ${index + 1} URL`}
              onChange={(event) => {
                const next = [...links]
                const current = next[index] ?? { label: '', url: '' }
                next[index] = { ...current, url: event.target.value }
                onChange(next)
              }}
            />
            <button
              type="button"
              className="btn btn--ghost admin__list-remove"
              aria-label={`Remove link ${index + 1}`}
              onClick={() => onChange(links.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--ghost admin__list-add" onClick={() => onChange([...links, { label: '', url: '' }])}>
        + Add link
      </button>
    </fieldset>
  )
}
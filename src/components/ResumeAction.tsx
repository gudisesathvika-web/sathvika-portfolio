import { useState } from 'react'
import { assets } from '../data/content'
import { useAssetStatus, type AssetStatus } from '../hooks/useAssetStatus'
import { DownloadIcon } from './icons'

const resumeUrl = `${import.meta.env.BASE_URL}${assets.resume.path}`

const statusLabel: Record<AssetStatus, string> = {
  checking: 'Checking resume…',
  available: 'Download resume',
  missing: 'Resume',
}

interface ResumeActionProps {
  variant?: 'primary' | 'ghost'
  /** Compact label used in the navigation bar. */
  compact?: boolean
  className?: string
}

/**
 * Resume download control with graceful failure.
 * It probes for the real PDF first — if the file is absent, clicking explains
 * exactly where to put it instead of leading to a 404.
 */
export function ResumeAction({
  variant = 'primary',
  compact = false,
  className = '',
}: ResumeActionProps) {
  const status = useAssetStatus(resumeUrl)
  const [noteOpen, setNoteOpen] = useState(false)

  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')

  if (status === 'available') {
    return (
      <div className="resume-action">
        <a
          className={classes}
          href={resumeUrl}
          download
          data-resume-status="available"
        >
          <DownloadIcon size={15} />
          {compact ? 'Resume' : statusLabel.available}
        </a>
      </div>
    )
  }

  return (
    <div className="resume-action">
      <button
        type="button"
        className={classes}
        aria-disabled="true"
        aria-expanded={noteOpen}
        onClick={() => setNoteOpen((open) => !open)}
      >
        <DownloadIcon size={15} />
        {compact ? 'Resume' : statusLabel[status]}
      </button>
      {noteOpen && (
        <p className="resume-action__note" id="resume-note" role="status">
          {status === 'checking'
            ? 'Checking whether the resume file exists…'
            : 'The PDF has not been added yet. Drop your file at '}
          {status === 'missing' && <code>public/{assets.resume.path}</code>}
          {status === 'missing' && ' and this button starts downloading it.'}
        </p>
      )}
    </div>
  )
}

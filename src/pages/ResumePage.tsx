import { assets } from '../data/content'
import { Link } from '../components/RouterLink'
import { DownloadIcon, ArrowUpRightIcon, ArrowRightIcon } from '../components/icons'

const resumeUrl = `${import.meta.env.BASE_URL}${assets.resume.path}`

/** Dedicated resume page: in-page PDF preview plus open/download actions. */
export function ResumePage() {
  return (
    <div className="page page--resume">
      <div className="container">
        <p className="page__crumbs">
          <Link to="/">← Home</Link>
          <span aria-hidden="true">/</span>
          <span>Resume</span>
        </p>

        <header className="page__head">
          <p className="kicker mono">Resume</p>
          <h1 className="page__title">Resume</h1>
          <p className="page__lede">
            Preview the current resume below, open it in a new tab, or download
            the PDF.
          </p>
          <div className="page__actions">
            <a
              className="btn btn--primary"
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowUpRightIcon size={15} />
              Preview resume
            </a>
            <a className="btn btn--ghost" href={resumeUrl} download>
              <DownloadIcon size={15} />
              Download PDF
            </a>
          </div>
        </header>

        <div className="resume-preview">
          <object
            className="resume-preview__frame"
            data={resumeUrl}
            type="application/pdf"
            aria-label="Resume PDF preview"
          >
            <p className="resume-preview__fallback">
              Inline preview is not available in this browser.{' '}
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Open the resume PDF
                <ArrowRightIcon size={13} />
              </a>
              .
            </p>
          </object>
        </div>
      </div>
    </div>
  )
}

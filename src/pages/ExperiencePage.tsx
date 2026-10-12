import { Experience } from '../sections/Experience'
import { Link } from '../components/RouterLink'

/** Dedicated /experience destination. */
export function ExperiencePage() {
  return (
    <div className="page">
      <div className="container page__crumbs-wrap">
        <p className="page__crumbs">
          <Link to="/">← Home</Link>
          <span aria-hidden="true">/</span>
          <span>Experience</span>
        </p>
      </div>
      <Experience />
    </div>
  )
}

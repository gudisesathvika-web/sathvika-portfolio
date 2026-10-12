import { Projects } from '../sections/Projects'
import { Link } from '../components/RouterLink'

/** Dedicated /projects destination — search and case studies preserved. */
export function ProjectsPage() {
  return (
    <div className="page">
      <div className="container page__crumbs-wrap">
        <p className="page__crumbs">
          <Link to="/">← Home</Link>
          <span aria-hidden="true">/</span>
          <span>Projects</span>
        </p>
      </div>
      <Projects />
    </div>
  )
}

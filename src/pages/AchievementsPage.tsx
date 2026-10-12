import { Achievements } from '../sections/Achievements'
import { Link } from '../components/RouterLink'

/** Dedicated /achievements destination. */
export function AchievementsPage() {
  return (
    <div className="page">
      <div className="container page__crumbs-wrap">
        <p className="page__crumbs">
          <Link to="/">← Home</Link>
          <span aria-hidden="true">/</span>
          <span>Achievements</span>
        </p>
      </div>
      <Achievements />
    </div>
  )
}

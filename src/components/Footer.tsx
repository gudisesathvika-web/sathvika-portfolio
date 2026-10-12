import { footer, site } from '../data/content'
import { Link } from './RouterLink'
import './footer.css'

const FOOTER_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Resume', to: '/resume' },
  { label: 'Experience', to: '/experience' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Contact', to: '/', anchor: 'contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__name">{site.name}</p>
          <p className="footer__tagline">{footer.tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {FOOTER_NAV.map((link) => (
              <li key={link.label}>
                <Link to={link.to} anchor={link.anchor}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__meta">
          <p className="mono">{footer.builtWith}</p>
          <p className="mono">
            © {year} {site.name}
          </p>
          <a className="footer__top" href="#top">
            Back to top ↑
          </a>
          <a className="footer__top" href="#/admin">
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}

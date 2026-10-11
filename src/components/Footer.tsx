import { footer, navLinks, site } from '../data/content'
import './footer.css'

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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
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

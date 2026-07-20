// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isHome = location.pathname === '/'

  const links = isHome
    ? [
        { href: '#about', label: 'About' },
        { href: '#projects', label: 'Projects' },
        { href: '#skills', label: 'Skills' },
        { href: '#contact', label: 'Contact' },
      ]
    : [{ href: '/', label: '← Back', isRoute: true }]

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>MG</span>
          <span className={styles.logoText}>Methul<span className={styles.accent}>.</span></span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {links.map((l) =>
            l.isRoute ? (
              <Link key={l.href} to={l.href} className={styles.link} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className={styles.link} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            )
          )}
        </nav>

        <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
        </button>
      </div>
    </header>
  )
}
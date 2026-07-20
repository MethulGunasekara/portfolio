// src/components/sections/HeroSection.jsx
import { useEffect, useRef } from 'react'
import styles from './HeroSection.module.css'

export default function HeroSection({ profile }) {
  const glitchRef = useRef(null)

  useEffect(() => {
    const el = glitchRef.current
    if (!el) return
    const interval = setInterval(() => {
      el.setAttribute('data-glitch', el.textContent)
    }, 3000)
    return () => clearInterval(interval)
  }, [profile])

  const name = profile?.fullName || 'Methul Gunasekara'
  const title = profile?.jobTitle || 'Business Analyst & Full-Stack Developer'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <section className={styles.hero}>
      {/* Ambient background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.grid} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.pulse} />
            Available for opportunities
          </div>

          <h1 className={styles.heading}>
            <span className={styles.hi}>Hi, I'm</span>
            <br />
            <span
              className={styles.glitch}
              ref={glitchRef}
              data-glitch={name}
            >
              {name}
            </span>
          </h1>

          <p className={styles.title}>{title}</p>

          <p className={styles.bio}>
            {profile?.bio || 'Turning complex business problems into elegant digital solutions. I bridge the gap between strategy and technology.'}
          </p>

          <div className={styles.actions}>
            <a href="#projects" className={styles.btnPrimary}>
              View Projects <i className="ri-arrow-right-line" />
            </a>
            <a href="#contact" className={styles.btnGhost}>
              Get in Touch
            </a>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className={styles.btnIcon} title="Resume">
                <i className="ri-file-text-line" />
              </a>
            )}
          </div>

          <div className={styles.socials}>
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className={styles.social}>
                <i className="ri-github-fill" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className={styles.social}>
                <i className="ri-linkedin-fill" />
              </a>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.avatarRing}>
            <div className={styles.avatarInner}>
              {profile?.heroImageUrl ? (
                <img src={profile.heroImageUrl} alt={name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>{initials}</div>
              )}
            </div>
          </div>
          <div className={styles.floatCard1}>
            <i className="ri-bar-chart-2-line" />
            <span>Business Analysis</span>
          </div>
          <div className={styles.floatCard2}>
            <i className="ri-code-s-slash-line" />
            <span>Full-Stack Dev</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  )
}
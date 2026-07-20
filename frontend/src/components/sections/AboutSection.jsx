// src/components/sections/AboutSection.jsx
import styles from './AboutSection.module.css'

export default function AboutSection({ profile }) {
  const highlights = [
    { icon: 'ri-bar-chart-box-line', label: 'Business Analysis', desc: 'Requirements, process flows, stakeholder comms' },
    { icon: 'ri-layout-4-line', label: 'Product Thinking', desc: 'Roadmaps, user stories, sprint planning' },
    { icon: 'ri-code-s-slash-line', label: 'Full-Stack Dev', desc: 'MERN stack, REST APIs, responsive UIs' },
    { icon: 'ri-database-2-line', label: 'Data & Systems', desc: 'MongoDB, system design, ERDs' },
  ]

  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.label}>About</span>
          <div className={styles.labelLine} />
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 className={styles.heading}>
              Where business logic meets<br />
              <span className={styles.accent}>clean code</span>
            </h2>
            <p className={styles.body}>
              {profile?.bio ||
                `I'm a final-year IT undergraduate at SLIIT with a commerce background — which means I think about systems in terms of both technical architecture and business value. I pursue two tracks in parallel: Business Analysis / Product Management and Full-Stack Development with the MERN stack.`}
            </p>
            <p className={styles.body} style={{ marginTop: 16 }}>
              My approach: understand the problem deeply before writing a single line of code, then build something that solves it elegantly.
            </p>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className={styles.resumeBtn}>
                <i className="ri-download-line" /> Download Resume
              </a>
            )}
          </div>

          <div className={styles.right}>
            {highlights.map(h => (
              <div key={h.label} className={styles.card}>
                <div className={styles.cardIcon}>
                  <i className={h.icon} />
                </div>
                <div>
                  <div className={styles.cardLabel}>{h.label}</div>
                  <div className={styles.cardDesc}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
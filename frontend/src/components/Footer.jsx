// src/components/Footer.jsx
import styles from './Footer.module.css'

export default function Footer({ profile }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          © {new Date().getFullYear()} {profile?.fullName || 'Methul Gunasekara'}. Built with purpose.
        </span>
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
    </footer>
  )
}
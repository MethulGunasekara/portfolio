// src/components/admin/SectionHeader.jsx
import styles from './SectionHeader.module.css'

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
import styles from './Loader.module.css'

export default function Loader({ progress }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.logo}>MG</div>
        <p className={styles.name}>Methul Gunasekara</p>
        <p className={styles.role}>Business Analyst · Full-Stack Developer</p>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: progress + '%' }} />
        </div>
        <p className={styles.percent}>{progress}%</p>
      </div>
    </div>
  )
}
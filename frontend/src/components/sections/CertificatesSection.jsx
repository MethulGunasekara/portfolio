import styles from './CertificatesSection.module.css'

export default function CertificatesSection({ certificates }) {
  if (!certificates || certificates.length === 0) return null

  return (
    <section id="certificates" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Certificates</span>
          <div className={styles.labelLine} />
        </div>
        <h2 className={styles.heading}>Credentials</h2>
        <div className={styles.scrollWrapper}>
          <div className={styles.track}>
            {certificates.map(cert => (
              <a    
                key={cert._id}
                href={cert.credentialUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className={styles.card}
                title={cert.credentialUrl ? 'Verify on ' + cert.issuer : cert.title}
              >
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.title} className={styles.cardImg} />
                ) : (
                  <div className={styles.cardImgPlaceholder}>
                    <i className="ri-award-line" />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <p className={styles.cardTitle}>{cert.title}</p>
                  <p className={styles.cardIssuer}>{cert.issuer}</p>
                  {cert.issueDate && <p className={styles.cardDate}>{cert.issueDate}</p>}
                  {cert.credentialUrl && (
                    <span className={styles.verifyBadge}>Verify</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
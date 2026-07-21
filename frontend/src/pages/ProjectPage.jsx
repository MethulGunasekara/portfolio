// src/pages/ProjectPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import styles from './ProjectPage.module.css'

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [previewTab, setPreviewTab] = useState(null)

  useEffect(() => {
    api.get('/projects/' + id)
      .then(r => {
        const p = r.data
        setProject(p)
        if (p.liveLink) setPreviewTab('preview')
        else if (p.videoUrl) setPreviewTab('video')
        else if (p.previewImages && p.previewImages.length > 0) setPreviewTab('image')
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  )

  if (!project) return null

  const allImages = project.previewImages || []

  const availableTabs = [
    project.liveLink ? { key: 'preview', label: 'Live Site' } : null,
    project.videoUrl ? { key: 'video', label: 'Demo Video' } : null,
    allImages.length > 0 ? { key: 'image', label: 'Screenshots (' + allImages.length + ')' } : null,
  ].filter(Boolean)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <button className={styles.back} onClick={() => navigate(-1)}>Back</button>

          <div className={styles.heroMeta}>
            {(project.technologies || []).map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
            {project.category && <span className={styles.catBadge}>{project.category}</span>}
          </div>

          <h1 className={styles.title}>{project.title}</h1>

          {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}

          <div className={styles.heroActions}>
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                View Live
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className={styles.btnGhost}>
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>

        {availableTabs.length > 0 && (
          <section className={styles.previewSection}>
            {availableTabs.length > 1 && (
              <div className={styles.tabs}>
                {availableTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={previewTab === tab.key ? styles.tabActive : styles.tab}
                    onClick={() => setPreviewTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.previewBox}>
              {previewTab === 'preview' && project.liveLink && (
                <iframe src={project.liveLink} title={project.title} className={styles.iframe} sandbox="allow-scripts allow-same-origin allow-forms" />
              )}
              {previewTab === 'video' && project.videoUrl && (
                <video src={project.videoUrl} controls className={styles.video} />
              )}
              {previewTab === 'image' && allImages.length > 0 && (
                allImages.length === 1 ? (
                  <img src={allImages[0]} alt={project.title} className={styles.previewImg} />
                ) : (
                  <div className={styles.galleryGrid}>
                    {allImages.map((url, i) => (
                      <img key={i} src={url} alt={'Screenshot ' + (i + 1)} className={styles.galleryImg} onClick={() => window.open(url, '_blank')} />
                    ))}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        <div className={styles.twoCol}>
          <div className={styles.mainContent}>

            {project.description && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Overview</h2>
                <p className={styles.desc}>{project.description}</p>
              </section>
            )}

            {project.problemStatement && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Problem Statement</h2>
                <p className={styles.desc}>{project.problemStatement}</p>
              </section>
            )}

            {project.solution && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Solution Approach</h2>
                <p className={styles.desc}>{project.solution}</p>
              </section>
            )}

            {project.outcomes && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Outcomes and Impact</h2>
                <p className={styles.desc}>{project.outcomes}</p>
              </section>
            )}

            {project.documentation && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Documentation</h2>
                <div className={styles.docBox}>
                  <pre className={styles.docContent}>{project.documentation}</pre>
                </div>
              </section>
            )}

          </div>

          <aside className={styles.sidebar}>

            {project.technologies && project.technologies.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Tech Stack</h3>
                <div className={styles.techList}>
                  {project.technologies.map(t => (
                    <span key={t} className={styles.techPill}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Key Features</h3>
                <ul className={styles.featureList}>
                  {project.keyFeatures.map((f, i) => (
                    <li key={i} className={styles.featureItem}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.myRole && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>My Role</h3>
                <p className={styles.sideBody}>{project.myRole}</p>
              </div>
            )}

            {project.teamSize && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Team Size</h3>
                <p className={styles.sideBody}>{project.teamSize}</p>
              </div>
            )}

            {project.duration && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Duration</h3>
                <p className={styles.sideBody}>{project.duration}</p>
              </div>
            )}

            {project.methodology && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Methodology</h3>
                <p className={styles.sideBody}>{project.methodology}</p>
              </div>
            )}

            {project.documentationUrl && (
              <a href={project.documentationUrl} target="_blank" rel="noreferrer" className={styles.docLink}>
                Full Documentation
              </a>
            )}

          </aside>
        </div>
      </div>
    </div>
  )
}
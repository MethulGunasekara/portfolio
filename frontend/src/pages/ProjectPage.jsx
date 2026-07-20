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
  const [previewTab, setPreviewTab] = useState('preview') // 'preview' | 'video' | 'image'

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(r => {
        setProject(r.data)
        // Auto-select available preview type
        if (r.data.liveLink) setPreviewTab('preview')
        else if (r.data.videoUrl) setPreviewTab('video')
        else if (r.data.previewImageUrl) setPreviewTab('image')
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

  const hasPreview = project.liveLink || project.videoUrl || project.previewImageUrl

  const availableTabs = [
    project.liveLink && { key: 'preview', icon: 'ri-global-line', label: 'Live Site' },
    project.videoUrl && { key: 'video', icon: 'ri-video-line', label: 'Demo Video' },
    project.previewImageUrl && { key: 'image', icon: 'ri-image-line', label: 'Screenshots' },
  ].filter(Boolean)

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <button className={styles.back} onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line" /> Back
          </button>

          <div className={styles.heroMeta}>
            <div className={styles.tags}>
              {project.technologies?.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
            {project.category && <span className={styles.catBadge}>{project.category}</span>}
          </div>

          <h1 className={styles.title}>{project.title}</h1>

          {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}

          <div className={styles.heroActions}>
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                <i className="ri-external-link-line" /> View Live
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className={styles.btnGhost}>
                <i className="ri-github-line" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Preview Panel */}
        {hasPreview && (
          <section className={styles.previewSection}>
            {availableTabs.length > 1 && (
              <div className={styles.tabs}>
                {availableTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`${styles.tab} ${previewTab === tab.key ? styles.tabActive : ''}`}
                    onClick={() => setPreviewTab(tab.key)}
                  >
                    <i className={tab.icon} /> {tab.label}
                  </button>
                ))}
              </div>
            )}

            <div className={styles.previewBox}>
              {previewTab === 'preview' && project.liveLink && (
                <iframe
                  src={project.liveLink}
                  title={`${project.title} live preview`}
                  className={styles.iframe}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              )}
              {previewTab === 'video' && project.videoUrl && (
                <video
                  src={project.videoUrl}
                  controls
                  className={styles.video}
                  poster={project.previewImageUrl}
                />
              )}
              {previewTab === 'image' && project.previewImageUrl && (
                <img
                  src={project.previewImageUrl}
                  alt={project.title}
                  className={styles.previewImg}
                />
              )}
            </div>
          </section>
        )}

        <div className={styles.twoCol}>
          {/* Left: Description + Documentation */}
          <div className={styles.mainContent}>
            <section className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>
                <i className="ri-information-line" /> Overview
              </h2>
              <p className={styles.desc}>{project.description}</p>
            </section>

            {project.problemStatement && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>
                  <i className="ri-bug-line" /> Problem Statement
                </h2>
                <p className={styles.desc}>{project.problemStatement}</p>
              </section>
            )}

            {project.solution && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>
                  <i className="ri-lightbulb-line" /> Solution Approach
                </h2>
                <p className={styles.desc}>{project.solution}</p>
              </section>
            )}

            {project.documentation && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>
                  <i className="ri-file-text-line" /> Documentation
                </h2>
                <div className={styles.docBox}>
                  <pre className={styles.docContent}>{project.documentation}</pre>
                </div>
              </section>
            )}

            {project.outcomes && (
              <section className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>
                  <i className="ri-trophy-line" /> Outcomes & Impact
                </h2>
                <p className={styles.desc}>{project.outcomes}</p>
              </section>
            )}
          </div>

          {/* Right: Sidebar details */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Tech Stack</h3>
              <div className={styles.techList}>
                {project.technologies?.map(t => (
                  <span key={t} className={styles.techPill}>{t}</span>
                ))}
              </div>
            </div>

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

            {project.keyFeatures?.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Key Features</h3>
                <ul className={styles.featureList}>
                  {project.keyFeatures.map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <i className="ri-check-line" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.documentationUrl && (
              <a href={project.documentationUrl} target="_blank" rel="noreferrer" className={styles.docLink}>
                <i className="ri-file-pdf-line" /> Full Documentation
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
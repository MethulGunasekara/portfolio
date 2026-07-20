// src/components/sections/ProjectsSection.jsx
import { useNavigate } from 'react-router-dom'
import styles from './ProjectsSection.module.css'

export default function ProjectsSection({ projects }) {
  const navigate = useNavigate()

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Projects</span>
          <div className={styles.labelLine} />
        </div>

        <div className={styles.header}>
          <h2 className={styles.heading}>Things I've built</h2>
          <p className={styles.sub}>Real-world systems with real business value behind each decision.</p>
        </div>

        {projects.length === 0 ? (
          <div className={styles.empty}>
            <i className="ri-folder-open-line" />
            <p>No projects yet</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} onClick={() => navigate(`/project/${p._id}`)} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, index, onClick }) {
  return (
    <article className={styles.card} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className={styles.cardTop}>
        <span className={styles.index}>0{index + 1}</span>
        <div className={styles.cardLinks}>
          {project.liveLink && (
            <span className={styles.chip} onClick={e => { e.stopPropagation(); window.open(project.liveLink, '_blank') }}>
              <i className="ri-external-link-line" /> Live
            </span>
          )}
          {project.githubLink && (
            <span className={styles.chip} onClick={e => { e.stopPropagation(); window.open(project.githubLink, '_blank') }}>
              <i className="ri-github-line" />
            </span>
          )}
        </div>
      </div>

      <h3 className={styles.cardTitle}>{project.title}</h3>
      <p className={styles.cardDesc}>
        {project.shortDescription || project.description?.slice(0, 120) + '…'}
      </p>

      <div className={styles.tags}>
        {project.technologies?.slice(0, 4).map(t => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
        {project.technologies?.length > 4 && (
          <span className={styles.tagMore}>+{project.technologies.length - 4}</span>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.viewDetail}>View case study <i className="ri-arrow-right-line" /></span>
      </div>
    </article>
  )
}
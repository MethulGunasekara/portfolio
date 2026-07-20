// src/components/sections/SkillsSection.jsx
import styles from './SkillsSection.module.css'

export default function SkillsSection({ skills }) {
  const categories = ['Frontend', 'Backend', 'Tools', 'Design']

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {})

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Skills</span>
          <div className={styles.labelLine} />
        </div>

        <h2 className={styles.heading}>My toolkit</h2>

        <div className={styles.categories}>
          {categories.map(cat => {
            const catSkills = grouped[cat]
            if (!catSkills?.length) return null
            return (
              <div key={cat} className={styles.category}>
                <div className={styles.catHeader}>
                  <span className={styles.catName}>{cat}</span>
                  <span className={styles.catCount}>{catSkills.length} skills</span>
                </div>
                <div className={styles.skillList}>
                  {catSkills.map(skill => (
                    <div key={skill._id} className={styles.skill}>
                      <div className={styles.skillTop}>
                        {skill.iconClass && <i className={`${skill.iconClass} ${styles.skillIcon}`} />}
                        <span className={styles.skillName}>{skill.name}</span>
                        {skill.proficiency && <span className={styles.skillPct}>{skill.proficiency}%</span>}
                      </div>
                      {skill.proficiency && (
                        <div className={styles.bar}>
                          <div className={styles.barFill} style={{ width: `${skill.proficiency}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
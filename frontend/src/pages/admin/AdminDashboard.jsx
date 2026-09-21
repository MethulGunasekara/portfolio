import ProfileEditor from '../../components/admin/ProfileEditor'
import ProjectManager from '../../components/admin/ProjectManager'
import SkillManager from '../../components/admin/SkillManager'
import MessageInbox from '../../components/admin/MessageInbox'
import AppearanceEditor from '../../components/admin/AppearanceEditor'
import CertificateManager from '../../components/admin/CertificateManager'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Portfolio CMS</h1>
      <p className={styles.pageSub}>Manage your portfolio content from here.</p>

      <section id="profile" className={styles.section}>
        <ProfileEditor />
      </section>

      <section id="appearance" className={styles.section}>
        <AppearanceEditor />
      </section>

      <section id="projects" className={styles.section}>
        <ProjectManager />
      </section>

      <section id="skills" className={styles.section}>
        <SkillManager />
      </section>

      <section id="certificates" className={styles.section}>
        <CertificateManager />
      </section>

      <section id="messages" className={styles.section}>
        <MessageInbox />
      </section>
    </div>
  )
}
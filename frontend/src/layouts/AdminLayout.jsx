// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span>Admin CMS</span>
        </div>
        <nav className={styles.nav}>
          <a href="#profile" className={styles.navItem}><i className="ri-user-line" /> Profile</a>
          <a href="#projects" className={styles.navItem}><i className="ri-folder-line" /> Projects</a>
          <a href="#skills" className={styles.navItem}><i className="ri-code-line" /> Skills</a>
          <a href="#messages" className={styles.navItem}><i className="ri-mail-line" /> Messages</a>
          <a href="#appearance" className={styles.navItem}><i className="ri-palette-line" /> Appearance</a>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="ri-logout-box-line" /> Logout
        </button>
      </aside>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
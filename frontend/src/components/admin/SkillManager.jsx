// src/components/admin/SkillManager.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'

const BLANK = { name: '', category: 'Frontend', iconClass: '', proficiency: 80 }
const CATS = ['Frontend', 'Backend', 'Tools', 'Design']

export default function SkillManager() {
  const [skills, setSkills] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = () => api.get('/skills').then(r => setSkills(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const openCreate = () => { setForm(BLANK); setEditId(null); setModal(true) }
  const openEdit = (s) => { setForm({ ...BLANK, ...s }); setEditId(s._id); setModal(true) }

  const save = async () => {
    if (!form.name) { toast.error('Name required'); return }
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/skills/${editId}`, form)
        toast.success('Skill updated')
      } else {
        await api.post('/skills', form)
        toast.success('Skill added')
      }
      setModal(false)
      load()
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete this skill?')) return
    try { await api.delete(`/skills/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div>
      <SectionHeader
        title="Skills"
        subtitle="Manage your tech stack and tools"
        action={
          <button className={styles.addBtn} onClick={openCreate}>
            <i className="ri-add-line" /> Add Skill
          </button>
        }
      />

      {skills.length === 0 ? (
        <div className={styles.emptyState}><i className="ri-code-line" /><p>No skills yet</p></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Skill</th><th>Category</th><th>Proficiency</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(s => (
              <tr key={s._id}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.iconClass && <i className={s.iconClass} style={{ color: 'var(--accent)' }} />}
                    <strong>{s.name}</strong>
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.category}</td>
                <td>
                  {s.proficiency && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2 }}>
                        <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.proficiency}%</span>
                    </span>
                  )}
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(s)}><i className="ri-edit-line" /></button>
                    <button className={styles.deleteBtn} onClick={() => del(s._id)}><i className="ri-delete-bin-line" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className={styles.modal} style={{ maxWidth: 480 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editId ? 'Edit Skill' : 'Add Skill'}</h3>
              <button className={styles.modalClose} onClick={() => setModal(false)}><i className="ri-close-line" /></button>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Name *</label>
                <input className={styles.input} name="name" value={form.name} onChange={handle} placeholder="e.g. React" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select className={styles.input} name="category" value={form.category} onChange={handle}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Remix Icon Class</label>
                <input className={styles.input} name="iconClass" value={form.iconClass} onChange={handle} placeholder="ri-reactjs-line" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Proficiency (1–100)</label>
                <input className={styles.input} name="proficiency" type="number" min={1} max={100} value={form.proficiency} onChange={handle} />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setModal(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={loading}>
                {loading ? 'Saving…' : editId ? 'Save' : 'Add Skill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
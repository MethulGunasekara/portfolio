// src/components/admin/ProjectManager.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'

const BLANK = {
  title: '', description: '', shortDescription: '', tagline: '',
  technologies: [], githubLink: '', liveLink: '',
  previewImageUrl: '', videoUrl: '',
  problemStatement: '', solution: '', outcomes: '',
  documentation: '', documentationUrl: '',
  myRole: '', teamSize: '', duration: '', methodology: '',
  keyFeatures: [], category: ''
}

export default function ProjectManager() {
  const [projects, setProjects] = useState([])
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const load = () => api.get('/projects').then(r => setProjects(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => { setForm(BLANK); setEditId(null); setModal('form') }
  const openEdit = (p) => {
    setForm({ ...BLANK, ...p, technologies: p.technologies || [], keyFeatures: p.keyFeatures || [] })
    setEditId(p._id)
    setModal('form')
  }

  const addTech = () => {
    const v = techInput.trim()
    if (!v || form.technologies.includes(v)) return
    setForm(f => ({ ...f, technologies: [...f.technologies, v] }))
    setTechInput('')
  }

  const removeTech = (t) => setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== t) }))

  const addFeature = () => {
    const v = featureInput.trim()
    if (!v) return
    setForm(f => ({ ...f, keyFeatures: [...f.keyFeatures, v] }))
    setFeatureInput('')
  }

  const removeFeature = (i) => setForm(f => ({ ...f, keyFeatures: f.keyFeatures.filter((_, idx) => idx !== i) }))

  const uploadCloudinary = async (file, type = 'image') => {
    const sigRes = await api.get('/admin/cloudinary-signature')
    const { signature, timestamp } = sigRes.data
    const fd = new FormData()
    fd.append('file', file)
    fd.append('timestamp', timestamp)
    fd.append('signature', signature)
    fd.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY)
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, { method: 'POST', body: fd })
    const data = await res.json()
    if (!data.secure_url) throw new Error('Upload failed')
    return data.secure_url
  }

  const handleImgUpload = async e => {
    const file = e.target.files[0]; if (!file) return
    setUploadingImg(true)
    try {
      const url = await uploadCloudinary(file, 'image')
      setForm(f => ({ ...f, previewImageUrl: url }))
      toast.success('Image uploaded')
    } catch { toast.error('Upload failed') }
    finally { setUploadingImg(false) }
  }

  const handleVideoUpload = async e => {
    const file = e.target.files[0]; if (!file) return
    setUploadingVideo(true)
    try {
      const url = await uploadCloudinary(file, 'video')
      setForm(f => ({ ...f, videoUrl: url }))
      toast.success('Video uploaded')
    } catch { toast.error('Upload failed') }
    finally { setUploadingVideo(false) }
  }

  const save = async () => {
    if (!form.title || !form.description) { toast.error('Title and description required'); return }
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/projects/${editId}`, form)
        toast.success('Project updated')
      } else {
        await api.post('/projects', form)
        toast.success('Project created')
      }
      setModal(null)
      load()
    } catch { toast.error('Failed to save') }
    finally { setLoading(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <SectionHeader
        title="Projects"
        subtitle="Showcase your work with full case studies"
        action={
          <button className={styles.addBtn} onClick={openCreate}>
            <i className="ri-add-line" /> Add Project
          </button>
        }
      />

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="ri-folder-open-line" />
          <p>No projects yet. Add your first one!</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Tech</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id}>
                <td><strong>{p.title}</strong></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.technologies?.slice(0, 3).join(', ')}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {p.liveLink ? '🌐 Live' : p.videoUrl ? '🎥 Video' : p.previewImageUrl ? '🖼 Image' : '—'}
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(p)}><i className="ri-edit-line" /> Edit</button>
                    <button className={styles.deleteBtn} onClick={() => del(p._id)}><i className="ri-delete-bin-line" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal === 'form' && (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editId ? 'Edit Project' : 'New Project'}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}><i className="ri-close-line" /></button>
            </div>

            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Title *</label>
                <input className={styles.input} name="title" value={form.title} onChange={handle} placeholder="Project name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select className={styles.input} name="category" value={form.category} onChange={handle}>
                  <option value="">Select…</option>
                  <option>Web App</option>
                  <option>Mobile App</option>
                  <option>API / Backend</option>
                  <option>BA Case Study</option>
                  <option>Product Design</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Tagline</label>
                <input className={styles.input} name="tagline" value={form.tagline} onChange={handle} placeholder="One-line summary" />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Short Description (card preview)</label>
                <input className={styles.input} name="shortDescription" value={form.shortDescription} onChange={handle} placeholder="2-3 lines for the project card" />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Full Description *</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="description" value={form.description} onChange={handle} rows={4} />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Problem Statement</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="problemStatement" value={form.problemStatement} onChange={handle} rows={3} placeholder="What business problem did this solve?" />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Solution Approach</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="solution" value={form.solution} onChange={handle} rows={3} placeholder="How did you approach it?" />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Outcomes & Impact</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="outcomes" value={form.outcomes} onChange={handle} rows={3} placeholder="What was the result?" />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Documentation (plain text)</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="documentation" value={form.documentation} onChange={handle} rows={5} placeholder="Technical notes, architecture, decisions…" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Documentation URL (PDF link)</label>
                <input className={styles.input} name="documentationUrl" value={form.documentationUrl} onChange={handle} placeholder="https://…" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>My Role</label>
                <input className={styles.input} name="myRole" value={form.myRole} onChange={handle} placeholder="e.g. Lead Developer, BA" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Team Size</label>
                <input className={styles.input} name="teamSize" value={form.teamSize} onChange={handle} placeholder="e.g. Solo, 4 people" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Duration</label>
                <input className={styles.input} name="duration" value={form.duration} onChange={handle} placeholder="e.g. 3 months" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Methodology</label>
                <input className={styles.input} name="methodology" value={form.methodology} onChange={handle} placeholder="e.g. Agile / Scrum" />
              </div>

              {/* Technologies */}
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Technologies</label>
                <div className={styles.tagInput}>
                  {form.technologies.map(t => (
                    <span key={t} className={styles.tagChip}>{t} <button onClick={() => removeTech(t)}>×</button></span>
                  ))}
                  <input
                    className={styles.inlineInput}
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="Type & press Enter"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Key Features</label>
                <div className={styles.tagInput}>
                  {form.keyFeatures.map((f, i) => (
                    <span key={i} className={styles.tagChip}>{f} <button onClick={() => removeFeature(i)}>×</button></span>
                  ))}
                  <input
                    className={styles.inlineInput}
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Type & press Enter"
                  />
                </div>
              </div>

              {/* Links */}
              <div className={styles.field}>
                <label className={styles.label}>GitHub Link</label>
                <input className={styles.input} name="githubLink" value={form.githubLink} onChange={handle} placeholder="https://github.com/…" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Live Site URL</label>
                <input className={styles.input} name="liveLink" value={form.liveLink} onChange={handle} placeholder="https://…" />
              </div>

              {/* Preview Image */}
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Preview Image</label>
                <div className={styles.uploadRow}>
                  {form.previewImageUrl && <img src={form.previewImageUrl} alt="" className={styles.thumbImg} />}
                  <label className={styles.uploadBtn}>
                    {uploadingImg ? 'Uploading…' : <><i className="ri-image-line" /> Upload Image</>}
                    <input type="file" accept="image/*" onChange={handleImgUpload} hidden disabled={uploadingImg} />
                  </label>
                  <input className={styles.input} name="previewImageUrl" value={form.previewImageUrl} onChange={handle} placeholder="Or paste URL" style={{ flex: 1 }} />
                </div>
              </div>

              {/* Demo Video */}
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Demo Video</label>
                <div className={styles.uploadRow}>
                  <label className={styles.uploadBtn}>
                    {uploadingVideo ? 'Uploading…' : <><i className="ri-video-line" /> Upload Video</>}
                    <input type="file" accept="video/*" onChange={handleVideoUpload} hidden disabled={uploadingVideo} />
                  </label>
                  <input className={styles.input} name="videoUrl" value={form.videoUrl} onChange={handle} placeholder="Or paste video URL" style={{ flex: 1 }} />
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={loading}>
                {loading ? 'Saving…' : editId ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// src/components/admin/ProjectManager.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'

const BLANK = {
  title: '', description: '', shortDescription: '', tagline: '',
  technologies: [], githubLink: '', liveLink: '',
  previewImages: [], videoUrl: '',
  problemStatement: '', solution: '', outcomes: '',
  documentation: '', documentationUrl: '',
  myRole: '', teamSize: '', duration: '', methodology: '',
  keyFeatures: [], category: ''
}

export default function ProjectManager() {
  const [projects, setProjects] = useState([])
  const [modal, setModal] = useState(null)
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

  const openCreate = () => {
    setForm(BLANK); setEditId(null); setTechInput(''); setFeatureInput(''); setModal('form')
  }

  const openEdit = p => {
    setForm({ ...BLANK, ...p, technologies: p.technologies || [], keyFeatures: p.keyFeatures || [], previewImages: p.previewImages || [] })
    setEditId(p._id); setTechInput(''); setFeatureInput(''); setModal('form')
  }

  const addTech = () => {
    const v = techInput.trim()
    if (!v || form.technologies.includes(v)) return
    setForm(f => ({ ...f, technologies: [...f.technologies, v] }))
    setTechInput('')
  }

  const removeTech = t => setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== t) }))

  const addFeature = () => {
    const v = featureInput.trim()
    if (!v) return
    setForm(f => ({ ...f, keyFeatures: [...f.keyFeatures, v] }))
    setFeatureInput('')
  }

  const removeFeature = i => setForm(f => ({ ...f, keyFeatures: f.keyFeatures.filter((_, idx) => idx !== i) }))

  const removeImage = i => setForm(f => ({ ...f, previewImages: f.previewImages.filter((_, idx) => idx !== i) }))

  const uploadCloudinary = async (file, type = 'image') => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('resourceType', type)

    const res = await api.post('/admin/upload', fd)
    if (!res.data?.url) throw new Error('No URL returned')
    return res.data.url
  }

  const handleMultiImageUpload = async e => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploadingImg(true)
    try {
      const urls = await Promise.all(files.map(f => uploadCloudinary(f, 'image')))
      setForm(f => ({ ...f, previewImages: [...f.previewImages, ...urls] }))
      toast.success(urls.length + ' image(s) uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploadingImg(false)
      e.target.value = ''
    }
  }

  const handleVideoUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingVideo(true)
    try {
      const url = await uploadCloudinary(file, 'video')
      setForm(f => ({ ...f, videoUrl: url }))
      toast.success('Video uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploadingVideo(false)
      e.target.value = ''
    }
  }

  const save = async () => {
    if (!form.title || !form.description) { toast.error('Title and description required'); return }
    setLoading(true)
    try {
      if (editId) {
        await api.put('/projects/' + editId, form)
        toast.success('Project updated')
      } else {
        await api.post('/projects', form)
        toast.success('Project created')
      }
      setModal(null)
      load()
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const del = async id => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete('/projects/' + id)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div>
      <SectionHeader
        title="Projects"
        subtitle="Showcase your work with full case studies"
        action={
          <button className={styles.addBtn} onClick={openCreate}>Add Project</button>
        }
      />

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No projects yet. Add your first one!</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th><th>Tech</th><th>Media</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id}>
                <td><strong>{p.title}</strong></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  {(p.technologies || []).slice(0, 3).join(', ')}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {p.previewImages && p.previewImages.length > 0 ? p.previewImages.length + ' img' : p.videoUrl ? 'Video' : p.liveLink ? 'Live' : '-'}
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => del(p._id)}>Delete</button>
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
              <button className={styles.modalClose} onClick={() => setModal(null)}>X</button>
            </div>

            <div className={styles.formGrid}>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Title *</label>
                <input className={styles.input} name="title" value={form.title} onChange={handle} placeholder="Project name" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select className={styles.input} name="category" value={form.category} onChange={handle}>
                  <option value="">Select</option>
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
                <label className={styles.label}>Outcomes and Impact</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="outcomes" value={form.outcomes} onChange={handle} rows={3} placeholder="What was the result?" />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Documentation</label>
                <textarea className={`${styles.input} ${styles.textarea}`} name="documentation" value={form.documentation} onChange={handle} rows={5} placeholder="Technical notes, architecture, decisions" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Documentation URL</label>
                <input className={styles.input} name="documentationUrl" value={form.documentationUrl} onChange={handle} placeholder="https://" />
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

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Technologies (type and press Enter)</label>
                <div className={styles.tagInput}>
                  {form.technologies.map(t => (
                    <span key={t} className={styles.tagChip}>
                      {t} <button type="button" onClick={() => removeTech(t)}>x</button>
                    </span>
                  ))}
                  <input
                    className={styles.inlineInput}
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
                    placeholder="e.g. React"
                  />
                </div>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Key Features (type and press Enter)</label>
                <div className={styles.tagInput}>
                  {form.keyFeatures.map((feat, i) => (
                    <span key={i} className={styles.tagChip}>
                      {feat.length > 30 ? feat.slice(0, 30) + '...' : feat}
                      <button type="button" onClick={() => removeFeature(i)}>x</button>
                    </span>
                  ))}
                  <input
                    className={styles.inlineInput}
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                    placeholder="e.g. Rolling 30-day billing cycle"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>GitHub Link</label>
                <input className={styles.input} name="githubLink" value={form.githubLink} onChange={handle} placeholder="https://github.com/" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Live Site URL</label>
                <input className={styles.input} name="liveLink" value={form.liveLink} onChange={handle} placeholder="https://" />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Preview Images (first image is the card thumbnail)</label>
                {form.previewImages.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                    {form.previewImages.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={url} alt="preview" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                        {idx === 0 && (
                          <span style={{ position: 'absolute', bottom: 3, left: 3, background: 'var(--accent)', color: '#000', fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>
                            CARD
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#EF4444', color: '#fff', fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.uploadRow}>
                  <label className={styles.uploadBtn}>
                    {uploadingImg ? 'Uploading...' : 'Add Images'}
                    <input type="file" accept="image/*" multiple onChange={handleMultiImageUpload} hidden disabled={uploadingImg} />
                  </label>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>You can select multiple files at once</span>
                </div>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Demo Video</label>
                <div className={styles.uploadRow}>
                  <label className={styles.uploadBtn}>
                    {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                    <input type="file" accept="video/*" onChange={handleVideoUpload} hidden disabled={uploadingVideo} />
                  </label>
                  <input className={styles.input} name="videoUrl" value={form.videoUrl} onChange={handle} placeholder="Or paste video URL" style={{ flex: 1 }} />
                </div>
              </div>

            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
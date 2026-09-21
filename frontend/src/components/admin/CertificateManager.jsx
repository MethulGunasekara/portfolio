import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'

const BLANK = { title: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', order: 0 }

export default function CertificateManager() {
  const [certs, setCerts] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  const load = () => api.get('/certificates').then(r => setCerts(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const handle = e => {
    const val = e.target.name === 'order' ? Number(e.target.value) : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const openCreate = () => { setForm(BLANK); setEditId(null); setModal('form') }
  const openEdit = c => { setForm({ ...BLANK, ...c }); setEditId(c._id); setModal('form') }

  const uploadCloudinary = async (file) => {
    const sigRes = await api.get('/admin/cloudinary-signature')
    const { signature, timestamp, cloudName, apiKey, uploadPreset } = sigRes.data
    const fd = new FormData()
    fd.append('file', file)
    fd.append('timestamp', timestamp)
    fd.append('signature', signature)
    fd.append('api_key', apiKey)
    fd.append('upload_preset', uploadPreset)
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: fd }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error?.message || 'Upload failed')
    }
    const data = await res.json()
    if (!data.secure_url) throw new Error('No URL returned')
    return data.secure_url
  }

  const handleImgUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImg(true)
    try {
      const url = await uploadCloudinary(file)
      setForm(f => ({ ...f, imageUrl: url }))
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploadingImg(false)
      e.target.value = ''
    }
  }

  const save = async () => {
    if (!form.title || !form.issuer) { toast.error('Title and issuer required'); return }
    setLoading(true)
    try {
      if (editId) {
        await api.put('/certificates/' + editId, form)
        toast.success('Certificate updated')
      } else {
        await api.post('/certificates', form)
        toast.success('Certificate added')
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
    if (!confirm('Delete this certificate?')) return
    try {
      await api.delete('/certificates/' + id)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div>
      <SectionHeader
        title="Certificates"
        subtitle="Manage your credentials. Lower order number = shown first."
        action={
          <button className={styles.addBtn} onClick={openCreate}>Add Certificate</button>
        }
      />

      {certs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No certificates yet. Add your first one!</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th><th>Title</th><th>Issuer</th><th>Verify URL</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c._id}>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{c.order}</td>
                <td><strong>{c.title}</strong></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.issuer}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {c.credentialUrl ? 'Yes' : '-'}
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(c)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => del(c._id)}>Delete</button>
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
              <h3 className={styles.modalTitle}>{editId ? 'Edit Certificate' : 'Add Certificate'}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}>X</button>
            </div>

            <div className={styles.formGrid}>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Title *</label>
                <input className={styles.input} name="title" value={form.title} onChange={handle} placeholder="e.g. Google Data Analytics" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Issuer *</label>
                <input className={styles.input} name="issuer" value={form.issuer} onChange={handle} placeholder="e.g. Coursera / Google" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Issue Date</label>
                <input className={styles.input} name="issueDate" value={form.issueDate} onChange={handle} placeholder="e.g. Jan 2024" />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Credential / Verify URL</label>
                <input className={styles.input} name="credentialUrl" value={form.credentialUrl} onChange={handle} placeholder="https://coursera.org/verify/..." />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Display Order
                  <span style={{ marginLeft: 6, fontWeight: 400, color: 'var(--text-muted)' }}>
                    — lower number shows first (0 = first)
                  </span>
                </label>
                <input className={styles.input} name="order" type="number" min={0} value={form.order} onChange={handle} />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Certificate Image</label>
                <div className={styles.uploadRow}>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="cert" style={{ height: 60, borderRadius: 6, border: '1px solid var(--border)' }} />
                  )}
                  <label className={styles.uploadBtn}>
                    {uploadingImg ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImgUpload} hidden disabled={uploadingImg} />
                  </label>
                  <input className={styles.input} name="imageUrl" value={form.imageUrl} onChange={handle} placeholder="Or paste image URL" style={{ flex: 1 }} />
                </div>
              </div>

            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Save Changes' : 'Add Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
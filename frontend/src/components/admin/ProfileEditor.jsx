// src/components/admin/ProfileEditor.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'

export default function ProfileEditor() {
  const [form, setForm] = useState({
    fullName: '', jobTitle: '', bio: '', resumeUrl: '',
    githubUrl: '', linkedinUrl: '', heroImageUrl: '', accentColor: '#00E5A0'
  })
  const [loading, setLoading] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)

  useEffect(() => {
    api.get('/profile').then(r => {
      if (r.data) setForm(f => ({ ...f, ...r.data }))
    }).catch(() => {})
  }, [])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('resourceType', resourceType)

    const res = await api.post('/admin/upload', formData)
    if (!res.data?.url) throw new Error('No URL returned')
    return res.data.url
  }

  const handleHeroUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingHero(true)
    try {
      const url = await uploadToCloudinary(file, 'image')
      setForm(f => ({ ...f, heroImageUrl: url }))
      toast.success('Hero image uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploadingHero(false)
    }
  }

  const handleResumeUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingResume(true)
    try {
      const url = await uploadToCloudinary(file, 'raw')
      setForm(f => ({ ...f, resumeUrl: url }))
      toast.success('Resume uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploadingResume(false)
    }
  }

  const save = async () => {
    setLoading(true)
    try {
      await api.put('/admin/profile', form)
      toast.success('Profile saved')
      document.documentElement.style.setProperty('--accent', form.accentColor)
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Profile" subtitle="Your public-facing identity" />
      <div className={styles.formGrid}>

        <div className={styles.field}>
          <label className={styles.label}>Full Name</label>
          <input className={styles.input} name="fullName" value={form.fullName} onChange={handle} placeholder="Methul Gunasekara" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Job Title</label>
          <input className={styles.input} name="jobTitle" value={form.jobTitle} onChange={handle} placeholder="Business Analyst & Full-Stack Developer" />
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label}>Bio</label>
          <textarea className={`${styles.input} ${styles.textarea}`} name="bio" value={form.bio} onChange={handle} rows={4} placeholder="Tell your story" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>GitHub URL</label>
          <input className={styles.input} name="githubUrl" value={form.githubUrl} onChange={handle} placeholder="https://github.com/" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>LinkedIn URL</label>
          <input className={styles.input} name="linkedinUrl" value={form.linkedinUrl} onChange={handle} placeholder="https://linkedin.com/in/" />
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label}>Hero Image</label>
          <div className={styles.uploadRow}>
            {form.heroImageUrl && (
              <img src={form.heroImageUrl} alt="Hero" className={styles.thumbImg} />
            )}
            <label className={styles.uploadBtn}>
              {uploadingHero ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleHeroUpload} hidden disabled={uploadingHero} />
            </label>
            <input className={styles.input} name="heroImageUrl" value={form.heroImageUrl} onChange={handle} placeholder="Or paste URL" style={{ flex: 1 }} />
          </div>
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label}>Resume (PDF)</label>
          <div className={styles.uploadRow}>
            <label className={styles.uploadBtn}>
              {uploadingResume ? 'Uploading...' : 'Upload PDF'}
              <input type="file" accept="application/pdf" onChange={handleResumeUpload} hidden disabled={uploadingResume} />
            </label>
            <input className={styles.input} name="resumeUrl" value={form.resumeUrl} onChange={handle} placeholder="Or paste PDF URL" style={{ flex: 1 }} />
          </div>
        </div>

      </div>
      <button className={styles.saveBtn} onClick={save} disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}
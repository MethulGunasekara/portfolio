// src/components/admin/AppearanceEditor.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'

const PRESETS = [
  { label: 'Emerald', value: '#00E5A0' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Yellow', value: '#EAB308' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Cyan', value: '#06B6D4' },
]

export default function AppearanceEditor() {
  const [color, setColor] = useState('#00E5A0')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/profile').then(r => {
      if (r.data?.accentColor) {
        setColor(r.data.accentColor)
        document.documentElement.style.setProperty('--accent', r.data.accentColor)
      }
    }).catch(() => {})
  }, [])

  const apply = (val) => {
    setColor(val)
    document.documentElement.style.setProperty('--accent', val)
  }

  const save = async () => {
    setLoading(true)
    try {
      await api.put('/admin/profile', { accentColor: color })
      toast.success('Accent color saved')
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Appearance" subtitle="Control the accent color of your entire portfolio" />

      <div className={styles.colorSection}>
        <p className={styles.colorLabel}>Preset Colors</p>
        <div className={styles.colorPresets}>
          {PRESETS.map(p => (
            <button
              key={p.value}
              className={`${styles.colorSwatch} ${color === p.value ? styles.colorSwatchActive : ''}`}
              style={{ background: p.value }}
              onClick={() => apply(p.value)}
              title={p.label}
            />
          ))}
        </div>

        <p className={styles.colorLabel} style={{ marginTop: 20 }}>Custom Color</p>
        <div className={styles.colorRow}>
          <input
            type="color"
            value={color}
            onChange={e => apply(e.target.value)}
            className={styles.colorPicker}
          />
          <input
            className={styles.input}
            value={color}
            onChange={e => apply(e.target.value)}
            placeholder="#00E5A0"
            style={{ width: 140 }}
          />
          <div className={styles.colorPreview} style={{ background: color }} />
        </div>

        <p className={styles.colorNote}>
          This color controls buttons, highlights, badges, and skill bars across the entire site.
        </p>

        <button className={styles.saveBtn} onClick={save} disabled={loading}>
          {loading ? 'Saving…' : <><i className="ri-palette-line" /> Apply Color</>}
        </button>
      </div>
    </div>
  )
}
// src/components/sections/ContactSection.jsx
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import styles from './ContactSection.module.css'

export default function ContactSection() {
  const [form, setForm] = useState({ senderName: '', senderEmail: '', subject: '', messageBody: '' })
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.senderName || !form.senderEmail || !form.messageBody) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      await api.post('/messages', form)
      toast.success("Message sent! I'll be in touch soon.")
      setForm({ senderName: '', senderEmail: '', subject: '', messageBody: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Contact</span>
          <div className={styles.labelLine} />
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 className={styles.heading}>Let's work<br /><span className={styles.accent}>together</span></h2>
            <p className={styles.body}>
              Whether you have a project in mind, a role to fill, or just want to connect — my inbox is open.
            </p>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <i className="ri-map-pin-line" />
                <span>Colombo, Sri Lanka</span>
              </div>
              <div className={styles.infoItem}>
                <i className="ri-graduation-cap-line" />
                <span>B.Sc (Hons) IT · SLIIT</span>
              </div>
            </div>
          </div>

          <form className={styles.form} onSubmit={submit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Name *</label>
                <input
                  className={styles.input}
                  name="senderName"
                  value={form.senderName}
                  onChange={handle}
                  placeholder="Your name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email *</label>
                <input
                  className={styles.input}
                  name="senderEmail"
                  type="email"
                  value={form.senderEmail}
                  onChange={handle}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Subject</label>
              <input
                className={styles.input}
                name="subject"
                value={form.subject}
                onChange={handle}
                placeholder="What's this about?"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Message *</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                name="messageBody"
                value={form.messageBody}
                onChange={handle}
                rows={5}
                placeholder="Tell me about your project or opportunity…"
              />
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? <><i className="ri-loader-4-line" /> Sending…</> : <>Send message <i className="ri-send-plane-line" /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
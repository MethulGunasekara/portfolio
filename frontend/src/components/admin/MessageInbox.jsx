// src/components/admin/MessageInbox.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import SectionHeader from './SectionHeader'
import styles from './AdminForm.module.css'
import mStyles from './MessageInbox.module.css'

export default function MessageInbox() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('Unread')

  const load = () => api.get('/messages').then(r => setMessages(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/messages/${id}`, { status })
      toast.success(`Marked as ${status}`)
      load()
      if (selected?._id === id) setSelected(s => ({ ...s, status }))
    } catch { toast.error('Failed') }
  }

  const del = async (id) => {
    if (!confirm('Permanently delete this message?')) return
    try {
      await api.delete(`/messages/${id}`)
      toast.success('Deleted')
      if (selected?._id === id) setSelected(null)
      load()
    } catch { toast.error('Failed') }
  }

  const filtered = filter === 'All' ? messages : messages.filter(m => m.status === filter)
  const unreadCount = messages.filter(m => m.status === 'Unread').length

  return (
    <div>
      <SectionHeader
        title={`Messages ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        subtitle="Messages from your contact form"
      />

      <div className={mStyles.filters}>
        {['Unread', 'Read', 'Archived', 'All'].map(f => (
          <button
            key={f}
            className={`${mStyles.filterBtn} ${filter === f ? mStyles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={mStyles.layout}>
        <div className={mStyles.list}>
          {filtered.length === 0 && (
            <div className={styles.emptyState}><i className="ri-mail-open-line" /><p>No messages</p></div>
          )}
          {filtered.map(m => (
            <div
              key={m._id}
              className={`${mStyles.msgItem} ${selected?._id === m._id ? mStyles.msgActive : ''} ${m.status === 'Unread' ? mStyles.msgUnread : ''}`}
              onClick={() => { setSelected(m); if (m.status === 'Unread') updateStatus(m._id, 'Read') }}
            >
              <div className={mStyles.msgTop}>
                <strong className={mStyles.msgName}>{m.senderName}</strong>
                <span className={mStyles.msgDate}>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={mStyles.msgSubject}>{m.subject || '(no subject)'}</div>
              <div className={mStyles.msgPreview}>{m.messageBody?.slice(0, 60)}…</div>
            </div>
          ))}
        </div>

        <div className={mStyles.detail}>
          {!selected ? (
            <div className={mStyles.noSelect}><i className="ri-mail-line" /><p>Select a message</p></div>
          ) : (
            <>
              <div className={mStyles.detailHeader}>
                <div>
                  <h3 className={mStyles.detailName}>{selected.senderName}</h3>
                  <a href={`mailto:${selected.senderEmail}`} className={mStyles.detailEmail}>{selected.senderEmail}</a>
                </div>
                <span className={`${mStyles.statusBadge} ${mStyles[`status${selected.status}`]}`}>{selected.status}</span>
              </div>
              {selected.subject && <div className={mStyles.detailSubject}>{selected.subject}</div>}
              <div className={mStyles.detailBody}>{selected.messageBody}</div>
              <div className={mStyles.detailActions}>
                {selected.status !== 'Read' && (
                  <button className={styles.editBtn} onClick={() => updateStatus(selected._id, 'Read')}>
                    <i className="ri-check-line" /> Mark Read
                  </button>
                )}
                {selected.status !== 'Archived' && (
                  <button className={styles.editBtn} onClick={() => updateStatus(selected._id, 'Archived')}>
                    <i className="ri-archive-line" /> Archive
                  </button>
                )}
                <button className={styles.deleteBtn} onClick={() => del(selected._id)}>
                  <i className="ri-delete-bin-line" /> Delete
                </button>
                <a href={`mailto:${selected.senderEmail}`} className={styles.editBtn}>
                  <i className="ri-reply-line" /> Reply
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
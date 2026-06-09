import { useState, useEffect, useCallback } from 'react'
import './TaskModal.css'

export default function TaskModal({ task, onClose, onSubmit, loading }) {
  const isEdit = !!task
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({ title: task.title || '', description: task.description || '', status: task.status || 'pending' })
    } else {
      setForm({ title: '', description: '', status: 'pending' })
    }
    setErrors({})
  }, [task])

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Task title is required'
    else if (form.title.trim().length > 150) e.title = 'Title is too long (max 150 chars)'
    if (form.description.length > 1000) e.description = 'Description too long (max 1000 chars)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({ title: form.title.trim(), description: form.description.trim(), status: form.status })
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit task' : 'New task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="field-group">
            <label className="field-label">Task title *</label>
            <input
              className={`glass-input ${errors.title ? 'input-error' : ''}`}
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })) }}
              autoFocus
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Description <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
            <textarea
              className={`glass-input modal-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Add some details…"
              value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: '' })) }}
              rows={3}
            />
            <div className="char-count">{form.description.length} / 1000</div>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          {isEdit && (
            <div className="field-group">
              <label className="field-label">Status</label>
              <div className="status-toggle">
                {['pending', 'completed'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`status-option ${form.status === s ? `status-option--active status-option--${s}` : ''}`}
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                  >
                    <span className="badge-dot" style={{ background: s === 'completed' ? '#6ee7b7' : '#fde68a' }} />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? <><span className="spinner" />{isEdit ? 'Saving…' : 'Creating…'}</> : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

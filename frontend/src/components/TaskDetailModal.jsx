import { useEffect, useCallback } from 'react'
import './TaskDetailModal.css'

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}
function fmtTime(d) {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function TaskDetailModal({ task, onClose, onEdit, onDelete, onToggle, actionLoading }) {
  if (!task) return null
  const isDone = task.status === 'completed'
  const isLoading = actionLoading === task._id

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div className="tdm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* blurred bg already from overlay; extra glass panel */}
      <div className="tdm-panel">

        {/* ── Glow orb behind the panel ── */}
        <div className="tdm-glow" />

        {/* ── Header ── */}
        <div className="tdm-header">
          <div className="tdm-focus-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" opacity="0.4"/>
            </svg>
            Focus Mode
          </div>
          <button className="tdm-close" onClick={onClose} aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Status ── */}
        <div className="tdm-status-row">
          <span className={`tdm-status-badge ${isDone ? 'badge--done' : 'badge--pending'}`}>
            <span className="badge-dot" />
            {isDone ? 'Completed' : 'Pending'}
          </span>
        </div>

        {/* ── Title ── */}
        <h2 className={`tdm-title ${isDone ? 'tdm-title--done' : ''}`}>{task.title}</h2>

        {/* ── Description ── */}
        <div className="tdm-desc-wrap">
          {task.description
            ? <p className="tdm-desc">{task.description}</p>
            : <p className="tdm-desc tdm-desc--empty">No description added.</p>
          }
        </div>

        {/* ── Meta dates ── */}
        <div className="tdm-meta">
          <div className="tdm-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="tdm-meta-label">Created</span>
            <span className="tdm-meta-value">{fmt(task.createdAt)}{task.createdAt ? `, ${fmtTime(task.createdAt)}` : ''}</span>
          </div>
          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <div className="tdm-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
              </svg>
              <span className="tdm-meta-label">Updated</span>
              <span className="tdm-meta-value">{fmt(task.updatedAt)}{task.updatedAt ? `, ${fmtTime(task.updatedAt)}` : ''}</span>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="tdm-actions">
          <button
            className={`tdm-act-btn tdm-act-toggle ${isDone ? 'tdm-act-toggle--undo' : 'tdm-act-toggle--done'}`}
            onClick={() => onToggle(task._id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
            ) : isDone ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M9 12l2 2 4-4"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
              </svg>
            )}
            {isDone ? 'Mark as pending' : 'Mark as done'}
          </button>

          <div className="tdm-act-right">
            <button className="tdm-act-btn tdm-act-edit" onClick={() => { onClose(); onEdit(task) }} disabled={isLoading}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
              Edit
            </button>
            <button className="tdm-act-btn tdm-act-delete" onClick={() => { onClose(); onDelete(task._id) }} disabled={isLoading}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

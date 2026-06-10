import { useState, useEffect, useCallback } from 'react'
import './TaskDetailModal.css'

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  })
}
function fmtTime(d) {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/**
 * TaskDetailModal — unified Focus Mode popup.
 *
 * Props:
 *   task        — single task to show (when opened from card/row click), OR null
 *   tasks       — full task list for carousel navigation
 *   initialIndex— which index to start at when tasks is provided
 *   onClose     — close handler
 *   onEdit      — fn(task)
 *   onDelete    — fn(taskId)
 *   onToggle    — fn(taskId)
 *   actionLoading — current taskId being acted on
 */
export default function TaskDetailModal({
  task         = null,
  tasks        = [],
  initialIndex = 0,
  onClose,
  onEdit,
  onDelete,
  onToggle,
  actionLoading,
}) {
  // Derive index from single task prop OR use initialIndex for carousel mode
  const [index, setIndex] = useState(() => {
    if (task && tasks.length > 0) {
      const i = tasks.findIndex(t => t._id === task._id)
      return i >= 0 ? i : 0
    }
    return initialIndex
  })

  const isCarousel = tasks.length > 0
  const current    = isCarousel ? tasks[index] : task
  if (!current) return null

  const isDone    = current.status === 'completed'
  const isLoading = actionLoading === current._id

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(tasks.length - 1, i + 1)), [tasks.length])

  // Keep index clamped when tasks list changes (e.g. after delete)
  useEffect(() => {
    setIndex(i => Math.min(i, Math.max(0, tasks.length - 1)))
  }, [tasks.length])

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (isCarousel) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
  }, [onClose, isCarousel, prev, next])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="tdm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Focus Mode"
    >
      <div className="tdm-panel">
        {/* Ambient glow orb */}
        <div className="tdm-glow" />

        {/* ── Top bar: badge + close ── */}
        <div className="tdm-topbar">
          <div className="tdm-focus-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" opacity="0.5"/>
            </svg>
            Focus Mode
          </div>
          <button className="tdm-close" onClick={onClose} aria-label="Close Focus Mode">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Carousel nav (only when tasks list provided) ── */}
        {isCarousel && (
          <div className="tdm-nav">
            <div className="tdm-nav-arrows">
              <button
                className="tdm-nav-arrow"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous task"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                className="tdm-nav-arrow"
                onClick={next}
                disabled={index === tasks.length - 1}
                aria-label="Next task"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>

            <span className="tdm-nav-counter">{index + 1} of {tasks.length}</span>

            <div className="tdm-nav-dots">
              {tasks.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  className={`tdm-nav-dot ${i === index ? 'tdm-nav-dot--active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to task ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Content body ── */}
        <div className="tdm-body">

          {/* Status */}
          <div className="tdm-status-row">
            <span className={`tdm-status-badge ${isDone ? 'badge--done' : 'badge--pending'}`}>
              <span className="badge-dot" />
              {isDone ? 'Completed' : 'Pending'}
            </span>
          </div>

          {/* Title */}
          <h2 className={`tdm-title ${isDone ? 'tdm-title--done' : ''}`} key={current._id}>
            {current.title}
          </h2>

          {/* Description glass area */}
          <div className="tdm-desc-wrap">
            {current.description
              ? <p className="tdm-desc">{current.description}</p>
              : <p className="tdm-desc tdm-desc--empty">No description added.</p>
            }
          </div>

          {/* Meta dates */}
          <div className="tdm-meta">
            <div className="tdm-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="tdm-meta-label">Created</span>
              <span className="tdm-meta-value">
                {fmt(current.createdAt)}{current.createdAt ? `, ${fmtTime(current.createdAt)}` : ''}
              </span>
            </div>
            {current.updatedAt && current.updatedAt !== current.createdAt && (
              <div className="tdm-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
                </svg>
                <span className="tdm-meta-label">Updated</span>
                <span className="tdm-meta-value">
                  {fmt(current.updatedAt)}, {fmtTime(current.updatedAt)}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="tdm-actions">
            <button
              className={`tdm-act-btn tdm-act-toggle ${isDone ? 'tdm-act-toggle--undo' : 'tdm-act-toggle--done'}`}
              onClick={() => onToggle(current._id)}
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
              <button
                className="tdm-act-btn tdm-act-edit"
                onClick={() => { onClose(); onEdit(current) }}
                disabled={isLoading}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                </svg>
                Edit
              </button>
              <button
                className="tdm-act-btn tdm-act-delete"
                onClick={() => { onClose(); onDelete(current._id) }}
                disabled={isLoading}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Keyboard hint — carousel only */}
          {isCarousel && (
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 4, letterSpacing: '0.3px' }}>
              ← → Arrow keys to navigate · Esc to close
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import './TaskFocusView.css'

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function TaskFocusView({ tasks, onEdit, onDelete, onToggle, actionLoading, onAddTask }) {
  const [index, setIndex] = useState(0)

  // Clamp index when tasks change
  useEffect(() => {
    setIndex(i => Math.min(i, Math.max(0, tasks.length - 1)))
  }, [tasks.length])

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(tasks.length - 1, i + 1)), [tasks.length])

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  if (tasks.length === 0) {
    return (
      <div className="fv-empty">
        <div className="fv-empty-orb" />
        <div className="fv-empty-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" opacity="0.4"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
          </svg>
        </div>
        <h3 className="fv-empty-title">Nothing to focus on</h3>
        <p className="fv-empty-body">
          {`No tasks match your current filter.\nCreate a task or try a different search.`}
        </p>
        <button className="btn-primary" style={{ marginTop: 20, padding: '10px 22px', fontSize: 13 }} onClick={onAddTask}>
          Create first task
        </button>
      </div>
    )
  }

  const task   = tasks[index]
  const isDone = task.status === 'completed'
  const isLoading = actionLoading === task._id

  return (
    <div className="focus-view">
      {/* Counter */}
      <div className="fv-counter">
        <span className="fv-counter-text">{index + 1} of {tasks.length}</span>
        <div className="fv-dots">
          {tasks.map((_, i) => (
            <button
              key={i}
              className={`fv-dot-btn ${i === index ? 'fv-dot-btn--active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to task ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Card + arrows */}
      <div className="fv-stage">
        {/* Prev arrow */}
        <button
          className={`fv-arrow fv-arrow--prev ${index === 0 ? 'fv-arrow--disabled' : ''}`}
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous task"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {/* Focus card */}
        <div className={`fv-card ${isDone ? 'fv-card--done' : ''}`} key={task._id}>
          {/* Inner glow */}
          <div className="fv-card-glow" />

          {/* Top ── status + date */}
          <div className="fv-card-top">
            <span className={`fv-status ${isDone ? 'badge--done' : 'badge--pending'}`}>
              <span className="badge-dot" />
              {isDone ? 'Completed' : 'Pending'}
            </span>
            <span className="fv-card-date">{fmt(task.createdAt)}</span>
          </div>

          {/* Title */}
          <h2 className={`fv-title ${isDone ? 'fv-title--done' : ''}`}>{task.title}</h2>

          {/* Description */}
          <div className="fv-desc-area">
            {task.description
              ? <p className="fv-desc">{task.description}</p>
              : <p className="fv-desc fv-desc--empty">No description added.</p>
            }
          </div>

          {/* Meta */}
          <div className="fv-meta">
            <span className="fv-meta-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {fmt(task.updatedAt || task.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="fv-actions">
            <button
              className={`fv-act-btn fv-act-toggle ${isDone ? 'fv-act-toggle--undo' : 'fv-act-toggle--done'}`}
              onClick={() => !isLoading && onToggle(task._id)}
              disabled={isLoading}
            >
              {isLoading
                ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                : isDone
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M9 12l2 2 4-4"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
              }
              {isDone ? 'Mark pending' : 'Mark done'}
            </button>

            <div className="fv-act-right">
              <button
                className="fv-act-btn fv-act-edit"
                onClick={() => onEdit(task)}
                disabled={isLoading}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                </svg>
                Edit
              </button>
              <button
                className="fv-act-btn fv-act-delete"
                onClick={() => onDelete(task._id)}
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
        </div>

        {/* Next arrow */}
        <button
          className={`fv-arrow fv-arrow--next ${index === tasks.length - 1 ? 'fv-arrow--disabled' : ''}`}
          onClick={next}
          disabled={index === tasks.length - 1}
          aria-label="Next task"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      <p className="fv-keyboard-hint">← → Arrow keys to navigate</p>
    </div>
  )
}

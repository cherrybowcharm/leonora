import './TaskCard.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TaskCard({ task, onOpen, onEdit, onDelete, onToggle, actionLoading }) {
  const isLoading = actionLoading === task._id
  const isDone = task.status === 'completed'

  return (
    <div
      className={`task-card glass-card ${isDone ? 'task-card--done' : ''} ${isLoading ? 'task-card--loading' : ''}`}
      onClick={() => onOpen && onOpen(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen && onOpen(task)}
      title="Click to view details"
      style={{ cursor: 'pointer' }}
    >
      {/* Top row */}
      <div className="tc-top">
        <button
          className={`tc-status-badge ${isDone ? 'badge--done' : 'badge--pending'}`}
          onClick={(e) => { e.stopPropagation(); !isLoading && onToggle(task._id) }}
          disabled={isLoading}
          title="Toggle status"
        >
          <span className="badge-dot" />
          {isDone ? 'Completed' : 'Pending'}
        </button>
        <span className="tc-date">{formatDate(task.createdAt)}</span>
      </div>

      {/* Content */}
      <div className="tc-content">
        <h3 className={`tc-title ${isDone ? 'tc-title--done' : ''}`}>{task.title}</h3>
        {task.description && (
          <p className="tc-desc">{task.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="tc-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="tc-btn tc-btn--toggle"
          onClick={() => !isLoading && onToggle(task._id)}
          disabled={isLoading}
          title={isDone ? 'Mark pending' : 'Mark complete'}
        >
          {isLoading ? (
            <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
          ) : isDone ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M9 12l2 2 4-4"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
            </svg>
          )}
          {isDone ? 'Mark pending' : 'Mark done'}
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="tc-btn tc-btn--edit"
            onClick={() => onEdit(task)}
            disabled={isLoading}
            title="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
            </svg>
            Edit
          </button>
          <button
            className="tc-btn tc-btn--delete"
            onClick={() => onDelete(task._id)}
            disabled={isLoading}
            title="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

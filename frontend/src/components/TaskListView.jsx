import './TaskListView.css'

function fmt(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TaskListView({ tasks, onOpen, onEdit, onDelete, onToggle, actionLoading }) {
  return (
    <div className="list-view">
      {tasks.map((task, i) => {
        const isDone = task.status === 'completed'
        const isLoading = actionLoading === task._id

        return (
          <div
            key={task._id}
            className={`lv-row fade-up ${isDone ? 'lv-row--done' : ''} ${isLoading ? 'lv-row--loading' : ''}`}
            style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => onOpen(task)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(task)}
            title="Click to view details"
          >
            {/* Status dot */}
            <div
              className={`lv-dot ${isDone ? 'lv-dot--done' : 'lv-dot--pending'}`}
              onClick={(e) => { e.stopPropagation(); !isLoading && onToggle(task._id) }}
              title={isDone ? 'Mark pending' : 'Mark done'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { e.stopPropagation(); if(e.key === 'Enter') onToggle(task._id) }}
            >
              {isDone
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                : null
              }
            </div>

            {/* Content */}
            <div className="lv-content">
              <span className={`lv-title ${isDone ? 'lv-title--done' : ''}`}>{task.title}</span>
              {task.description && (
                <span className="lv-desc">{task.description}</span>
              )}
            </div>

            {/* Date */}
            <span className="lv-date">{fmt(task.createdAt)}</span>

            {/* Status badge */}
            <span className={`lv-badge ${isDone ? 'badge--done' : 'badge--pending'}`}>
              <span className="badge-dot" />
              {isDone ? 'Done' : 'Pending'}
            </span>

            {/* Actions */}
            <div className="lv-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="lv-btn lv-btn--edit"
                onClick={() => onEdit(task)}
                disabled={isLoading}
                title="Edit"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                </svg>
              </button>
              <button
                className="lv-btn lv-btn--delete"
                onClick={() => onDelete(task._id)}
                disabled={isLoading}
                title="Delete"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

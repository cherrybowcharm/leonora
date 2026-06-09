import './ViewSwitcher.css'

const views = [
  {
    id: 'grid',
    label: 'Grid',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3" cy="6" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="3" cy="12" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="3" cy="18" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'focus',
    label: 'Focus',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" opacity="0.4"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
  },
]

export default function ViewSwitcher({ activeView, onChange }) {
  return (
    <div className="view-switcher" role="group" aria-label="Task view">
      {views.map((v) => (
        <button
          key={v.id}
          className={`vs-btn ${activeView === v.id ? 'vs-btn--active' : ''}`}
          onClick={() => onChange(v.id)}
          title={`${v.label} view`}
          aria-pressed={activeView === v.id}
        >
          {v.icon}
          <span className="vs-label">{v.label}</span>
        </button>
      ))}
    </div>
  )
}

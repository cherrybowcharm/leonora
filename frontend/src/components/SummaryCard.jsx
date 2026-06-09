import './SummaryCard.css'

const icons = {
  total: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  completed: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>
    </svg>
  ),
  pending: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
    </svg>
  ),
}

const colors = {
  total:     { icon: '#a78bfa', glow: 'rgba(167,139,250,0.20)', bar: 'var(--accent-lavender)' },
  completed: { icon: '#6ee7b7', glow: 'rgba(52,211,153,0.18)',  bar: '#6ee7b7' },
  pending:   { icon: '#fde68a', glow: 'rgba(251,191,36,0.18)',  bar: '#fde68a' },
}

export default function SummaryCard({ type, count, label, delay = 0 }) {
  const c = colors[type]
  return (
    <div
      className="summary-card glass-card fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="summary-icon-wrap" style={{ background: c.glow }}>
        <span style={{ color: c.icon }}>{icons[type]}</span>
      </div>
      <div className="summary-body">
        <span className="summary-count">{count}</span>
        <span className="summary-label">{label}</span>
      </div>
      <div className="summary-bar" style={{ background: c.bar }} />
    </div>
  )
}

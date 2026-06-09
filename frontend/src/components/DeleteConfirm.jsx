export default function DeleteConfirm({ onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box" style={{ maxWidth: 380, textAlign: 'center' }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(248,113,113,0.12)',
            border: '1px solid rgba(248,113,113,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Delete task?
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            This action cannot be undone. The task will be permanently removed.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn-ghost" style={{ flex: 1, padding: '12px', borderRadius: 12 }} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.18s', opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 16px rgba(239,68,68,0.35)'
            }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 1.5 }} />Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

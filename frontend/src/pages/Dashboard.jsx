import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import api from '../api/axios'
import PageBackground from '../components/PageBackground'
import SummaryCard from '../components/SummaryCard'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import TaskDetailModal from '../components/TaskDetailModal'
import TaskListView from '../components/TaskListView'
import TaskFocusView from '../components/TaskFocusView'
import ViewSwitcher from '../components/ViewSwitcher'
import DeleteConfirm from '../components/DeleteConfirm'
import Pagination from '../components/Pagination'
import './Dashboard.css'

const LIMIT = 6

export default function Dashboard() {
  const { user, logout } = useAuth()
  const {
    tasks, pagination, loading, actionLoading,
    fetchTasks, debouncedFetch, createTask, updateTask, deleteTask, toggleTask,
  } = useTasks()

  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page,         setPage]         = useState(1)
  const [view,         setView]         = useState('grid')   // 'grid' | 'list' | 'focus'
  const [modal,        setModal]        = useState(null)     // null | 'add' | task-object (edit)
  const [detailTask,   setDetailTask]   = useState(null)     // task shown in Focus Mode detail popup
  const [deleteId,     setDeleteId]     = useState(null)
  const [deleteLoading,setDeleteLoading]= useState(false)
  const [summaryStats, setSummaryStats] = useState({ total: 0, completed: 0, pending: 0 })

  // ── Summary stats ─────────────────────────────────────────
  const refreshSummary = useCallback(async () => {
    try {
      const [all, done] = await Promise.all([
        api.get('/api/tasks?limit=1'),
        api.get('/api/tasks?status=completed&limit=1'),
      ])
      const total     = all.data.pagination.totalTasks
      const completed = done.data.pagination.totalTasks
      setSummaryStats({ total, completed, pending: total - completed })
    } catch { /* silent */ }
  }, [])

  // ── Main fetch ────────────────────────────────────────────
  const load = useCallback((overrides = {}) => {
    const params = { search, status: statusFilter, page, limit: LIMIT, ...overrides }
    fetchTasks(params)
    refreshSummary()
  }, [search, statusFilter, page, fetchTasks, refreshSummary])

  useEffect(() => { load() }, []) // initial load

  // ── Handlers ─────────────────────────────────────────────
  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
    debouncedFetch({ search: val, status: statusFilter, page: 1, limit: LIMIT })
    refreshSummary()
  }

  const handleFilter = (val) => {
    setStatusFilter(val)
    setPage(1)
    fetchTasks({ search, status: val, page: 1, limit: LIMIT })
  }

  const handlePage = (p) => {
    setPage(p)
    fetchTasks({ search, status: statusFilter, page: p, limit: LIMIT })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleModalSubmit = async (payload) => {
    if (modal === 'add') {
      await createTask(payload.title, payload.description)
    } else {
      await updateTask(modal._id, payload)
    }
    setModal(null)
    load({ page: modal === 'add' ? 1 : page })
    if (modal === 'add') setPage(1)
  }

  const handleToggle = async (id) => {
    await toggleTask(id)
    load()
    // Update the detail modal task object if it's open for the same task
    setDetailTask(dt => {
      if (dt && dt._id === id) return { ...dt, status: dt.status === 'pending' ? 'completed' : 'pending' }
      return dt
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await deleteTask(deleteId)
      setDeleteId(null)
      setDetailTask(null)
      const newPage = tasks.length === 1 && page > 1 ? page - 1 : page
      setPage(newPage)
      load({ page: newPage })
    } catch { /* toast already shown */ } finally {
      setDeleteLoading(false)
    }
  }

  // Open edit modal from the detail modal
  const handleEditFromDetail = (task) => {
    setDetailTask(null)
    setModal(task)
  }

  // Delete triggered from detail or card
  const handleDeleteRequest = (id) => {
    setDetailTask(null)
    setDeleteId(id)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Focus view uses all tasks in current page, no separate pagination
  const showPagination = view !== 'focus'

  return (
    <div className="dashboard-page">
      <PageBackground />

      <div className="dashboard-layout">

        {/* ── Navbar ── */}
        <header className="dash-nav glass fade-up">
          <div className="dash-nav-brand">
            <div className="dash-logo-mark">L</div>
            <span className="dash-brand-name">Leonora</span>
          </div>
          <div className="dash-nav-center">
            <span className="dash-greeting">
              {greeting()}, <strong>{user?.name?.split(' ')[0]}</strong> ✦
            </span>
          </div>
          <button className="btn-ghost dash-logout" onClick={logout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </header>

        {/* ── Summary cards ── */}
        <section className="summary-row fade-up fade-up-2">
          <SummaryCard type="total"     count={summaryStats.total}     label="Total tasks" delay={0.08} />
          <SummaryCard type="completed" count={summaryStats.completed} label="Completed"   delay={0.16} />
          <SummaryCard type="pending"   count={summaryStats.pending}   label="Pending"     delay={0.24} />
        </section>

        {/* ── Main glass container ── */}
        <main className="dash-main glass fade-up fade-up-3">

          {/* Controls bar */}
          <div className="dash-controls">
            <div className="search-wrap">
              <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="glass-input search-input"
                type="search"
                placeholder="Search tasks…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {[['', 'All'], ['pending', 'Pending'], ['completed', 'Done']].map(([val, label]) => (
                <button
                  key={val}
                  className={`filter-pill ${statusFilter === val ? 'filter-pill--active' : ''}`}
                  onClick={() => handleFilter(val)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* View switcher */}
            <ViewSwitcher activeView={view} onChange={setView} />

            <button className="btn-primary add-btn" onClick={() => setModal('add')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add task
            </button>
          </div>

          {/* ── Task content area ── */}
          {loading ? (
            <div className="dash-state">
              <div className="loading-grid">
                {[...Array(3)].map((_, i) => <div key={i} className="task-skeleton" />)}
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="dash-state">
              <div className="empty-state">
                <div className="empty-orb" />
                <div className="empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
                  </svg>
                </div>
                <h3 className="empty-title">{search || statusFilter ? 'No tasks match' : 'No tasks yet'}</h3>
                <p className="empty-body">
                  {search || statusFilter ? 'Try a different search or filter.' : 'Create your first task and start organising beautifully.'}
                </p>
                {!search && !statusFilter && (
                  <button className="btn-primary" style={{ marginTop: 20, padding: '11px 24px' }} onClick={() => setModal('add')}>
                    Create first task
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* GRID VIEW */}
              {view === 'grid' && (
                <div className="task-grid">
                  {tasks.map((task, i) => (
                    <div key={task._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <TaskCard
                        task={task}
                        onOpen={setDetailTask}
                        onEdit={(t) => setModal(t)}
                        onDelete={handleDeleteRequest}
                        onToggle={handleToggle}
                        actionLoading={actionLoading}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* LIST VIEW */}
              {view === 'list' && (
                <TaskListView
                  tasks={tasks}
                  onOpen={setDetailTask}
                  onEdit={(t) => setModal(t)}
                  onDelete={handleDeleteRequest}
                  onToggle={handleToggle}
                  actionLoading={actionLoading}
                />
              )}

              {/* FOCUS VIEW */}
              {view === 'focus' && (
                <TaskFocusView
                  tasks={tasks}
                  onEdit={(t) => setModal(t)}
                  onDelete={handleDeleteRequest}
                  onToggle={handleToggle}
                  actionLoading={actionLoading}
                  onAddTask={() => setModal('add')}
                />
              )}

              {showPagination && (
                <>
                  <Pagination pagination={pagination} onPageChange={handlePage} />
                  <p className="task-count-label">
                    Showing {tasks.length} of {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Edit/Add Task Modal ── */}
      {modal !== null && (
        <TaskModal
          task={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSubmit={handleModalSubmit}
          loading={actionLoading === 'create' || (modal !== 'add' && actionLoading === modal?._id)}
        />
      )}

      {/* ── Focus Mode Detail Modal (grid/list click) ── */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteRequest}
          onToggle={handleToggle}
          actionLoading={actionLoading}
        />
      )}

      {/* ── Delete confirmation ── */}
      {deleteId && (
        <DeleteConfirm
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}

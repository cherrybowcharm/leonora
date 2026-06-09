import { useState, useCallback, useRef } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ totalTasks: 0, totalPages: 0, currentPage: 1 })
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null) // taskId or 'create'
  const debounceRef = useRef(null)

  const fetchTasks = useCallback(async ({ search = '', status = '', page = 1, limit = 6 } = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (status) params.append('status', status)
      params.append('page', page)
      params.append('limit', limit)
      const { data } = await api.get(`/api/tasks?${params}`)
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedFetch = useCallback((params) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchTasks(params), 320)
  }, [fetchTasks])

  const createTask = useCallback(async (title, description) => {
    setActionLoading('create')
    try {
      const { data } = await api.post('/api/tasks', { title, description })
      toast.success('Task created!')
      return data.task
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
      throw err
    } finally {
      setActionLoading(null)
    }
  }, [])

  const updateTask = useCallback(async (id, payload) => {
    setActionLoading(id)
    try {
      const { data } = await api.put(`/api/tasks/${id}`, payload)
      toast.success('Task updated!')
      return data.task
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task')
      throw err
    } finally {
      setActionLoading(null)
    }
  }, [])

  const deleteTask = useCallback(async (id) => {
    setActionLoading(id)
    try {
      await api.delete(`/api/tasks/${id}`)
      toast.success('Task deleted')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task')
      throw err
    } finally {
      setActionLoading(null)
    }
  }, [])

  const toggleTask = useCallback(async (id) => {
    setActionLoading(id)
    try {
      const { data } = await api.patch(`/api/tasks/${id}/toggle`)
      toast.success(`Marked as ${data.task.status}`)
      return data.task
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
      throw err
    } finally {
      setActionLoading(null)
    }
  }, [])

  return {
    tasks, pagination, loading, actionLoading,
    fetchTasks, debouncedFetch, createTask, updateTask, deleteTask, toggleTask,
    setTasks,
  }
}

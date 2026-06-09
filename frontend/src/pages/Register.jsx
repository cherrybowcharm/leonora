import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageBackground from '../components/PageBackground'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(err => ({ ...err, [e.target.name]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      await register(form.name.trim(), form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <PageBackground />
      <div className="auth-center">
        <div className="auth-card glass fade-up">
          <div className="auth-logo fade-up fade-up-1">
            <div className="auth-logo-mark">L</div>
          </div>

          <h1 className="auth-title fade-up fade-up-2">Create account</h1>
          <p className="auth-subtitle fade-up fade-up-2">Join Leonora and start organising beautifully</p>

          {apiError && <div className="auth-api-error fade-up">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate className="auth-form fade-up fade-up-3">
            <div className="field-group">
              <label className="field-label">Full name</label>
              <input
                className={`glass-input ${errors.name ? 'input-error' : ''}`}
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">Email address</label>
              <input
                className={`glass-input ${errors.email ? 'input-error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="auth-row">
              <div className="field-group">
                <label className="field-label">Password</label>
                <input
                  className={`glass-input ${errors.password ? 'input-error' : ''}`}
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="field-group">
                <label className="field-label">Confirm password</label>
                <input
                  className={`glass-input ${errors.confirm ? 'input-error' : ''}`}
                  type="password"
                  name="confirm"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              </div>
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? <><span className="spinner" /> Creating account…</> : 'Create account'}
            </button>
          </form>

          <p className="auth-switch fade-up fade-up-4">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

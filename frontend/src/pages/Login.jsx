import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageBackground from '../components/PageBackground'
import './Auth.css'

const DEMO_EMAIL    = 'demo@leonora.com'
const DEMO_PASSWORD = 'demo123'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email.trim())              e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)                  e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    setForm(f    => ({ ...f,   [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er,  [e.target.name]: ''            }))
    setApiError('')
  }

  const doLogin = async (email, password) => {
    setLoading(true)
    setApiError('')
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await doLogin(form.email, form.password)
  }

  const handleDemo = async () => {
    setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
    setErrors({})
    await doLogin(DEMO_EMAIL, DEMO_PASSWORD)
  }

  return (
    <div className="auth-page">
      <PageBackground />
      {/* Auth-specific extra blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />
      <div className="auth-blob auth-blob-4" />

      <div className="auth-center">
        <div className="auth-card">

          {/* ── Logo ── */}
          <div className="auth-logo">
            <div className="auth-logo-mark">L</div>
          </div>

          {/* ── Headings ── */}
          <h1 className="auth-title">Leonora</h1>
          <p className="auth-subtitle">Welcome back — sign in to continue</p>

          {/* ── API error ── */}
          {apiError && <div className="auth-api-error">{apiError}</div>}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <div className="field-group">
              <label className="field-label">Email address</label>
              <input
                className={`glass-input${errors.email ? ' input-error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className={`glass-input${errors.password ? ' input-error' : ''}`}
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Signing in…</>
                : 'Sign in'}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or try instantly</span>
            <span className="auth-divider-line" />
          </div>

          {/* ── Demo button ── */}
          <button
            className="auth-demo-btn"
            onClick={handleDemo}
            disabled={loading}
            type="button"
          >
            <span className="demo-sparkle">✦</span>
            Continue with Demo Account
          </button>

          {/* ── Switch to register ── */}
          <div className="auth-switch-wrap">
            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create one</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const registered = searchParams.get('registered') === '1'

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(formData)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Login failed. Please try again.'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 transition-colors dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-950 dark:bg-neutral-950">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to manage your team tasks.</p>

        {registered && (
          <p className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
            Account created successfully. You can log in now.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
            />
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage, signupUser } from '../services/authService'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    setSubmitting(true)
    try {
      await signupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })
      navigate('/login?registered=1')
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Signup failed. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 transition-colors dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Create account</h1>

        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Choose your role to get started
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-blue-900 dark:bg-black dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-blue-900 dark:bg-black dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-blue-900 dark:bg-black dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Role</label>
            <div className="flex gap-4 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="role"
                  value="member"
                  checked={formData.role === 'member'}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Member
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Admin
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

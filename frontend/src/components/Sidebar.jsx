import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-full border-b border-blue-100 bg-white p-4 transition-colors dark:border-blue-950 dark:bg-black lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-950 dark:text-white">Team Task Manager</h1>
        {user?.role != null && user.role !== '' && (
          <p className="mt-1 text-sm capitalize text-blue-700 dark:text-blue-300">{user.role}</p>
        )}
      </div>

      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-200'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-6 flex w-full items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-200 dark:hover:bg-blue-900/70"
        aria-label="Toggle light and dark mode"
      >
        <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
        <span aria-hidden className="flex h-6 w-11 items-center rounded-full bg-white p-0.5 shadow-inner dark:bg-black">
          <span className={`h-5 w-5 rounded-full bg-blue-600 transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
        </span>
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        Logout
      </button>
    </aside>
  )
}

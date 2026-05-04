import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center transition-colors dark:bg-black">
      <h1 className="text-4xl font-bold text-slate-950 dark:text-white">404</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
        Go to Dashboard
      </Link>
    </div>
  )
}

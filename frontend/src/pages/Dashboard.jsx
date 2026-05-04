import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard, { IconAlertClock, IconCheckCircle, IconClipboard } from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../services/authService'
import { getDashboardStats } from '../services/dashboardService'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchStats = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getDashboardStats()
        if (!cancelled) {
          setStats({
            totalTasks: Number(data.totalTasks) || 0,
            assignedTasks: Number(data.assignedTasks) || 0,
            completedTasks: Number(data.completedTasks) || 0,
            ongoingTasks: Number(data.ongoingTasks) || 0,
            overdueTasks: Number(data.overdueTasks) || 0,
            totalProjects: Number(data.totalProjects) || 0,
            totalUsers: Number(data.totalUsers) || 0,
            userStats: data.userStats || [],
          })
        }
      } catch (err) {
        if (!cancelled) {
          setStats(null)
          setError(getAuthErrorMessage(err, 'Could not load dashboard.'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStats()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppLayout title="Dashboard">
      <p className="mb-8 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
        {isAdmin
          ? 'Admin overview across every project, task, and user.'
          : 'Your assigned work, finished tasks, ongoing tasks, and overdue tasks.'}
      </p>

      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-800 shadow-sm dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
        >
          <p className="font-semibold">Something went wrong</p>
          <p className="mt-2 text-rose-700 dark:text-rose-200">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={isAdmin ? 'All Tasks' : 'Assigned Tasks'}
              value={isAdmin ? stats.totalTasks : stats.assignedTasks}
              variant="indigo"
              icon={<IconClipboard />}
            />
            <StatCard
              title="Finished Tasks"
              value={stats.completedTasks}
              variant="emerald"
              icon={<IconCheckCircle />}
            />
            <StatCard
              title="Ongoing Tasks"
              value={stats.ongoingTasks}
              variant="indigo"
              icon={<IconClipboard />}
            />
            <StatCard
              title="Overdue Tasks"
              value={stats.overdueTasks}
              variant="rose"
              icon={<IconAlertClock />}
            />
            {isAdmin && (
              <>
                <StatCard
                  title="All Projects"
                  value={stats.totalProjects}
                  variant="indigo"
                  icon={<IconClipboard />}
                />
                <StatCard
                  title="All Users"
                  value={stats.totalUsers}
                  variant="indigo"
                  icon={<IconClipboard />}
                />
              </>
            )}
          </div>

          {isAdmin && (
            <section className="mt-8 rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-950 dark:bg-neutral-950">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">User Stats</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-blue-100 text-xs uppercase text-slate-500 dark:border-blue-950 dark:text-slate-400">
                    <tr>
                      <th className="py-3 pr-4 font-semibold">User</th>
                      <th className="py-3 pr-4 font-semibold">Role</th>
                      <th className="py-3 pr-4 font-semibold">Assigned</th>
                      <th className="py-3 pr-4 font-semibold">Finished</th>
                      <th className="py-3 pr-4 font-semibold">Ongoing</th>
                      <th className="py-3 pr-4 font-semibold">Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50 dark:divide-blue-950">
                    {stats.userStats.map((row) => (
                      <tr key={row._id}>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-slate-900 dark:text-white">{row.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
                        </td>
                        <td className="py-3 pr-4 capitalize text-slate-700 dark:text-slate-300">{row.role}</td>
                        <td className="py-3 pr-4 text-blue-700 dark:text-blue-300">{row.assignedTasks}</td>
                        <td className="py-3 pr-4 text-blue-700 dark:text-blue-300">{row.completedTasks}</td>
                        <td className="py-3 pr-4 text-blue-700 dark:text-blue-300">{row.ongoingTasks}</td>
                        <td className="py-3 pr-4 text-blue-700 dark:text-blue-300">{row.overdueTasks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </AppLayout>
  )
}

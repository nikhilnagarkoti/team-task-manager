import { useCallback, useEffect, useMemo, useState } from 'react'
import AppLayout from '../components/AppLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import TaskCard from '../components/TaskCard'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../services/authService'
import { getProjects } from '../services/projectService'
import { createTask, getTasks, updateTaskStatus } from '../services/taskService'
import { getUsers } from '../services/userService'

function FlashNotice({ notice, onDismiss }) {
  if (!notice) return null
  const styles =
    notice.type === 'success'
      ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100'
      : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100'

  return (
    <div
      role="alert"
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      <span>{notice.text}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Dismiss"
      >
        x
      </button>
    </div>
  )
}

export default function Tasks() {
  const { user, isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [assignableUsers, setAssignableUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [formMetaLoading, setFormMetaLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState('')
  const [listError, setListError] = useState('')
  const [notice, setNotice] = useState(null)

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    projectId: '',
  })

  const showNotice = useCallback((type, text) => {
    setNotice(text ? { type, text } : null)
  }, [])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 5000)
    return () => clearTimeout(t)
  }, [notice])

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setListError('')
    try {
      const data = await getTasks()
      setTasks(data.tasks || [])
    } catch (err) {
      setTasks([])
      setListError(getAuthErrorMessage(err, 'Could not load tasks.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    const load = async () => {
      setFormMetaLoading(true)
      try {
        const [usersRes, projRes] = await Promise.all([getUsers(), getProjects()])
        if (cancelled) return
        setAssignableUsers(usersRes.users || [])
        setProjects(projRes.projects || [])
      } catch (err) {
        if (!cancelled) {
          showNotice('error', getAuthErrorMessage(err, 'Could not load users or projects for the form.'))
          setAssignableUsers([])
          setProjects([])
        }
      } finally {
        if (!cancelled) setFormMetaLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isAdmin, showNotice])

  const handleTaskFormChange = (event) => {
    setTaskForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()
    setCreating(true)
    try {
      const payload = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        assignedTo: taskForm.assignedTo,
        projectId: taskForm.projectId,
      }
      if (taskForm.deadline) {
        payload.deadline = taskForm.deadline
      }

      await createTask(payload)
      setTaskForm({
        title: '',
        description: '',
        deadline: '',
        assignedTo: '',
        projectId: '',
      })
      showNotice('success', 'Task created successfully.')
      await fetchTasks()
    } catch (err) {
      showNotice('error', getAuthErrorMessage(err, 'Could not create task.'))
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    setStatusUpdatingId(taskId)
    try {
      await updateTaskStatus(taskId, status)
      showNotice('success', 'Status updated.')
      await fetchTasks()
    } catch (err) {
      showNotice('error', getAuthErrorMessage(err, 'Could not update status.'))
    } finally {
      setStatusUpdatingId('')
    }
  }

  const canEditStatusForTask = useMemo(() => {
    const uid = String(user?._id ?? user?.id ?? '')
    return (task) => {
      // Admin can always change status
      if (isAdmin) return true
      // Non-admins cannot undo a completed task
      if (task?.status === 'completed') return false
      // Non-admins can only edit tasks assigned to them
      return String(task?.assignedTo?._id ?? task?.assignedTo) === uid
    }
  }, [user?._id, user?.id, isAdmin])

  return (
    <AppLayout title="Tasks">
      <FlashNotice notice={notice} onDismiss={() => setNotice(null)} />

      {isAdmin && (
        <section className="mb-8 rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-950 dark:bg-neutral-950">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Create task</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Assign work to a team member. JWT is sent automatically.</p>

          {formMetaLoading && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading users and projects...</p>
          )}

          <form onSubmit={handleCreateTask} className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Title</label>
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleTaskFormChange}
                required
                placeholder="Short title"
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
              <textarea
                name="description"
                value={taskForm.description}
                onChange={handleTaskFormChange}
                rows={3}
                placeholder="Details (optional)"
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={taskForm.deadline}
                onChange={handleTaskFormChange}
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Assign user</label>
              <select
                name="assignedTo"
                value={taskForm.assignedTo}
                onChange={handleTaskFormChange}
                required
                disabled={formMetaLoading}
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring disabled:bg-blue-50 dark:border-blue-900 dark:bg-black dark:text-slate-100 dark:disabled:bg-neutral-900"
              >
                <option value="">Select member</option>
                {assignableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Project</label>
              <select
                name="projectId"
                value={taskForm.projectId}
                onChange={handleTaskFormChange}
                required
                disabled={formMetaLoading}
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring disabled:bg-blue-50 dark:border-blue-900 dark:bg-black dark:text-slate-100 dark:disabled:bg-neutral-900"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Tasks are tied to a project on the server.
              </p>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating || formMetaLoading}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating...' : 'Create task'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="sr-only">Task list</h2>
        {loading ? (
        <LoadingSpinner label="Loading tasks..." />
        ) : (
          <>
            {listError && (
              <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">{listError}</p>
            )}
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  canEditStatus={canEditStatusForTask(task)}
                  isCompletedLocked={task?.status === 'completed' && !isAdmin}
                  statusBusy={statusUpdatingId === task._id}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
            {!tasks.length && !listError ? (
              <p className="rounded-xl border border-dashed border-blue-200 bg-white py-12 text-center text-sm text-slate-500 dark:border-blue-900 dark:bg-neutral-950 dark:text-slate-400">
                No tasks yet.
              </p>
            ) : null}
          </>
        )}
      </section>
    </AppLayout>
  )
}

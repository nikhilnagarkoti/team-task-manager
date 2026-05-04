import { TASK_STATUS_OPTIONS, formatTaskStatus } from '../constants/taskStatus'

export default function TaskCard({ task, canEditStatus, isCompletedLocked, statusBusy, onStatusChange }) {
  const deadlineLabel = task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'
  const description = task.description?.trim() ? task.description : '—'

  return (
    <article className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-200 dark:border-blue-950 dark:bg-neutral-950 dark:hover:border-blue-800">
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{task.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <dt className="min-w-[5rem] font-medium text-slate-500 dark:text-slate-400">Status</dt>
          <dd className="flex-1 text-slate-800 dark:text-slate-200">
            {isCompletedLocked ? (
              <span
                title="Only an admin can undo a completed task"
                className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-200"
              >
                ✅ Completed <span aria-label="locked">🔒</span>
              </span>
            ) : canEditStatus ? (
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task._id, event.target.value)}
                disabled={statusBusy}
                className="w-full max-w-xs rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring disabled:opacity-60 dark:border-blue-900 dark:bg-black dark:text-slate-100 sm:w-auto"
                aria-label="Task status"
              >
                {TASK_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                {formatTaskStatus(task.status)}
              </span>
            )}
          </dd>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <dt className="min-w-[5rem] font-medium text-slate-500 dark:text-slate-400">Deadline</dt>
          <dd className="text-slate-800 dark:text-slate-200">{deadlineLabel}</dd>
        </div>
      </dl>
    </article>
  )
}

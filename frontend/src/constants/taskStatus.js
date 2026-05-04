/** Status values sent to PUT /tasks/:id */
export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

export function formatTaskStatus(value) {
  const found = TASK_STATUS_OPTIONS.find((o) => o.value === value)
  return found ? found.label : value
}

import api from './api'

export const getTasks = async () => {
  const { data } = await api.get('/tasks')
  return data
}

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload)
  return data
}

export const updateTaskStatus = async (taskId, status) => {
  const { data } = await api.put(`/tasks/${taskId}`, { status })
  return data
}

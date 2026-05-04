import api from './api'

export const getProjects = async () => {
  const { data } = await api.get('/projects')
  return data
}

export const createProject = async (payload) => {
  const { data } = await api.post('/projects', payload)
  return data
}

export const addProjectMember = async (projectId, userId) => {
  const { data } = await api.put(`/projects/${projectId}/members`, { userId })
  return data
}

export const removeProjectMember = async (projectId, userId) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`)
  return data
}

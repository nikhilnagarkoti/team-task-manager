import api from './api'

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const signupUser = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/signup', { name, email, password })
  return data
}

/** Parse backend error payloads (Express/joi style, etc.). */
export function getAuthErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data
  if (data == null) return fallback
  if (typeof data.message === 'string') return data.message
  if (Array.isArray(data.message)) return data.message.join(', ')
  if (typeof data.msg === 'string') return data.msg
  if (typeof data.error === 'string') return data.error
  if (typeof data === 'string') return data
  return fallback
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthStorage, readStoredSession } from '../constants/authKeys'
import { loginUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(readStoredSession)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }, [user])

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const response = await loginUser({ email, password })
      setAuth({ token: response.token, user: response.user })
      return response
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAuth({ token: null, user: null })
    clearAuthStorage()
  }

  const roleFromApi = user?.role != null ? String(user.role).toLowerCase() : ''

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: roleFromApi === 'admin',
      loading,
      login,
      logout,
    }),
    [token, user, roleFromApi, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

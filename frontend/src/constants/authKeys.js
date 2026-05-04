/** localStorage keys for JWT and user profile (backend integration). */
export const AUTH_TOKEN_KEY = 'token'
export const AUTH_USER_KEY = 'user'

const LEGACY_TOKEN_KEY = 'ttm_token'
const LEGACY_USER_KEY = 'ttm_user'

function migrateLegacyIfNeeded() {
  if (!localStorage.getItem(AUTH_TOKEN_KEY) && localStorage.getItem(LEGACY_TOKEN_KEY)) {
    localStorage.setItem(AUTH_TOKEN_KEY, localStorage.getItem(LEGACY_TOKEN_KEY))
    localStorage.removeItem(LEGACY_TOKEN_KEY)
  }
  if (!localStorage.getItem(AUTH_USER_KEY) && localStorage.getItem(LEGACY_USER_KEY)) {
    localStorage.setItem(AUTH_USER_KEY, localStorage.getItem(LEGACY_USER_KEY))
    localStorage.removeItem(LEGACY_USER_KEY)
  }
}

export function readStoredSession() {
  migrateLegacyIfNeeded()
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const rawUser = localStorage.getItem(AUTH_USER_KEY)
  let user = null
  if (rawUser) {
    try {
      user = JSON.parse(rawUser)
    } catch {
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }
  return { token, user }
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
}

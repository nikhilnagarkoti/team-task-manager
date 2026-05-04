import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const THEME_KEY = 'team-task-manager-theme'
const ThemeContext = createContext(null)

function readStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)
  const isDark = theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(THEME_KEY, theme)
  }, [isDark, theme])

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [isDark, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

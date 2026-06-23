import { createContext, useEffect, useMemo, useState } from 'react'

const initialTheme = 'light'
export const ThemeContext = createContext({
  theme: initialTheme,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('bookverse-theme')
    return stored || initialTheme
  })

  useEffect(() => {
  localStorage.setItem('bookverse-theme', theme)

  document.documentElement.classList.toggle('dark', theme === 'dark')
}, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

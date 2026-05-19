import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type ThemeContextValue = {
  dark: boolean
  toggle: () => void
  setDark: (d: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dark, setDarkState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      // legacy key used by older clients
      const legacy = localStorage.getItem('darkMode')
      if (legacy === 'true') return true
      if (legacy === 'false') return false
    } catch {}
    // default to light if no explicit preference stored
    return false
  })

  const apply = useCallback((d: boolean) => {
    const doc = document.documentElement
    // add a short transition class for smoothness
    doc.classList.add('theme-transition')
    if (d) doc.classList.add('dark')
    else doc.classList.remove('dark')
    try { localStorage.setItem('theme', d ? 'dark' : 'light') } catch {}
    // remove transition class shortly after
    window.setTimeout(() => doc.classList.remove('theme-transition'), 300)
  }, [])

  useEffect(() => apply(dark), [dark, apply])

  // System preference detection removed: theme will only follow explicit user choice stored in localStorage

  const toggle = useCallback(() => setDarkState(s => !s), [])
  const setDark = useCallback((d: boolean) => setDarkState(d), [])

  return (
    <ThemeContext.Provider value={{ dark, toggle, setDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export default ThemeContext

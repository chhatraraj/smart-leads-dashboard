import { create } from 'zustand'

interface UIState {
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => {
    const next = !get().darkMode
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
    set({ darkMode: next })
  },
}))
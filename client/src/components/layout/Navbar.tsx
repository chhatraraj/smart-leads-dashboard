// React import not required with the new JSX transform
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth.service'
import Button from '../ui/Button'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  const handleLogout = async () => {
    try {
      await authService.logout()
      clearAuth()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const theme = dark ? 'dark' : 'light'

  return (
    <nav className="h-16 border-b border-gray-100 dark:border-gray-800/60 bg-white/90 dark:bg-[#0E1322]/80 backdrop-blur-md px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-colors duration-200">
      {/* Brand Identity */}
      <Link to="/" className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400 hover:opacity-90 transition-opacity">
        Smart Leads
      </Link>
      
      {/* Action Items */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4 border-r border-gray-100 dark:border-gray-800 pr-4">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
              {(() => {
                const role = user.role ?? 'sales_user'
                const label = role.replace('_', ' ').split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')
                const badgeClasses = role === 'admin'
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60'
                return (
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${badgeClasses}`} aria-label={`role-${role}`}>
                    {label}
                  </span>
                )
              })()}

            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Admin Panel Quick Link */}
            {user.role === 'admin' && (
              <Link to="/admin" className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 px-2.5 py-1.5 rounded-lg border border-gray-200/40 dark:border-gray-800 transition-colors">
                Admin Panel
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Login</Link>
            <Link to="/register">
              <Button size="sm" className="px-3 py-1.5">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

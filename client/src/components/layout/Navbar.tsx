import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { authService } from '../../services/auth.service'
import Button from '../ui/Button'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const { darkMode, toggleDarkMode } = useUIStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.logout()
    clearAuth()
    navigate('/login')
  }

  return (
    <nav className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">
      <Link to="/" className="text-xl font-bold text-indigo-600">GigFlow</Link>
      <div className="flex items-center gap-3">
        <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">{user?.name}</span>
        <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full capitalize">{user?.role}</span>
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">Admin</Link>
        )}
        <Button variant="secondary" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  )
}
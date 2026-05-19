import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Sidebar() {
  const { user } = useAuthStore()

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 pt-20 fixed left-0 top-0 bottom-0 z-30">
      <div className="mb-6 px-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workspace</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quick access to common workflows</p>
      </div>
      <nav className="flex flex-col gap-2">
        <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Admin Panel</Link>
        )}
      </nav>
    </aside>
  )
}

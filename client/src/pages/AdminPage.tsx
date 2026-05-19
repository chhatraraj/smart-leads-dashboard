import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { User } from '../types'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'

export default function AdminPage() {
  const { user: me } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<{ data: User[] }>('/users').then(r => r.data.data),
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.patch(`/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>← Dashboard</Button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {['Name','Email','Role','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data?.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 capitalize">{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      {u._id !== me?._id ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => changeRole.mutate({ id: u._id, role: u.role === 'admin' ? 'sales_user' : 'admin' })}>
                            Make {u.role === 'admin' ? 'Sales' : 'Admin'}
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => { if (confirm('Delete user?')) deleteUser.mutate(u._id) }}>Delete</Button>
                        </div>
                      ) : <span className="text-xs text-gray-400">You</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
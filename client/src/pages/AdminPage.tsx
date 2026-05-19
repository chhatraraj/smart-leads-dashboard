import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import type { User } from '../types'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { useState } from 'react'

export default function AdminPage() {
  const { user: me } = useAuthStore()
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

  const createUser = useMutation({
    mutationFn: (payload: { name: string; email: string; password: string; role: string }) => api.post('/users', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin'|'sales_user'>('sales_user')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <Sidebar />
      <main className="pt-16 lg:pl-64 max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <div>
            <Button onClick={() => setShowCreate(true)}>+ New User</Button>
          </div>
        </div>
        <div className="mb-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Admin role policy</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only existing admins may promote users to the admin role. Promotions are audited and should be granted sparingly.</p>
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
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create new user">
        <div className="flex flex-col gap-4">
          <Input label="Full name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as any)} className="mt-2 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-600 text-sm">
              <option value="sales_user">Sales User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button loading={createUser.isLoading} onClick={() => {
              createUser.mutate({ name, email, password, role }, { onSuccess: () => setShowCreate(false) })
            }}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
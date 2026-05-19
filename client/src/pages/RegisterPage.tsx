import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/authStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need number'),
  role: z.enum(['admin', 'sales_user']),
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'sales_user' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await authService.register(data)
      setAuth(res.data.data.user, res.data.data.accessToken)
      navigate('/')
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join GigFlow today</p>
        {error && <p className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Full Name" {...register('name')} error={errors.name?.message} placeholder="John Doe" />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="Min 8 chars, 1 uppercase, 1 number" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select {...register('role')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="sales_user">Sales User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">Create account</Button>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          Have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
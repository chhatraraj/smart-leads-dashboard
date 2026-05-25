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
  email: z.string().email(),
  password: z.string().min(1),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [error, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Smooth autofill function for dev testing
  const handleAutofillAdmin = () => {
    setValue('email', 'chhatraneupane999@gmail.com', { shouldValidate: true })
    setValue('password', 'Chhatradai1', { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    try {
      setFormError('')
      const res = await authService.login(data)
      setAuth(res.data.data.user, res.data.data.accessToken)
      navigate('/app')
    } catch (e: any) {
      const status = e.response?.status
      const message = e.response?.data?.message
      if (status === 401) {
        setFormError(message ?? 'Invalid email or password. Please check your credentials and try again.')
      } else if (status === 400) {
        setFormError(message ?? 'Invalid request. Please check the form and try again.')
      } else {
        setFormError(message ?? 'Login failed. Please try again later.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to GigFlow</p>
        
        {error && (
          <p className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input 
            label="Email" 
            type="email" 
            {...register('email')} 
            error={errors.email?.message} 
            placeholder="admin@gigflow.com" 
          />
          
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={errors.password?.message}
            placeholder="••••••••"
            trailing={
              <button 
                type="button" 
                onClick={() => setShowPassword(s => !s)} 
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-300"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3C6 3 2.73 5.11 1 8.5c.73 1.45 1.9 2.66 3.36 3.5A9.97 9.97 0 0010 15c4 0 7.27-2.11 9-5.5C17.27 5.11 14 3 10 3z" />
                    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88A3 3 0 0112 9c1.38 0 2.5 1.12 2.5 2.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.12 14.12A3 3 0 0112 15a3 3 0 01-2.5-2.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12.5C4.23 15.89 7.5 18 11.5 18c.93 0 1.82-.13 2.66-.36" />
                  </svg>
                )}
              </button>
            }
          />
          <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          No account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </p>

        {/* Clean, Interactive Dev Testing Access Section */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            type="button"
            onClick={handleAutofillAdmin}
            className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 rounded-xl transition-all border border-gray-200/60 dark:border-gray-700/60 group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Dev Testing Access
              </span>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                Autofill 
              </span>
            </div>
            <div className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">
              Email: chhatraneupane999@gmail.com
            </div>
            <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">
              Pass:  Chhatradai1
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}

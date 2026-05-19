import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends cookies (refresh token)
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 — try refresh, then retry original request once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // If the request was to auth endpoints (login/register/refresh), don't try to refresh
    const url = original?.url || ''
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')
    if (isAuthRoute) return Promise.reject(error)

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        const newToken = data.data.accessToken
        useAuthStore.getState().setAccessToken(newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        // Let the original request handler deal with showing an error or redirecting
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api
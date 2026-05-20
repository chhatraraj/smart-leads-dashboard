import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const rawApi = import.meta.env.VITE_API_URL || ''
const clean = rawApi.replace(/\/+$/g, '') // remove trailing slashes
const base = rawApi ? `${clean}/api` : '/api'

if (import.meta.env.DEV) {
  // Helpful debug: show which base URL the client will use
  // eslint-disable-next-line no-console
  console.debug('[api] baseURL:', base)
}

const api = axios.create({
  baseURL: base,
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
        const refreshUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/auth/refresh`
          : '/api/auth/refresh'
        const { data } = await axios.post(refreshUrl, {}, { withCredentials: true })
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
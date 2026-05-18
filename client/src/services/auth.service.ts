import api from './api'
import { User } from '../types'

export const authService = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<{ data: { user: User; accessToken: string } }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ data: { user: User; accessToken: string } }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ data: { user: User } }>('/auth/me'),
}
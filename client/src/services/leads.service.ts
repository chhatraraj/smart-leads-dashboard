import api from './api'
import type { Lead, LeadFilters, LeadsResponse, ApiResponse } from '../types'

export const leadsService = {
  getAll: (filters: LeadFilters = {}) =>
    api.get<LeadsResponse>('/leads', { params: filters }),

  getOne: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  create: (data: Partial<Lead>) =>
    api.post<ApiResponse<Lead>>('/leads', data),

  update: (id: string, data: Partial<Lead>) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Lead>>(`/leads/${id}/status`, { status }),

  delete: (id: string) =>
    api.delete(`/leads/${id}`),

  exportCSV: async (filters: LeadFilters = {}) => {
    const response = await api.get('/export/leads/csv', {
      params: filters as any,
      responseType: 'blob',
    })

    const disposition = response.headers['content-disposition'] || ''
    const match = /filename="?([^";]+)"?/.exec(disposition)
    const filename = match ? match[1] : `leads-${Date.now()}.csv`

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
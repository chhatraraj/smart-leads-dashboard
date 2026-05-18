import api from './api'
import { Lead, LeadFilters, LeadsResponse, ApiResponse } from '../types'

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

  exportCSV: (filters: LeadFilters = {}) => {
    const params = new URLSearchParams(filters as any).toString()
    window.open(`/api/export/leads/csv?${params}`, '_blank')
  },
}
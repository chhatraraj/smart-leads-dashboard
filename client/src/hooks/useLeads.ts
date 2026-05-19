import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsService } from '../services/leads.service'
import type { LeadFilters } from '../types'

export const useLeads = (filters: LeadFilters) =>
  useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadsService.getAll(filters).then(r => r.data),
    staleTime: 30_000,
  })

export const useCreateLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: leadsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export const useUpdateLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => leadsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export const useDeleteLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: leadsService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}
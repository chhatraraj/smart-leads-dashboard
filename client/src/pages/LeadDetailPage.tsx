import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { leadsService } from '../services/leads.service'
import Navbar from '../components/layout/Navbar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsService.getOne(id!).then(r => r.data.data),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="pt-16 max-w-2xl mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">← Back</Button>
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : data ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{data.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{data.email}</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Status', value: <Badge value={data.status} /> },
                { label: 'Source', value: <Badge value={data.source} /> },
                { label: 'Created By', value: data.createdBy?.name },
                { label: 'Created At', value: new Date(data.createdAt).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                  <div className="text-sm text-gray-900 dark:text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Lead not found.</p>
        )}
      </main>
    </div>
  )
}
import { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import { useDebounce } from '../hooks/useDebounce'
import type { LeadFilters } from '../types'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import FilterBar from '../components/filters/FilterBar'
import LeadTable from '../components/leads/LeadTable'
import Modal from '../components/ui/Modal'
import LeadForm from '../components/leads/LeadForm'
import Button from '../components/ui/Button'

export default function DashboardPage() {
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, sort: 'latest', limit: 10 })
  const [rawSearch, setRawSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const debouncedSearch = useDebounce(rawSearch, 300)
  const activeFilters = { ...filters, search: debouncedSearch || undefined }
  const { data, isLoading, isError } = useLeads(activeFilters)

  // Analytics helpers (computed from fetched page of leads)
  const totalLeads = data?.meta?.total ?? 0
  const qualified = (data?.leads ?? []).filter(l => l.status === 'Qualified').length
  const conversionRate = totalLeads > 0 ? Math.round((qualified / totalLeads) * 100) : 0
  const sourceCounts = (data?.leads ?? []).reduce<Record<string, number>>((acc, l) => { acc[l.source] = (acc[l.source] || 0) + 1; return acc }, {})
  const topSource = Object.entries(sourceCounts).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—'

  const updateFilters = (f: Partial<LeadFilters>) => setFilters(prev => ({ ...prev, ...f }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <Sidebar />
      <main className="pt-16 lg:pl-64 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            {data && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{data.meta.total} total leads</p>}
          </div>
          <Button onClick={() => setShowCreate(true)}>+ New Lead</Button>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500">Total Active Leads</p>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{totalLeads}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{conversionRate}%</div>
            <p className="text-xs text-gray-400 mt-1">{qualified} qualified</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500">Most Effective Source</p>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{topSource}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <FilterBar
            filters={activeFilters}
            onChange={updateFilters}
            search={rawSearch}
            onSearchChange={v => { setRawSearch(v); updateFilters({ page: 1 }) }}
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-red-500">Failed to load leads. Please try again.</div>
          ) : (
            <LeadTable leads={data?.leads ?? []} />
          )}
          {/* Pagination/footer showing entries and basic controls (10 per page) */}
          {data && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.meta.total === 0 ? (
                  <>Showing 0 of 0 entries</>
                ) : (
                  <>
                    {((data.meta.page - 1) * data.meta.limit) + 1}-{Math.min(data.meta.page * data.meta.limit, data.meta.total)} of {data.meta.total} entries
                  </>
                )}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={data.meta.page <= 1} onClick={() => updateFilters({ page: data.meta.page - 1 })}>← Prev</Button>
                <Button size="sm" variant="secondary" disabled>{data.meta.page}</Button>
                <Button size="sm" variant="secondary" disabled={data.meta.page >= data.meta.pages} onClick={() => updateFilters({ page: data.meta.page + 1 })}>Next →</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Lead">
        <LeadForm onClose={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
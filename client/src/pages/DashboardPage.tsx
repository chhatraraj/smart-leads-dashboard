import { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import { useDebounce } from '../hooks/useDebounce'
import type { LeadFilters } from '../types'
import Navbar from '../components/layout/Navbar'
import FilterBar from '../components/filters/FilterBar'
import LeadTable from '../components/leads/LeadTable'
import Modal from '../components/ui/Modal'
import LeadForm from '../components/leads/LeadForm'
import Button from '../components/ui/Button'

export default function DashboardPage() {
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, sort: 'latest' })
  const [rawSearch, setRawSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const debouncedSearch = useDebounce(rawSearch, 400)

  const activeFilters = { ...filters, search: debouncedSearch || undefined }
  const { data, isLoading, isError } = useLeads(activeFilters)

  const updateFilters = (f: Partial<LeadFilters>) => setFilters(prev => ({ ...prev, ...f }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            {data && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{data.meta.total} total leads</p>}
          </div>
          <Button onClick={() => setShowCreate(true)}>+ New Lead</Button>
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

          {/* Pagination */}
          {data && data.meta.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {data.meta.page} of {data.meta.pages}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={data.meta.page <= 1} onClick={() => updateFilters({ page: data.meta.page - 1 })}>← Prev</Button>
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
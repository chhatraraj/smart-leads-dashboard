import type { LeadFilters } from '../../types'
import { leadsService } from '../../services/leads.service'

interface Props {
  filters: LeadFilters
  onChange: (f: Partial<LeadFilters>) => void
  search: string
  onSearchChange: (v: string) => void
}

export default function FilterBar({ filters, onChange, search, onSearchChange }: Props) {
  const select = "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search name or email..."
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
      />
      <select value={filters.status ?? ''} onChange={e => onChange({ status: e.target.value || undefined, page: 1 })} className={select}>
        <option value="">All Status</option>
        {['New','Contacted','Qualified','Lost'].map(s => <option key={s}>{s}</option>)}
      </select>
      <select value={filters.source ?? ''} onChange={e => onChange({ source: e.target.value || undefined, page: 1 })} className={select}>
        <option value="">All Sources</option>
        {['Website','Instagram','Referral'].map(s => <option key={s}>{s}</option>)}
      </select>
      <select value={filters.sort ?? 'latest'} onChange={e => onChange({ sort: e.target.value as any, page: 1 })} className={select}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
      {(filters.status || filters.source || filters.search) && (
        <button onClick={() => onChange({ status: undefined, source: undefined, search: undefined, page: 1 })} className="text-sm text-red-500 hover:underline">
          Clear filters
        </button>
      )}
      <button onClick={() => leadsService.exportCSV(filters)} className="ml-auto px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        ⬇ Export CSV
      </button>
    </div>
  )
}
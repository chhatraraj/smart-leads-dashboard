import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Lead } from '../../types'
import { useAuthStore } from '../../store/authStore'
import { useDeleteLead } from '../../hooks/useLeads'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import LeadForm from './LeadForm'
import ConfirmModal from '../ui/ConfirmModal'

export default function LeadTable({ leads }: { leads: Lead[] }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const deleteLead = useDeleteLead()
  const [editing, setEditing] = useState<Lead | null>(null)
  const [toDelete, setToDelete] = useState<Lead | null>(null)

  if (leads.length === 0) return (
    <div className="text-center py-16 text-gray-400 dark:text-gray-500">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-medium">No leads found</p>
      <p className="text-sm mt-1">Try adjusting your filters or create a new lead</p>
    </div>
  )

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {['Name','Email','Status','Source','Created By','Date','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leads.map(lead => (
              <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" onClick={() => navigate(`/leads/${lead._id}`)}>{lead.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.email}</td>
                <td className="px-4 py-3"><Badge value={lead.status} /></td>
                <td className="px-4 py-3"><Badge value={lead.source} /></td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.createdBy?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(lead)}>Edit</Button>
                    {user?.role === 'admin' && (
                          <Button size="sm" variant="danger" onClick={() => setToDelete(lead)}>Del</Button>
                        )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Lead">
        {editing && <LeadForm lead={editing} onClose={() => setEditing(null)} />}
      </Modal>

      <ConfirmModal
        open={!!toDelete}
        title="Delete lead"
        message={toDelete ? `Delete lead “${toDelete.name}”? This cannot be undone.` : undefined}
        loading={deleteLead.status === 'pending'}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          deleteLead.mutate(toDelete._id, { onSuccess: () => setToDelete(null) })
        }}
      />
    </>
  )
}
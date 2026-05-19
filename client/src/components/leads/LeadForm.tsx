import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Lead } from '../../types'
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads'
import Input from '../ui/Input'
import Button from '../ui/Button'

const schema = z.object({
  name:   z.string().min(2),
  email:  z.string().email(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
})
type FormData = z.infer<typeof schema>

interface Props { lead?: Lead; onClose: () => void }

export default function LeadForm({ lead, onClose }: Props) {
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()
  const isEdit = !!lead

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: lead ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source } : { status: 'New' },
  })

  const onSubmit = async (data: FormData) => {
    if (isEdit) await updateLead.mutateAsync({ id: lead._id, data })
    else await createLead.mutateAsync(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Name" {...register('name')} error={errors.name?.message} placeholder="John Doe" />
      <Input label="Email" {...register('email')} error={errors.email?.message} placeholder="john@example.com" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select {...register('status')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {['New','Contacted','Qualified','Lost'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
        <select {...register('source')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {['Website','Instagram','Referral'].map(s => <option key={s}>{s}</option>)}
        </select>
        {errors.source && <p className="text-xs text-red-500">{errors.source.message}</p>}
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting} className="flex-1">{isEdit ? 'Update Lead' : 'Create Lead'}</Button>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  )
}
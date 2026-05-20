import React from 'react'
import Modal from './Modal'
import Button from './Button'

interface Props {
  open: boolean
  title?: string
  message?: string | React.ReactNode
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({ open, title = 'Are you sure?', message, loading, onConfirm, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  )
}

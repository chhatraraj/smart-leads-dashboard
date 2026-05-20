import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  trailing?: ReactNode
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', trailing, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <div className="relative">
      <input
        ref={ref}
        {...props}
        className={`w-full pr-10 px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}
          focus:outline-none focus:ring-2 focus:border-transparent ${className}`}
      />
      {trailing && (
        <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
      )}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
))
Input.displayName = 'Input'
export default Input
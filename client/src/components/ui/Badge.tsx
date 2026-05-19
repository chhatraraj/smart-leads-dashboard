const colors: Record<string, string> = {
  New:       'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Lost:      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  Website:   'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  Referral:  'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

export default function Badge({ value }: { value: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] ?? 'bg-gray-100 text-gray-700'}`}>
      {value}
    </span>
  )
}
export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-600 dark:text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600 dark:border-blue-950 dark:border-t-blue-400" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

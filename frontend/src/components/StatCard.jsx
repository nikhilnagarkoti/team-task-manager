const variants = {
  indigo: {
    ring: 'ring-blue-500/15',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
    accent: 'text-blue-600 dark:text-blue-300',
    glow: 'group-hover:bg-blue-50/80 dark:group-hover:bg-blue-950/30',
  },
  emerald: {
    ring: 'ring-emerald-500/15',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
    accent: 'text-blue-600 dark:text-blue-300',
    glow: 'group-hover:bg-blue-50/80 dark:group-hover:bg-blue-950/30',
  },
  rose: {
    ring: 'ring-rose-500/15',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
    accent: 'text-blue-600 dark:text-blue-300',
    glow: 'group-hover:bg-blue-50/80 dark:group-hover:bg-blue-950/30',
  },
}

export default function StatCard({ title, value, icon, variant = 'indigo' }) {
  const v = variants[variant] ?? variants.indigo

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm ring-1 ${v.ring} transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-blue-950 dark:bg-neutral-950 dark:hover:border-blue-800`}
    >
      <div className={`pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${v.glow}`} aria-hidden />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl ${v.accent}`}>
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 ${v.iconBg}`}
          aria-hidden
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export function IconClipboard() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      />
    </svg>
  )
}

export function IconCheckCircle() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export function IconAlertClock() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

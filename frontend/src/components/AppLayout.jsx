import Sidebar from './Sidebar'

export default function AppLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-black dark:text-slate-100 lg:flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
          {children}
        </div>
      </main>
    </div>
  )
}

import { ChartBar, Users, BookOpen, ShieldCheck } from 'lucide-react'
import { useAsyncData } from '../hooks/useAsyncData'
import { getAdminDashboard, setBookApproval } from '../services/api'
import { toast } from 'react-hot-toast'

const icons = [Users, BookOpen, ShieldCheck, ChartBar]

export default function AdminDashboard() {
  const { data, setData } = useAsyncData(getAdminDashboard, [])
  const stats = data?.stats || []
  const pendingBooks = data?.pendingBooks || []

  const updateApproval = async (bookId, status) => {
    await setBookApproval(bookId, status)
    setData(await getAdminDashboard())
    toast.success(`Book ${status.toLowerCase()}`)
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Platform overview</h1>
          </div>
          <a href="/admin/books" className="rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">Review pending books</a>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = icons[index] || Users
          return (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60">
              <div className="flex items-center gap-3 text-violet-600 dark:text-violet-300">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.title}</p>
              </div>
              <p className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
            </div>
          )
        })}
      </div>
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Pending paid books</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Approvals</h2>
          </div>
          <button onClick={async () => setData(await getAdminDashboard())} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500/60 dark:hover:bg-slate-800 dark:hover:text-violet-200">Refresh</button>
        </div>
        <div className="mt-8 space-y-4">
          {pendingBooks.map((book) => (
            <div key={book.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/60 dark:hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950 dark:text-white">{book.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Awaiting admin approval</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => updateApproval(book.id, 'APPROVED')} className="rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">Approve</button>
                <button onClick={() => updateApproval(book.id, 'REJECTED')} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-rose-500/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-200">Reject</button>
              </div>
            </div>
          ))}
          {pendingBooks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No pending approvals right now.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

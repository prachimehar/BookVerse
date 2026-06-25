import { BarChart3, Users, Bookmark, DollarSign } from 'lucide-react'
import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../hooks/useAuth'
import { getWriterDashboard } from '../services/api'

const icons = [Bookmark, Users, DollarSign, BarChart3]

export default function WriterDashboard() {
  const { user, role } = useAuth()
  const { data } = useAsyncData(getWriterDashboard, null, [user?.id, role])
  const stats = data?.stats || []
  const recentBooks = data?.recentBooks || []
  const pendingBooks = data?.pendingBooks || []

  return (
    <div className="space-y-10">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Writer dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Welcome back</h1>
          </div>
          <a href="/writer/create-book" className="inline-flex items-center justify-center rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">Create New Book</a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = icons[index] || Bookmark
          return (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3 text-violet-600">
                <Icon className="h-6 w-6" />
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.title}</p>
              </div>
              <p className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Recent books</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Latest releases</h2>
            </div>
            <a href="/writer/books" className="rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">View all</a>
          </div>
          <div className="mt-8 space-y-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">{book.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{book.genre}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">{book.approvalStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Pending approval</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Waiting for admin review</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">Monitor drafts and submissions, then prepare for your next launch.</p>
          <div className="mt-8 space-y-4">
            {pendingBooks.map((book) => (
              <div key={book.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{book.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{book.approvalStatus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

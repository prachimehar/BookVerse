
import { Link } from 'react-router-dom'
import { PenSquare } from 'lucide-react'
import WriterCard from '../components/ui/WriterCard'
import { useAsyncData } from '../hooks/useAsyncData'
import { ROUTES } from '../constants/routes'
import { getWriters } from '../services/api'

export default function Writers() {
  const { data: writers = [] } = useAsyncData(getWriters, [])

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Creators</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Writers</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Discover and follow writers who share stories you'll love.</p>
          </div>
          <Link
            to={ROUTES.WRITER_CREATE_BOOK}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200/60 transition hover:bg-violet-500 dark:bg-violet-500 dark:shadow-black/20 dark:hover:bg-violet-400"
          >
            <PenSquare className="h-4 w-4" />
            Create Book
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {writers.map((writer) => (
          <WriterCard key={writer.id} writer={writer} />
        ))}
        {writers.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 md:col-span-2 xl:col-span-4">
            No writers found.
          </div>
        )}
      </div>
    </div>
  )
}

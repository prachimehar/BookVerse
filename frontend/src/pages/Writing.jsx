import { useMemo, useState } from 'react'
import { Feather } from 'lucide-react'
import { getPublicWritings } from '../services/api'
import { useAsyncData } from '../hooks/useAsyncData'

const filters = [
  { label: 'All', value: 'ALL' },
  { label: 'Poems', value: 'POEM' },
  { label: 'Thoughts', value: 'THOUGHT' },
]

export default function Writing() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const loader = useMemo(() => {
    return () => getPublicWritings(activeFilter === 'ALL' ? {} : { type: activeFilter })
  }, [activeFilter])
  const { data: writings = [], loading } = useAsyncData(loader, [], [loader])

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Community writing</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Poems and thoughts from BookVerse writers</h1>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
            <Feather className="h-5 w-5" />
          </span>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
              activeFilter === filter.value
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-violet-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {writings.map((writing) => (
          <article key={writing.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">{writing.type}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">{writing.authorName || 'BookVerse writer'}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{writing.title || 'Untitled writing'}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{writing.content}</p>
          </article>
        ))}
      </section>

      {!loading && writings.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No approved public writing yet.
        </div>
      )}
    </div>
  )
}

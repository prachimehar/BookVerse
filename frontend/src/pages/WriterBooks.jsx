import { Link } from 'react-router-dom'
import { useAsyncData } from '../hooks/useAsyncData'
import { getWriterBooks } from '../services/api'

export default function WriterBooks() {
  const { data: books = [] } = useAsyncData(getWriterBooks, [])

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Writer books</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Your stories</h1>
          </div>
          <Link to="/writer/create-book" className="rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">Create New Book</Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <Link to={`/writer/edit-book/${book.id}`} key={book.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{book.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book.approvalStatus}</p>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">{book.price === 0 ? 'Free' : 'Paid'}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span>{book.genre}</span>
              <span>{book.rating} stars</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

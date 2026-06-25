import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../hooks/useAuth'
import { getAdminBooks, setBookApproval } from '../services/api'
import { toast } from 'react-hot-toast'

export default function AdminBooks() {
  const { user, role } = useAuth()
  const { data: books = [], setData } = useAsyncData(getAdminBooks, [], [user?.id, role])

  const updateApproval = async (bookId, status) => {
    await setBookApproval(bookId, status)
    setData(await getAdminBooks())
    toast.success(`Book ${status.toLowerCase()}`)
  }

  return (
    <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Books</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Review submitted books</h1>
        </div>
      </div>
      <div className="mt-8 grid gap-4">
        {books.map((book) => (
          <div key={book.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/60 dark:hover:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">{book.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{book.approvalStatus}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateApproval(book.id, 'APPROVED')} className="rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">Approve</button>
                <button onClick={() => updateApproval(book.id, 'REJECTED')} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-rose-500/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-200">Reject</button>
              </div>
            </div>
          </div>
        ))}
        {books.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No submitted books to review.
          </div>
        )}
      </div>
    </div>
  )
}

import BookCard from '../components/ui/BookCard'
import { useAsyncData } from '../hooks/useAsyncData'
import { getLibrary } from '../services/api'

export default function Library() {
  const { data: books = [] } = useAsyncData(getLibrary, [])

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">My Library</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Access your bookmarked reads, continue where you left off, and revisit favorites.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

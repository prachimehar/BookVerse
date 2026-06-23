import { useEffect, useState } from 'react'
import BookCard from '../components/ui/BookCard'
import { getBooks } from '../services/api'

export default function Search() {
  const [query, setQuery] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([])

  useEffect(() => {
    let active = true
    getBooks({ q: query }).then((books) => {
      if (active) setFilteredBooks(books)
    })
    return () => {
      active = false
    }
  }, [query])

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Search the BookVerse library</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Search by title, author, or theme and discover stories from writers around the world.</p>
        <div className="mt-6 max-w-2xl">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books, authors, or genres"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

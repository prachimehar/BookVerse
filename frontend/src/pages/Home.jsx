import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import BookCard from '../components/ui/BookCard'
import WriterCard from '../components/ui/WriterCard'
import { useAsyncData } from '../hooks/useAsyncData'
import { getBooks, getCategories, getWriters } from '../services/api'

export default function Home() {
  const { data } = useAsyncData(async () => {
    const [books, writers, categories] = await Promise.all([getBooks(), getWriters(), getCategories()])
    return { books, writers, categories }
  }, [])
  const books = data?.books || []
  const writers = data?.writers || []
  const categories = data?.categories || []
  const featuredBooks = books.slice(0, 4)
  const trendingWriters = writers

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
            Premium reading for modern storytellers
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Discover Stories That Stay With You
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Read thousands of books or publish your own masterpiece in a premium community built for readers and writers.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to={ROUTES.BOOKS} className="inline-flex items-center justify-center rounded-3xl bg-violet-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">
              Explore Books
            </Link>
            <Link to={ROUTES.WRITER_CREATE_BOOK} className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:text-violet-300">
              Start Writing
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[36px] bg-violet-600 px-8 py-10 text-white shadow-2xl shadow-violet-500/20 sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_42%)]" />
          <div className="relative space-y-6">
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Curated stories from top writers</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">A library shaped for your next chapter</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">
                Experience a warm reading atmosphere with crisp typography, gentle motion, and premium storytelling energy.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white/10 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Featured Authors</p>
                <p className="mt-3 text-sm leading-6 text-white/85">Find writers with loyal followings and meaningful stories.</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Exclusive Collections</p>
                <p className="mt-3 text-sm leading-6 text-white/85">Discover free reads and premium publications side by side.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Featured Books</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Stories for every mood</h2>
          </div>
          <Link to={ROUTES.BOOKS} className="text-sm font-semibold text-violet-600 transition hover:text-violet-500">
            Browse all books
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Trending Writers</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Creators people love</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trendingWriters.map((writer) => (
            <WriterCard key={writer.id} writer={writer} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Categories</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Explore by genre</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category} className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
              {category}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

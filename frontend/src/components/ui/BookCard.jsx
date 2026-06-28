import { useState } from 'react'
import { Bookmark, Star, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { toggleLikeBook } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function BookCard({ book }) {
  const { user } = useAuth()
  const [likedBy, setLikedBy] = useState(book.likedBy || [])
  const [liking, setLiking] = useState(false)

  const isLiked = Boolean(user && likedBy.includes(user.id))

  const handleLike = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!user) {
      toast.error('Please log in to like books')
      return
    }

    if (liking) return
    setLiking(true)

    const wasLiked = isLiked
    setLikedBy((current) =>
      wasLiked ? current.filter((uid) => uid !== user.id) : [...current, user.id]
    )

    try {
      const updated = await toggleLikeBook(book.id)
      setLikedBy(updated.likedBy || [])
    } catch {
      setLikedBy((current) =>
        wasLiked ? [...current, user.id] : current.filter((uid) => uid !== user.id)
      )
      toast.error('Unable to update like')
    } finally {
      setLiking(false)
    }
  }

  return (
    <article className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <Link to={`/books/${book.id}`} className="block overflow-hidden rounded-[32px]">
        <img src={book.cover} alt={book.title} className="h-72 w-full object-cover transition duration-300 group-hover:scale-105" />
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-violet-600">{book.genre}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{book.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">by {book.author}</p>
          </div>
          <button
            onClick={handleLike}
            disabled={liking}
            aria-label={isLiked ? 'Unlike book' : 'Like book'}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-3xl border transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isLiked
                ? 'border-violet-300 bg-violet-50 text-violet-600 dark:border-violet-500/60 dark:bg-violet-900/40 dark:text-violet-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Star className="h-3.5 w-3.5 text-amber-400" /> {book.rating}
          </span>
          <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-violet-500' : 'text-violet-500'}`} /> {likedBy.length}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {book.price === 0 ? 'FREE' : `₹${book.price}`}
          </span>
          <Link to={`/books/${book.id}`} className="text-sm font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-300">
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}
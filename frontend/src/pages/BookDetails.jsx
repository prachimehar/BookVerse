import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, Bookmark, Star, ArrowRight, Send } from 'lucide-react'
import { addToLibrary, getBook, getReviews, submitReview } from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function BookDetails() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {

    let active = true

    Promise.all([
      getBook(id),
      getReviews(id)
    ])
      .then(([bookResult, reviewResult]) => {
        if (active) {
          setBook(bookResult)
          setReviews(reviewResult)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }

  }, [id])

  const handleSave = async () => {

    if (!book) return

    if (book.price > 0) {
      navigate(`/checkout/${book.id}`)
      return
    }

    try {
      await addToLibrary(book.id)
      toast.success('Book added to library')
    } catch {
      toast.error('Unable to add book')
    }
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()

    if (!book || !reviewForm.comment.trim()) {
      toast.error('Please write your feedback first')
      return
    }

    setSubmittingReview(true)

    try {
      await submitReview({
        bookId: book.id,
        reviewer: user?.name || 'BookVerse Reader',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=80',
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      })
      setReviewForm({ rating: 5, comment: '' })
      toast.success('Feedback submitted for admin approval')
    } catch {
      toast.error('Unable to submit feedback')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-10 text-center text-slate-700 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-200 dark:shadow-black/20">
        Loading book...
      </div>
    )
  }

  if (!book) {
    return (
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-10 text-center text-slate-700 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-200 dark:shadow-black/20">
        Book not found
      </div>
    )
  }

  return (
    <div className="space-y-10 text-slate-900 dark:text-slate-100">

      <div className="grid gap-10 lg:grid-cols-[360px_1fr]">

        <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20">

          <img
            src={book.cover}
            alt={book.title}
            className="h-[420px] w-full rounded-[28px] object-cover shadow-lg shadow-slate-200/70 dark:shadow-black/30"
          />

          <div className="mt-6 space-y-4">

            <div className="flex flex-wrap items-center gap-3 text-sm">

              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {book.genre}
              </span>

              <span className="rounded-full bg-violet-50 px-3 py-1 font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                {book.price === 0 ? 'Free' : 'Paid'}
              </span>

            </div>

            <div className="flex items-center justify-between gap-4">

              <div>
                <h1 className="text-3xl font-semibold">
                  {book.title}
                </h1>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  by {book.author}
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                {book.rating}
              </span>

            </div>

            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              {book.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              {book.price === 0 ? (
                <>
                  <Link
                    to={`/books/${book.id}/read`}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Read Now
                  </Link>

                  <button
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500/60 dark:hover:bg-slate-800 dark:hover:text-violet-200"
                  >
                    <Bookmark className="h-4 w-4" />
                    Bookmark
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400 sm:col-span-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Buy Now Rs {book.price}
                </button>
              )}

            </div>

          </div>
        </div>

        <div className="space-y-6">

          <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Book details</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Chapters</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Preview the opening chapter before purchase.
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-4">

              {book.chapters?.map((chapter, index) => (
                <li
                  key={chapter.title}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/60 dark:hover:bg-slate-800"
                >
                  <div>

                    {chapter.unlocked ? (
                      <Link
                        to={`/books/${book.id}/read?chapter=${index}`}
                        className="text-sm font-semibold text-slate-950 transition hover:text-violet-700 dark:text-white dark:hover:text-violet-200"
                      >
                        {chapter.title}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">
                        {chapter.title}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chapter {index + 1}
                    </p>

                  </div>

                  {!chapter.unlocked && (
                    <Lock className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                  )}

                </li>
              ))}

            </ul>

          </div>

        </div>
      </div>

      <section className="space-y-6">

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
            What readers are saying
          </h2>

          <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {reviews.length} reviews
          </span>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {reviews.map(review => (
            <div
              key={review.id}
              className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60"
            >

              <div className="flex items-center gap-4">

                <img
                  src={review.avatar}
                  alt={review.reviewer}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>

                  <p className="font-semibold">
                    {review.reviewer}
                  </p>

                  <div className="flex items-center gap-1 text-amber-400">

                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(review.rating)
                            ? 'text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}

                  </div>

                </div>

              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {review.comment}
              </p>

            </div>
          ))}

        </div>

        <form onSubmit={handleReviewSubmit} className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Feedback</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Review this book</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your review will appear after admin approval.</p>
            </div>

            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Rating
              <select
                value={reviewForm.rating}
                onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-32"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating} stars</option>
                ))}
              </select>
            </label>
          </div>

          <textarea
            value={reviewForm.comment}
            onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
            className="mt-5 h-32 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Share what you liked, what stood out, or what other readers should know..."
          />

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submittingReview}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              <Send className="h-4 w-4" />
              {submittingReview ? 'Submitting...' : 'Submit review'}
            </button>
          </div>
        </form>

      </section>

    </div>
  )
}

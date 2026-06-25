import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../hooks/useAuth'
import { getAdminReviews, markReviewReviewed, rejectAdminReview } from '../services/api'

export default function AdminReviews() {
  const { user, role } = useAuth()
  const { data: reviews = [], setData, error } = useAsyncData(getAdminReviews, [], [user?.id, role])
  const [busyReviewId, setBusyReviewId] = useState(null)

  const handleReviewed = async (id) => {
    setBusyReviewId(id)

    try {
      await markReviewReviewed(id)
      setData(await getAdminReviews())
      toast.success('Review approved')
    } catch {
      toast.error('Unable to approve review')
    } finally {
      setBusyReviewId(null)
    }
  }

  const handleReject = async (id) => {
    setBusyReviewId(id)

    try {
      await rejectAdminReview(id)
      setData(await getAdminReviews())
      toast.success('Review rejected')
    } catch {
      toast.error('Unable to reject review')
    } finally {
      setBusyReviewId(null)
    }
  }

  return (
    <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Reviews</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Moderate reviews</h1>
        </div>
        <button onClick={async () => setData(await getAdminReviews())} className="rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">Refresh queue</button>
      </div>
      <div className="mt-8 space-y-4">
        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-200">
            Unable to load reviews. Check that the backend is running and the admin reviews endpoint is reachable.
          </div>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/60 dark:hover:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">{review.comment}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Submitted by {review.reviewer}</p>
                <p className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  {review.reviewed ? 'Approved' : 'Pending'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {!review.reviewed && (
                  <button
                    onClick={() => handleReviewed(review.id)}
                    disabled={busyReviewId === review.id}
                    className="rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleReject(review.id)}
                  disabled={busyReviewId === review.id}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-rose-500/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-200"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No reviews waiting in the queue.
          </div>
        )}
      </div>
    </div>
  )
}

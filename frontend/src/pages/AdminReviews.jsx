import { toast } from 'react-hot-toast'
import { useAsyncData } from '../hooks/useAsyncData'
import { getAdminReviews, markReviewReviewed } from '../services/api'

export default function AdminReviews() {
  const { data: reviews = [], setData } = useAsyncData(getAdminReviews, [])

  const handleReviewed = async (id) => {
    await markReviewReviewed(id)
    setData(await getAdminReviews())
    toast.success('Review marked reviewed')
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
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/60 dark:hover:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">{review.comment}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Submitted by {review.reviewer}</p>
              </div>
              <button onClick={() => handleReviewed(review.id)} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-violet-500/60 dark:hover:bg-slate-800 dark:hover:text-violet-200">Approve review</button>
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

import { Star } from 'lucide-react'

export default function ReviewCard({ review }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-4">
        <img src={review.avatar} alt={review.reviewer} className="h-14 w-14 rounded-full object-cover" />
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{review.reviewer}</h4>
          <div className="mt-1 flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className={`h-4 w-4 ${index < Math.round(review.rating) ? 'text-amber-400' : 'text-slate-300'}`} />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{review.comment}</p>
    </article>
  )
}

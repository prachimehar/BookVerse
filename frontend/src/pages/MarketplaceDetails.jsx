import { useParams } from 'react-router-dom'
import { MapPin, Phone, Tag } from 'lucide-react'
import { useAsyncData } from '../hooks/useAsyncData'
import { getMarketplaceListing } from '../services/api'

function formatCondition(condition) {
  return condition?.replace('_', ' ') || 'GOOD'
}

export default function MarketplaceDetails() {
  const { id } = useParams()
  const { data: listing, loading } = useAsyncData(() => getMarketplaceListing(id), null, [id])
  const image = listing?.images?.[0] || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80'

  if (loading) {
    return (
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-10 text-center text-slate-600 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-300 dark:shadow-black/20">
        Loading listing...
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-10 text-center text-slate-600 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-300 dark:shadow-black/20">
        Listing not found
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20">
        <img src={image} alt={listing.title} className="h-[520px] w-full rounded-[28px] object-cover shadow-lg shadow-slate-200/70 dark:shadow-black/30" />
      </div>

      <section className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
            {formatCondition(listing.condition)}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {listing.genre}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold text-slate-950 dark:text-white">{listing.title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">by {listing.author}</p>

        <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">{listing.description}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Original Price</p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Rs {listing.originalPrice}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Selling Price</p>
            <p className="mt-2 inline-flex items-center gap-2 text-xl font-semibold text-slate-950 dark:text-white">
              <Tag className="h-5 w-5 text-violet-600 dark:text-violet-300" />
              Rs {listing.sellingPrice}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Seller</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{listing.sellerName}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">City</p>
            <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
              <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-300" />
              {listing.city}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Phone className="h-4 w-4 text-violet-600 dark:text-violet-300" />
            {listing.contact}
          </p>
          <a href={`tel:${listing.contact}`} className="inline-flex items-center justify-center rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">
            Contact Seller
          </a>
        </div>
      </section>
    </div>
  )
}

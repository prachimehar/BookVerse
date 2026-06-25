import { Link } from 'react-router-dom'
import { MapPin, Plus, Tag } from 'lucide-react'
import { useAsyncData } from '../hooks/useAsyncData'
import { getMarketplaceListings } from '../services/api'
import { ROUTES } from '../constants/routes'

function formatCondition(condition) {
  return condition?.replace('_', ' ') || 'GOOD'
}

function listingImage(listing) {
  return listing.images?.[0] || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80'
}

export default function Marketplace() {
  const { data: listings = [], loading, error } = useAsyncData(getMarketplaceListings, [])

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Marketplace</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Second-hand physical books</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Find approved used books listed by BookVerse readers.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.MARKETPLACE_MY_LISTINGS} className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-violet-500/60 dark:hover:bg-slate-800">
              My Listings
            </Link>
            <Link to={ROUTES.MARKETPLACE_SELL} className="inline-flex items-center gap-2 rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">
              <Plus className="h-4 w-4" />
              Sell Book
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[36px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-200">
          Unable to load marketplace listings.
        </div>
      )}

      {loading ? (
        <div className="rounded-[36px] border border-slate-200 bg-white/95 p-10 text-center text-slate-600 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-300 dark:shadow-black/20">
          Loading marketplace...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="overflow-hidden rounded-[36px] border border-slate-200 bg-white/95 shadow-sm shadow-slate-200/50 transition hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60">
              <img src={listingImage(listing)} alt={listing.title} className="h-64 w-full object-cover" />
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                    {formatCondition(listing.condition)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <MapPin className="h-3.5 w-3.5" />
                    {listing.city}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{listing.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by {listing.author}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="inline-flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
                    <Tag className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    Rs {listing.sellingPrice}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{listing.sellerName}</p>
                </div>
                <Link to={`/marketplace/${listing.id}`} className="inline-flex w-full items-center justify-center rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="rounded-[36px] border border-dashed border-slate-300 bg-white/95 p-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-400 dark:shadow-black/20">
          No approved marketplace listings yet.
        </div>
      )}
    </div>
  )
}

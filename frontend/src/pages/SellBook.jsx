import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Send } from 'lucide-react'
import { createMarketplaceListing } from '../services/api'
import { useAuth } from '../hooks/useAuth'

const initialForm = {
  title: '',
  author: '',
  genre: '',
  description: '',
  originalPrice: '',
  sellingPrice: '',
  condition: 'GOOD',
  city: '',
  contact: '',
  imageUrl: '',
}

export default function SellBook() {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.author.trim() || !form.sellingPrice || !form.contact.trim()) {
      toast.error('Please complete the required listing details')
      return
    }

    setSubmitting(true)

    try {
      await createMarketplaceListing({
        sellerId: user?.id,
        sellerName: user?.name || 'BookVerse Guest',
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre.trim(),
        description: form.description.trim(),
        originalPrice: Number(form.originalPrice || 0),
        sellingPrice: Number(form.sellingPrice),
        condition: form.condition,
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
        city: form.city.trim(),
        contact: form.contact.trim(),
      })
      setForm(initialForm)
      toast.success('Listing submitted for admin approval')
    } catch {
      toast.error('Unable to submit listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Marketplace</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Sell a used book</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Submit your physical book listing for admin approval.</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Title
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Author
          <input value={form.author} onChange={(event) => updateField('author', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Genre
          <input value={form.genre} onChange={(event) => updateField('genre', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Condition
          <select value={form.condition} onChange={(event) => updateField('condition', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Original Price
          <input type="number" min="0" value={form.originalPrice} onChange={(event) => updateField('originalPrice', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Selling Price
          <input type="number" min="0" value={form.sellingPrice} onChange={(event) => updateField('sellingPrice', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          City
          <input value={form.city} onChange={(event) => updateField('city', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Contact Number
          <input value={form.contact} onChange={(event) => updateField('contact', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
          Image URL
          <input value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
          Description
          <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} className="mt-2 h-36 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400">
          <Send className="h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit Listing'}
        </button>
      </div>
    </form>
  )
}

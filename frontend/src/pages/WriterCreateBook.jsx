import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { createBook } from '../services/api'

export default function WriterCreateBook() {
  const [type, setType] = useState('FREE')
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    tags: '',
    cover: '',
    price: 0,
    chapterTitle: '',
    content: '',
  })
  const navigate = useNavigate()

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const saveBook = async (event, publish = false) => {
    event.preventDefault()

    if (!form.title.trim()) {
      toast.error('Book title is required')
      return
    }

    const book = await createBook({
      title: form.title.trim(),
      description: form.description,
      genre: form.genre,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      cover: form.cover,
      price: type === 'PAID' ? Number(form.price || 0) : 0,
      status: type,
      chapters: [{ title: form.chapterTitle || 'Opening Chapter', unlocked: true, content: form.content }],
    })
    toast.success(publish ? 'Book submitted' : 'Draft saved')
    navigate(`/writer/edit-book/${book.id}`)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Create book</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">New manuscript</h1>
          </div>
          <button onClick={(event) => saveBook(event, false)} className="rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">Save Draft</button>
        </div>
      </div>
      <form className="grid gap-8" onSubmit={(event) => saveBook(event, true)}>
        <div className="grid gap-6 rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Title
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="text" placeholder="Book title" required />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Description
            <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" rows="4" placeholder="A short description of your story" required />
          </label>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Genre
              <input value={form.genre} onChange={(event) => updateField('genre', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="text" placeholder="Fantasy" required />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tags
              <input value={form.tags} onChange={(event) => updateField('tags', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="text" placeholder="Adventure, Romance" />
            </label>
          </div>
          <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Cover URL
            <input value={form.cover} onChange={(event) => updateField('cover', event.target.value)} type="url" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="https://..." />
          </label>
          <div className="grid gap-6 md:grid-cols-3">
            <button type="button" onClick={() => setType('FREE')} className={`rounded-3xl px-5 py-4 text-sm font-semibold transition ${type === 'FREE' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>
              FREE
            </button>
            <button type="button" onClick={() => setType('PAID')} className={`rounded-3xl px-5 py-4 text-sm font-semibold transition ${type === 'PAID' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>
              PAID
            </button>
            {type === 'PAID' && (
              <input value={form.price} onChange={(event) => updateField('price', event.target.value)} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="number" placeholder="Price in Rs" />
            )}
          </div>
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Chapter editor</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Write your first chapter</h2>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={(event) => saveBook(event, false)} className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200">Save Draft</button>
              <button className="rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">Publish</button>
            </div>
          </div>
          <label className="mt-6 block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Chapter title
            <input value={form.chapterTitle} onChange={(event) => updateField('chapterTitle', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="text" placeholder="Chapter title" />
          </label>
          <label className="mt-6 block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Content
            <textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} className="h-64 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="Write your chapter here..."></textarea>
          </label>
        </div>
      </form>
    </div>
  )
}

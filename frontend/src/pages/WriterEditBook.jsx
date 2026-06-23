import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { deleteBook, getBook, updateBook } from '../services/api'

export default function WriterEditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)

  useEffect(() => {
    getBook(id).then(setBook)
  }, [id])

  const updateField = (field, value) => {
    setBook((current) => ({ ...current, [field]: value }))
  }

  const saveChanges = async () => {
    if (!book.title?.trim()) {
      toast.error('Book title is required')
      return
    }

    await updateBook(id, book)
    toast.success('Book updated')
    navigate('/writer/books')
  }

  const handleDeleteBook = async () => {
    const title = book.title?.trim() || 'this untitled book'
    const confirmed = window.confirm(`Delete ${title}? This cannot be undone.`)

    if (!confirmed) {
      return
    }

    await deleteBook(id)
    toast.success('Book deleted')
    navigate('/writer/books')
  }

  const updateChapter = (index, field, value) => {
    setBook((current) => ({
      ...current,
      chapters: current.chapters.map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, [field]: value } : chapter,
      ),
    }))
  }

  const addChapter = () => {
    setBook((current) => ({
      ...current,
      chapters: [
        ...(current.chapters || []),
        {
          title: `Chapter ${(current.chapters || []).length + 1}`,
          unlocked: false,
          content: '',
        },
      ],
    }))
  }

  const deleteChapter = (index) => {
    if ((book.chapters || []).length === 1) {
      toast.error('A book needs at least one chapter')
      return
    }

    setBook((current) => ({
      ...current,
      chapters: current.chapters.filter((_, chapterIndex) => chapterIndex !== index),
    }))
    toast.success('Chapter removed. Save changes to persist it.')
  }

  if (!book) {
    return <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">Loading book...</div>
  }

  return (
    <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Edit book</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Edit {book.title}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDeleteBook} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200">
            <Trash2 className="h-4 w-4" /> Delete book
          </button>
          <button onClick={saveChanges} className="rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">Save changes</button>
        </div>
      </div>
      <div className="mt-8 space-y-6 rounded-[36px] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
        <label className="block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Title
          <input className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" type="text" value={book.title || ''} onChange={(event) => updateField('title', event.target.value)} />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Description
          <textarea className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" rows="4" value={book.description || ''} onChange={(event) => updateField('description', event.target.value)} />
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Genre
            <input className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" type="text" value={book.genre || ''} onChange={(event) => updateField('genre', event.target.value)} />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Price
            <input className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" type="number" value={book.price || 0} onChange={(event) => updateField('price', Number(event.target.value))} />
          </label>
        </div>
      </div>

      <div className="mt-8 rounded-[36px] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Chapters</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Edit manuscript chapters</h2>
          </div>
          <button onClick={addChapter} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">
            <Plus className="h-4 w-4" /> Add chapter
          </button>
        </div>

        <div className="mt-8 space-y-6">
          {(book.chapters || []).map((chapter, index) => (
            <div key={`${chapter.title}-${index}`} className="rounded-[28px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Chapter {index + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{chapter.title || 'Untitled chapter'}</h3>
                </div>
                <button onClick={() => deleteChapter(index)} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>

              <label className="mt-6 block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Chapter title
                <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="text" value={chapter.title || ''} onChange={(event) => updateChapter(index, 'title', event.target.value)} />
              </label>

              <label className="mt-6 block space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Content
                <textarea className="h-56 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" value={chapter.content || ''} onChange={(event) => updateChapter(index, 'content', event.target.value)} />
              </label>

              <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={chapter.unlocked} onChange={(event) => updateChapter(index, 'unlocked', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                Reader can open this chapter
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

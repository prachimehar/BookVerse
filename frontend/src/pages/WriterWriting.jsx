import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { createWriting, deleteWriting, getMyWritings, updateWriting } from '../services/api'
import { useAsyncData } from '../hooks/useAsyncData'
import { useAuth } from '../hooks/useAuth'

const filters = [
  { label: 'All', value: 'ALL' },
  { label: 'Poems', value: 'POEM' },
  { label: 'Thoughts', value: 'THOUGHT' },
  { label: 'Drafts', value: 'DRAFTS' },
]

const initialForm = {
  title: '',
  content: '',
  type: 'POEM',
  visibility: 'PRIVATE',
}

export default function WriterWriting() {
  const { user, role } = useAuth()
  const { data: writings = [], setData } = useAsyncData(getMyWritings, [], [user?.id, role])
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const filteredWritings = useMemo(() => {
    if (activeFilter === 'ALL') {
      return writings
    }

    if (activeFilter === 'DRAFTS') {
      return writings.filter((writing) => writing.visibility === 'PRIVATE' || writing.approvalStatus === 'NOT_REQUIRED')
    }

    return writings.filter((writing) => writing.type === activeFilter)
  }, [activeFilter, writings])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const refresh = async () => {
    setData(await getMyWritings())
  }

  const saveWriting = async (event) => {
    event.preventDefault()

    if (!form.content.trim()) {
      toast.error('Writing content is required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: form.title.trim() || null,
        content: form.content.trim(),
        type: form.type,
        visibility: form.visibility,
      }

      if (editingId) {
        await updateWriting(editingId, payload)
        toast.success('Writing updated')
      } else {
        await createWriting(payload)
        toast.success(form.visibility === 'PUBLIC' ? 'Writing submitted for approval' : 'Writing saved')
      }

      resetForm()
      await refresh()
    } catch (error) {
      const message = error.response?.data?.message || 'Could not save writing'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const editWriting = (writing) => {
    setEditingId(writing.id)
    setForm({
      title: writing.title || '',
      content: writing.content || '',
      type: writing.type || 'POEM',
      visibility: writing.visibility || 'PRIVATE',
    })
  }

  const removeWriting = async (writing) => {
    await deleteWriting(writing.id)
    if (editingId === writing.id) {
      resetForm()
    }
    await refresh()
    toast.success('Writing deleted')
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">My Writing</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Poems and thoughts</h1>
          </div>
          <button onClick={resetForm} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">
            <Plus className="h-4 w-4" />
            Create Writing
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-violet-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredWritings.map((writing) => (
              <article key={writing.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-500/60">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">{writing.type}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">{writing.visibility}</span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">{writing.approvalStatus}</span>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{writing.title || 'Untitled writing'}</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{writing.content}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => editWriting(writing)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-violet-100 hover:text-violet-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-violet-900/40 dark:hover:text-violet-200" aria-label="Edit writing">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeWriting(writing)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-rose-950/50 dark:hover:text-rose-200" aria-label="Delete writing">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredWritings.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                No writings found.
              </div>
            )}
          </div>
        </section>

        <form onSubmit={saveWriting} className="grid gap-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-600">{editingId ? 'Edit writing' : 'Create writing'}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{editingId ? 'Update piece' : 'New piece'}</h2>
          </div>

          <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Title
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" type="text" placeholder="Optional title" />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Content
            <textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} className="h-64 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="Write here..." required />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Type
              <select value={form.type} onChange={(event) => updateField('type', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="POEM">POEM</option>
                <option value="THOUGHT">THOUGHT</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Visibility
              <select value={form.visibility} onChange={(event) => updateField('visibility', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="PRIVATE">PRIVATE</option>
                <option value="PUBLIC">PUBLIC</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button disabled={saving} className="inline-flex flex-1 items-center justify-center rounded-3xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Writing'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-3xl bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

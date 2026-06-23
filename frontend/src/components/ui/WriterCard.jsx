import { UserPlus } from 'lucide-react'

export default function WriterCard({ writer }) {
  return (
    <div className="group rounded-[28px] border border-slate-200 bg-white/95 p-6 text-center shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60">
      <img src={writer.avatar} alt={writer.name} className="mx-auto h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg shadow-slate-200/70 dark:border-slate-800 dark:shadow-black/30" />
      <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{writer.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{writer.bio}</p>
      <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">{writer.followers.toLocaleString()} followers</span>
      </div>
      <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400">
        <UserPlus className="h-4 w-4" /> Follow
      </button>
    </div>
  )
}

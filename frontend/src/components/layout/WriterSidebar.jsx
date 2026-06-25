import { NavLink } from 'react-router-dom'
import { BarChart3, BookOpen, Feather, PenSquare } from 'lucide-react'
import { ROUTES } from '../../constants/routes'

const writerLinks = [
  { name: 'Dashboard', to: ROUTES.WRITER_DASHBOARD, icon: BarChart3 },
  { name: 'My Books', to: ROUTES.WRITER_BOOKS, icon: BookOpen },
  { name: 'My Writing', to: ROUTES.WRITER_WRITING, icon: Feather },
  { name: 'Create Book', to: ROUTES.WRITER_CREATE_BOOK, icon: PenSquare },
]

export function WriterSidebar() {
  return (
    <aside className="w-full rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 lg:sticky lg:top-24 lg:min-h-[calc(100vh-8rem)]">
      <div className="px-2 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Writer</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Workspace</h2>
      </div>

      <nav className="mt-3 grid gap-2">
        {writerLinks.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-200/60 dark:bg-violet-500 dark:shadow-black/20'
                    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-violet-200'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

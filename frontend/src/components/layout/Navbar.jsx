import { Link, NavLink } from 'react-router-dom'
import { Search, User, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import ThemeToggle from './ThemeToggle'

const baseNav = [
  { name: 'Home', to: ROUTES.HOME },
  { name: 'Explore', to: ROUTES.BOOKS },
  { name: 'Writers', to: ROUTES.WRITERS },
  { name: 'Community', to: ROUTES.SEARCH },
]

const writerNavExtra = [
  { name: 'Dashboard', to: ROUTES.WRITER_DASHBOARD },
  { name: 'My Books', to: ROUTES.WRITER_BOOKS },
  { name: 'Create', to: ROUTES.WRITER_CREATE_BOOK },
]

const adminNav = [
  { name: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD },
  { name: 'Users', to: ROUTES.ADMIN_USERS },
  { name: 'Books', to: ROUTES.ADMIN_BOOKS },
  { name: 'Reviews', to: ROUTES.ADMIN_REVIEWS },
]

export function Navbar() {
  const { user, logout, role } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="group inline-flex items-center gap-3 font-semibold text-slate-900 transition hover:text-violet-600 dark:text-slate-100 dark:hover:text-violet-400">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200">
            B
          </span>
          <span className="text-lg sm:text-xl">BookVerse</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {(role === 'writer' ? [...baseNav, ...writerNavExtra] : role === 'admin' ? adminNav : baseNav).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-violet-600 dark:text-violet-300' : 'text-slate-600 hover:text-violet-600 dark:text-slate-300'}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-violet-300 md:inline-flex">
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <Link to={ROUTES.PROFILE} className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name.split(' ')[0]}</span>
          </Link>
          <button onClick={logout} title="Sign out" className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-violet-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-violet-300 md:inline-flex">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

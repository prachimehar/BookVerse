import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import {
  BookMarked,
  BookOpen,
  Compass,
  Home,
  LayoutDashboard,
  MessageCircle,
  Search,
  ShoppingBag,
  Feather,
  User,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import ThemeToggle from './ThemeToggle'

const baseNav = [
  { name: 'Home', to: ROUTES.HOME, icon: Home },
  { name: 'Explore', to: ROUTES.BOOKS, icon: Compass },
  { name: 'Marketplace', to: ROUTES.MARKETPLACE, icon: ShoppingBag },
  { name: 'Writers', to: ROUTES.WRITERS, icon: Users },
  { name: 'Community', to: ROUTES.WRITING, icon: Feather },
]

const adminNav = [
  { name: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { name: 'Users', to: ROUTES.ADMIN_USERS, icon: Users },
  { name: 'Books', to: ROUTES.ADMIN_BOOKS, icon: BookMarked },
  { name: 'Reviews', to: ROUTES.ADMIN_REVIEWS, icon: MessageCircle },
  { name: 'Marketplace', to: ROUTES.ADMIN_MARKETPLACE, icon: ShoppingBag },
]

export function Navbar() {
  const { user, hasRole } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    navigate(query ? `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}` : ROUTES.SEARCH)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center gap-14 py-4 pl-1 pr-3 sm:pl-2 sm:pr-5 lg:gap-20 lg:pl-0 lg:pr-6">
        <Link to={ROUTES.HOME} className="group inline-flex shrink-0 items-center gap-3 font-semibold text-slate-900 transition hover:text-violet-600 dark:text-slate-100 dark:hover:text-violet-400">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm shadow-violet-100 transition group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-900/60 dark:text-violet-200 dark:shadow-none">
            <BookOpen className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="text-lg sm:text-xl">BookVerse</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-8 md:flex">
          {(hasRole('admin') ? adminNav : baseNav).map((item) => {
            const Icon = item.icon
            return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 text-sm font-medium transition ${isActive ? 'text-violet-600 dark:text-violet-300' : 'text-slate-600 hover:text-violet-600 dark:text-slate-300'}`
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 transition focus-within:border-violet-300 focus-within:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus-within:text-violet-300 lg:flex">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="ml-2 w-28 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </form>
          <button
            type="button"
            onClick={handleSearch}
            title="Search"
            className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-violet-300 lg:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <Link to={ROUTES.PROFILE} className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name.split(' ')[0]}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

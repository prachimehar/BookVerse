import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/95 px-4 py-10 text-slate-700 dark:border-slate-800/80 dark:bg-slate-950/95 dark:text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-lg font-semibold text-violet-600 dark:text-violet-300">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200">
              B
            </span>
            BookVerse
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
            A premium space for readers and writers to discover stories, build audiences, and share creative worlds.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 dark:text-slate-100">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to={ROUTES.BOOKS} className="transition hover:text-violet-600">Explore</Link></li>
              <li><Link to={ROUTES.LIBRARY} className="transition hover:text-violet-600">Library</Link></li>
              <li><Link to={ROUTES.PROFILE} className="transition hover:text-violet-600">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 dark:text-slate-100">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="transition hover:text-violet-600">About</a></li>
              <li><a href="#" className="transition hover:text-violet-600">Privacy</a></li>
              <li><a href="#" className="transition hover:text-violet-600">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 dark:text-slate-100">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="transition hover:text-violet-600">Contact</a></li>
              <li><a href="#" className="transition hover:text-violet-600">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 dark:text-slate-100">Follow</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">Stay inspired with curated reading lists, writing tips, and premium features.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

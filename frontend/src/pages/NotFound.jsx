import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function NotFound() {
  return (
    <div className="rounded-[36px] border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm uppercase tracking-[0.24em] text-violet-600">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">Page not found</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">The page you are looking for does not exist. Return to the homepage to continue exploring stories.</p>
      <Link to={ROUTES.HOME} className="mt-8 inline-flex rounded-3xl bg-violet-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-500">Back to Home</Link>
    </div>
  )
}

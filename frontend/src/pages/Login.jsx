import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import { loginWithEmail, signup } from '../services/api'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const redirectAfterAuth = (authPayload) => {
    const roles = authPayload.user?.roles || []
    navigate(roles.includes('admin') ? '/admin/dashboard' : '/')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const authPayload = mode === 'signup'
        ? await signup(form)
        : await loginWithEmail({ email: form.email, password: form.password })
      login(authPayload)
      toast.success(mode === 'signup' ? 'Account created' : 'Signed in')
      redirectAfterAuth(authPayload)
    } catch (error) {
      const message = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message
      toast.error(message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/30 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
            BookVerse
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Sign in to BookVerse</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              One account for reading, buying, publishing, and managing your profile.
            </p>
          </div>
          <GoogleLoginButton onSuccess={redirectAfterAuth} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[24px] bg-slate-50 p-5 dark:bg-slate-900 sm:p-6">
          <div className="grid grid-cols-2 rounded-2xl bg-white p-1 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${mode === 'login' ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${mode === 'signup' ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Create Account
            </button>
          </div>

          {mode === 'signup' && (
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Name
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950" required />
            </label>
          )}

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email
            <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950" required />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Password
            <input type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950" required minLength={6} />
          </label>

          {mode === 'signup' && (
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Confirm Password
              <input type="password" value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950" required minLength={6} />
            </label>
          )}

          <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-600 dark:hover:bg-violet-500">
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

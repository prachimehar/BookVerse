import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import { loginAsGuest, loginWithEmail, signup } from '../services/api'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const BOOKVERSE_HERO =
  'https://i0.wp.com/apeejay.news/wp-content/uploads/2023/10/281023-10-most-read-books-Blog.jpg?resize=740%2C524&ssl=1'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const redirectAfterAuth = (authPayload) => {
    const roles = authPayload.user?.roles || []

    navigate(
      roles.includes('admin')
        ? '/admin/dashboard'
        : '/'
    )
  }

  const handleGuestLogin = async () => {
    setGuestLoading(true)

    try {
      const authPayload = await loginAsGuest()

      login(authPayload)
      toast.success('Welcome, Guest!')
      navigate('/')
    } catch (error) {
      const message =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message

      toast.error(message || 'Guest login failed')
    } finally {
      setGuestLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const authPayload =
        mode === 'signup'
          ? await signup(form)
          : await loginWithEmail({
              email: form.email,
              password: form.password,
            })

      login(authPayload)

      toast.success(
        mode === 'signup'
          ? 'Account created'
          : 'Signed in'
      )

      redirectAfterAuth(authPayload)
    } catch (error) {
      const message =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message

      toast.error(message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-[40px] p-5 sm:p-8 lg:p-10"
      style={{
        backgroundImage: `url('${BOOKVERSE_HERO}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/35 to-black/65" />

      {/* Violet glow */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">

        {/* =====================================================
            LEFT SIDE — BOOKVERSE
            ===================================================== */}

        <div className="px-2 py-6 sm:px-4 lg:px-6">
          <div className="max-w-2xl space-y-7">

            {/* Brand */}
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              📖 BookVerse
            </div>

            {/* Heading */}
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
                Premium reading for modern storytellers
              </p>

              <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Discover Stories That Stay With You
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                Read thousands of books or publish your own masterpiece
                in a premium community built for readers and writers.
              </p>
            </div>

            {/* Features */}
            <div className="grid max-w-xl gap-3 sm:grid-cols-3">
              <div className="border-l border-white/25 pl-4">
                <p className="text-sm font-semibold text-white">
                  Discover
                </p>

                <p className="mt-1 text-xs leading-5 text-white/65">
                  Find your next favorite story.
                </p>
              </div>

              <div className="border-l border-white/25 pl-4">
                <p className="text-sm font-semibold text-white">
                  Read
                </p>

                <p className="mt-1 text-xs leading-5 text-white/65">
                  Build your personal library.
                </p>
              </div>

              <div className="border-l border-white/25 pl-4">
                <p className="text-sm font-semibold text-white">
                  Publish
                </p>

                <p className="mt-1 text-xs leading-5 text-white/65">
                  Share your stories with readers.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* =====================================================
            RIGHT SIDE — AUTH CARD
            ===================================================== */}

        <div className="flex justify-center lg:justify-end">

          <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-black/20 sm:p-8 dark:border-slate-800 dark:bg-slate-950">

            {/* Small heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {mode === 'login'
                  ? 'Welcome back'
                  : 'Create your account'}
              </h2>

              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                {mode === 'login'
                  ? 'Sign in to continue to BookVerse.'
                  : 'Create an account and start exploring.'}
              </p>
            </div>


            {/* =================================================
                SIGN IN / SIGN UP
                ================================================= */}

            <div className="mb-6 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">

              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>

            </div>


            {/* =================================================
                FORM
                ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}
              {mode === 'signup' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    placeholder="Enter your name"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                  />
                </div>
              )}


              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField('email', event.target.value)
                  }
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>


              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                  </label>

                  {mode === 'login' && (
                    <button
                      type="button"
                      className="text-xs font-medium text-violet-600 hover:text-violet-500"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    updateField('password', event.target.value)
                  }
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                  minLength={6}
                />
              </div>


              {/* Confirm password */}
              {mode === 'signup' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Confirm password
                  </label>

                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        'confirmPassword',
                        event.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                    minLength={6}
                  />
                </div>
              )}


              {/* Main button */}
              <button
                type="submit"
                disabled={loading || guestLoading}
                className="mt-1 h-11 w-full rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                    ? 'Create Account'
                    : 'Sign In'}
              </button>

            </form>


            {/* =================================================
                DIVIDER
                ================================================= */}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs text-slate-400">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>


            {/* Google */}
            <GoogleLoginButton
              onSuccess={redirectAfterAuth}
            />


            {/* Guest */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading || guestLoading}
              className="mt-3 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {guestLoading
                ? 'Entering as guest...'
                : 'Continue as Guest'}
            </button>


            {/* Bottom text */}
            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              {mode === 'login'
                ? "Don't have an account? Use Create Account above."
                : 'Already have an account? Use Sign In above.'}
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
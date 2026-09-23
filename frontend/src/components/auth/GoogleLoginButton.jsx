import { GoogleLogin, useGoogleOAuth } from '@react-oauth/google'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { loginWithGoogle } from '../../services/api'

function GoogleLogo() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c3.707-3.467 5.649-8.575 5.649-8.575z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

export default function GoogleLoginButton({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [buttonWidth, setButtonWidth] = useState(0)
  const containerRef = useRef(null)
  const { login } = useAuth()
  const { scriptLoadedSuccessfully } = useGoogleOAuth()

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const updateWidth = () => setButtonWidth(node.offsetWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const handleCredentialResponse = async (credentialResponse) => {
    setLoading(true)
    try {
      const credential = credentialResponse?.credential
      if (!credential) {
        throw new Error('No credential returned from Google')
      }

      const authPayload = await loginWithGoogle(credential)
      login(authPayload)
      toast.success('Signed in with Google')
      onSuccess && onSuccess(authPayload)
    } catch (err) {
      console.error('Google sign in failed', err)
      const message = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message
      toast.error(message || 'Google sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-11 w-full ${loading ? 'pointer-events-none opacity-70' : ''}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      >
        <GoogleLogo />
        {loading ? 'Signing in...' : 'Continue with Google'}
      </div>

      {scriptLoadedSuccessfully && buttonWidth > 0 && (
        <div className="absolute inset-0 z-10 overflow-hidden opacity-[0.01]">
          <GoogleLogin
            width={buttonWidth}
            text="continue_with"
            size="large"
            theme="outline"
            shape="rectangular"
            onSuccess={handleCredentialResponse}
            onError={() => {
              toast.error('Google sign in failed')
            }}
          />
        </div>
      )}
    </div>
  )
}

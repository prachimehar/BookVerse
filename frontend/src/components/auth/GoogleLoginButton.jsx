import { LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { demoLogin } from '../../services/api'

function decodeCredential(credential) {
  try {
    const base64Url = credential.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export default function GoogleLoginButton({ role, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleCredentialResponse = async (credentialResponse) => {
    setLoading(true)
    try {
      const credential = credentialResponse?.credential || credentialResponse?.access_token
      if (!credential) {
        throw new Error('No credential returned from Google')
      }

      const profile = credentialResponse?.credential
        ? decodeCredential(credentialResponse.credential)
        : null

      const userPayload = profile
        ? {
            name: profile.name || 'BookVerse User',
            email: profile.email,
            avatar: profile.picture,
            token: credential,
          }
        : {
            name: 'BookVerse User',
            email: 'unknown@google',
            avatar: '',
            token: credential,
          }

      const authPayload = await demoLogin(role)
      login({ ...authPayload, user: { ...authPayload.user, ...userPayload } })
      toast.success('Signed in with Google')
      onSuccess && onSuccess()
    } catch (err) {
      console.error('Google sign in failed', err)
      toast.error('Google sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={handleCredentialResponse}
        onError={() => {
          toast.error('Google sign in failed')
        }}
      />

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            demoLogin(role)
              .then((authPayload) => {
                login(authPayload)
                onSuccess && onSuccess()
                toast.success('Signed in as guest')
              })
              .catch(() => {
                toast.error('Guest sign in failed')
              })
              .finally(() => {
                setLoading(false)
              })
          }}
          className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <LogIn className="h-5 w-5" />
          {loading ? 'Signing in…' : 'Continue as guest'}
        </button>
      </div>
    </div>
  )
}

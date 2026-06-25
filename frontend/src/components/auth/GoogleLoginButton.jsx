import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { loginWithGoogle } from '../../services/api'

export default function GoogleLoginButton({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

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
      toast.error('Google sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={loading ? 'pointer-events-none opacity-70' : ''}>
      <GoogleLogin
        onSuccess={handleCredentialResponse}
        onError={() => {
          toast.error('Google sign in failed')
        }}
      />
    </div>
  )
}

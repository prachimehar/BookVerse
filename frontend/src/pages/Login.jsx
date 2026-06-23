import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import { ROLES } from '../constants/roles'
import { toast } from 'react-hot-toast'

const roles = [
  { key: ROLES.READER, label: 'Reader', description: 'Discover books from writers around the world' },
  { key: ROLES.WRITER, label: 'Writer', description: 'Publish stories and earn from your creativity' },
  { key: ROLES.ADMIN, label: 'Admin', description: 'Review submissions and moderate the platform' },
]

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(ROLES.READER)
  const { chooseRole } = useAuth()
  const navigate = useNavigate()

  const handleSuccess = () => {
    chooseRole(selectedRole)
    toast.success(`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} account selected`)
    navigate(selectedRole === ROLES.ADMIN ? '/admin/dashboard' : '/')
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[36px] border border-slate-200 bg-white px-8 py-12 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/30">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
            BookVerse</div>
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Read Stories. Share Worlds.</h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Sign in with Google to continue your reading journey or publish your next book with a premium writer experience.</p>
          <GoogleLoginButton role={selectedRole} onSuccess={handleSuccess} />
        </div>
        <div className="space-y-5 rounded-[28px] bg-slate-50 p-6 dark:bg-slate-900">
          <p className="text-sm uppercase tracking-[0.24em] text-violet-600">Choose account type</p>
          <div className="grid gap-4">
            {roles.map((role) => (
              <button
                key={role.key}
                type="button"
                onClick={() => setSelectedRole(role.key)}
                className={`rounded-[28px] border px-5 py-5 text-left transition ${selectedRole === role.key ? 'border-violet-500 bg-violet-50 text-violet-900 dark:border-violet-400 dark:bg-violet-950/50 dark:text-violet-200' : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{role.label}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{role.description}</p>
                  </div>
                  {selectedRole === role.key && <span className="text-sm font-semibold text-violet-600 dark:text-violet-300">Selected</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

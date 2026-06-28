import { useState } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { toggleFollowWriter } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function WriterCard({ writer }) {
  const { user } = useAuth()
  const [followerIds, setFollowerIds] = useState(writer.followerIds || [])
  const [following, setFollowing] = useState(false)

  const isFollowing = Boolean(user && followerIds.includes(user.id))
  const isSelf = Boolean(user && user.id === writer.id)

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please log in to follow writers')
      return
    }

    if (following) return
    setFollowing(true)

    const wasFollowing = isFollowing
    setFollowerIds((current) =>
      wasFollowing ? current.filter((uid) => uid !== user.id) : [...current, user.id]
    )

    try {
      const updated = await toggleFollowWriter(writer.id)
      setFollowerIds(updated.followerIds || [])
    } catch (error) {
      setFollowerIds((current) =>
        wasFollowing ? [...current, user.id] : current.filter((uid) => uid !== user.id)
      )
      const message = error.response?.data?.message || 'Unable to update follow status'
      toast.error(message)
    } finally {
      setFollowing(false)
    }
  }

  return (
    <div className="group rounded-[28px] border border-slate-200 bg-white/95 p-6 text-center shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60">
      <img src={writer.avatar} alt={writer.name} className="mx-auto h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg shadow-slate-200/70 dark:border-slate-800 dark:shadow-black/30" />
      <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{writer.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{writer.bio}</p>
      <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">{followerIds.length.toLocaleString()} followers</span>
      </div>
      {!isSelf && (
        <button
          onClick={handleFollow}
          disabled={following}
          className={`mt-6 inline-flex items-center justify-center gap-2 rounded-3xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isFollowing
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              : 'bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400'
          }`}
        >
          {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
}
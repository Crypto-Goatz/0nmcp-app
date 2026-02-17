"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"
import { Users, FileText, MessageCircle, Calendar } from "lucide-react"

type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  website: string | null
  badges: string[]
  role: string
  reputation: number
  post_count: number
  follower_count: number
  following_count: number
  created_at: string
}

export default function ProfileHeader({ profile }: { profile: Profile }) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(profile.follower_count)
  const supabase = createClient()
  const router = useRouter()
  const isOwn = user?.id === profile.id

  useEffect(() => {
    if (!user || isOwn) return
    supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", profile.id)
      .single()
      .then(({ data }) => setIsFollowing(!!data))
  }, [user, profile.id])

  async function toggleFollow() {
    if (!user) return

    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", profile.id)
      setIsFollowing(false)
      setFollowerCount(prev => prev - 1)
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: profile.id })
      setIsFollowing(true)
      setFollowerCount(prev => prev + 1)
    }
  }

  async function startMessage() {
    if (!user) return

    // Check if thread already exists
    const { data: threads } = await supabase
      .from("message_threads")
      .select("id, participant_ids")
      .contains("participant_ids", [user.id])

    const existing = threads?.find(t =>
      t.participant_ids.includes(profile.id) && t.participant_ids.length === 2
    )

    if (existing) {
      router.push(`/community/messages/${existing.id}`)
    } else {
      const { data } = await supabase
        .from("message_threads")
        .insert({ participant_ids: [user.id, profile.id] })
        .select("id")
        .single()

      if (data) router.push(`/community/messages/${data.id}`)
    }
  }

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      {/* Banner */}
      <div
        className="h-36 bg-gradient-to-r from-neon/10 via-cyan/10 to-purple/10"
        style={profile.banner_url ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      />

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="-mt-12 mb-3 flex items-end justify-between">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || ""}
              className="w-24 h-24 rounded-full object-cover border-4 border-bg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-2xl font-black text-neon border-4 border-bg">
              {(profile.display_name || profile.username)[0].toUpperCase()}
            </div>
          )}

          {!isOwn && user && (
            <div className="flex items-center gap-2">
              <button
                onClick={startMessage}
                className="p-2 rounded-lg border border-border text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
                title="Send message"
              >
                <MessageCircle size={16} />
              </button>
              <button
                onClick={toggleFollow}
                className={
                  isFollowing
                    ? "px-4 py-2 rounded-lg border border-neon/30 text-neon text-sm font-medium hover:bg-neon/10 transition-colors"
                    : "px-4 py-2 rounded-lg bg-neon text-bg text-sm font-bold hover:brightness-110 transition-all"
                }
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <h1 className="text-xl font-black">{profile.display_name || profile.username}</h1>
        <p className="text-text-muted text-sm">@{profile.username}</p>

        {profile.role !== "member" && (
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            profile.role === "admin" ? "bg-neon/10 text-neon" : "bg-purple/10 text-purple"
          }`}>
            {profile.role}
          </span>
        )}

        {profile.bio && (
          <p className="text-text-dim text-sm mt-3">{profile.bio}</p>
        )}

        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener" className="text-cyan text-sm hover:underline mt-1 block">
            {profile.website.replace(/^https?:\/\//, "")}
          </a>
        )}

        {/* Stats */}
        <div className="flex items-center gap-5 mt-4 text-sm">
          <span className="text-text-dim">
            <strong className="text-text">{profile.post_count}</strong> posts
          </span>
          <span className="text-text-dim">
            <strong className="text-text">{followerCount}</strong> followers
          </span>
          <span className="text-text-dim">
            <strong className="text-text">{profile.following_count}</strong> following
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
          <Calendar size={10} />
          Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="flex gap-1 mt-3">
            {profile.badges.map(badge => (
              <span key={badge} className="px-2 py-0.5 rounded-full bg-neon/10 text-neon text-xs">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

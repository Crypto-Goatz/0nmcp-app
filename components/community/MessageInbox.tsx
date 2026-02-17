"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"
import { MessageCircle, Clock, Loader2 } from "lucide-react"

type Thread = {
  id: string
  participant_ids: string[]
  last_message_text: string | null
  last_message_at: string
  other_user?: {
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default function MessageInbox() {
  const { user } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    async function fetchThreads() {
      const { data } = await supabase
        .from("message_threads")
        .select("id, participant_ids, last_message_text, last_message_at")
        .contains("participant_ids", [user!.id])
        .order("last_message_at", { ascending: false })

      if (!data) {
        setLoading(false)
        return
      }

      // Fetch other participants' profiles
      const enriched = await Promise.all(
        data.map(async (thread) => {
          const otherId = thread.participant_ids.find((id: string) => id !== user!.id)
          if (otherId) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, display_name, avatar_url")
              .eq("id", otherId)
              .single()
            return { ...thread, other_user: profile }
          }
          return thread
        })
      )

      setThreads(enriched)
      setLoading(false)
    }

    fetchThreads()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-neon" />
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle size={32} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">No messages yet</p>
        <p className="text-text-muted text-sm mt-1">Start a conversation from a member&apos;s profile</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {threads.map(thread => (
        <Link
          key={thread.id}
          href={`/community/messages/${thread.id}`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
        >
          {thread.other_user?.avatar_url ? (
            <img
              src={thread.other_user.avatar_url}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-sm font-bold text-neon border border-border">
              {(thread.other_user?.display_name || thread.other_user?.username || "?")[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">
              {thread.other_user?.display_name || thread.other_user?.username || "Unknown"}
            </p>
            {thread.last_message_text && (
              <p className="text-xs text-text-muted truncate">{thread.last_message_text}</p>
            )}
          </div>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Clock size={10} />
            {new Date(thread.last_message_at).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  )
}

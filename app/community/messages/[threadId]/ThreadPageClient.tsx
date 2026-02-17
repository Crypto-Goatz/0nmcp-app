"use client"

import { useRouter } from "next/navigation"
import Nav from "@/components/Nav"
import MessageThread from "@/components/community/MessageThread"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type Props = {
  threadId: string
  otherUser: {
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default function ThreadPageClient({ threadId, otherUser }: Props) {
  const router = useRouter()

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push("/community/messages")}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-text-dim transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-xs font-bold text-neon border border-border">
              {(otherUser?.display_name || otherUser?.username || "?")[0].toUpperCase()}
            </div>
          )}
          <div>
            <Link
              href={`/community/profile/${otherUser?.username}`}
              className="text-sm font-bold hover:text-neon transition-colors"
            >
              {otherUser?.display_name || otherUser?.username || "Unknown"}
            </Link>
            <p className="text-xs text-text-muted">@{otherUser?.username}</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-border p-4">
          <MessageThread threadId={threadId} otherUser={otherUser} />
        </div>
      </main>
    </>
  )
}

"use client"

import { useState, useOptimistic } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"
import { cn } from "@/lib/utils"

const REACTIONS = [
  { key: "like", emoji: "\u2764\uFE0F", label: "Like" },
  { key: "fire", emoji: "\uD83D\uDD25", label: "Fire" },
  { key: "rocket", emoji: "\uD83D\uDE80", label: "Rocket" },
  { key: "mind-blown", emoji: "\uD83E\uDD2F", label: "Mind Blown" },
] as const

type Props = {
  postId: string
  reactions: { reaction: string; user_id: string }[]
  likeCount: number
}

export default function ReactionBar({ postId, reactions, likeCount }: Props) {
  const { user } = useAuth()
  const supabase = createClient()
  const [localReactions, setLocalReactions] = useState(reactions)
  const [localCount, setLocalCount] = useState(likeCount)

  function userHasReaction(key: string) {
    return localReactions.some(r => r.reaction === key && r.user_id === user?.id)
  }

  function reactionCount(key: string) {
    return localReactions.filter(r => r.reaction === key).length
  }

  async function toggleReaction(key: string) {
    if (!user) return

    if (userHasReaction(key)) {
      setLocalReactions(prev => prev.filter(r => !(r.reaction === key && r.user_id === user.id)))
      setLocalCount(prev => prev - 1)
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("reaction", key)
    } else {
      setLocalReactions(prev => [...prev, { reaction: key, user_id: user.id }])
      setLocalCount(prev => prev + 1)
      await supabase
        .from("post_reactions")
        .insert({ post_id: postId, user_id: user.id, reaction: key })
    }
  }

  return (
    <div className="flex items-center gap-1">
      {REACTIONS.map(r => {
        const count = reactionCount(r.key)
        const active = userHasReaction(r.key)
        return (
          <button
            key={r.key}
            onClick={() => toggleReaction(r.key)}
            title={r.label}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all",
              active
                ? "bg-neon/10 text-neon"
                : "bg-white/[0.03] text-text-muted hover:bg-white/[0.06] hover:text-text-dim"
            )}
          >
            <span>{r.emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}

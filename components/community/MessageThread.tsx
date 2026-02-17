"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages"
import MessageComposer from "./MessageComposer"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  threadId: string
  otherUser: {
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default function MessageThread({ threadId, otherUser }: Props) {
  const { user } = useAuth()
  const { messages, loading } = useRealtimeMessages(threadId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-neon" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-1 py-4 flex flex-col gap-3">
        {messages.map(msg => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={cn("flex gap-2 max-w-[75%]", isMe ? "ml-auto flex-row-reverse" : "")}>
              {!isMe && (
                msg.sender?.avatar_url ? (
                  <img src={msg.sender.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-border shrink-0 mt-1" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-xs font-bold text-neon border border-border shrink-0 mt-1">
                    {(msg.sender?.display_name || msg.sender?.username || "?")[0].toUpperCase()}
                  </div>
                )
              )}
              <div
                className={cn(
                  "px-3 py-2 rounded-xl text-sm",
                  isMe
                    ? "bg-neon/15 text-text rounded-br-sm"
                    : "bg-white/[0.06] text-text-dim rounded-bl-sm"
                )}
              >
                {msg.content}
                <span className="block text-[10px] text-text-muted mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <MessageComposer threadId={threadId} />
    </div>
  )
}

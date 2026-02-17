"use client"

import { useState, useRef } from "react"
import { Send, Image, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"

type Props = {
  threadId: string
}

export default function MessageComposer({ threadId }: Props) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleSend() {
    if (!content.trim() || !user) return
    setLoading(true)

    await supabase.from("messages").insert({
      thread_id: threadId,
      sender_id: user.id,
      content: content.trim(),
    })

    setContent("")
    setLoading(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 glass-card rounded-xl border border-border">
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-text placeholder:text-text-muted text-sm focus:outline-none focus:border-neon/50"
      />
      <button
        onClick={handleSend}
        disabled={loading || !content.trim()}
        className="p-2.5 rounded-lg bg-neon text-bg hover:brightness-110 transition-all disabled:opacity-40"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      </button>
    </div>
  )
}

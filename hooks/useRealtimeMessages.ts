"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase-browser"

type Message = {
  id: string
  thread_id: string
  sender_id: string
  content: string
  media_url: string | null
  is_read: boolean
  created_at: string
  sender?: {
    username: string
    display_name: string | null
    avatar_url: string | null
  }
}

function normalizeMsg(m: any): Message {
  return { ...m, sender: Array.isArray(m.sender) ? m.sender[0] || undefined : m.sender }
}

export function useRealtimeMessages(threadId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select(`
        id, thread_id, sender_id, content, media_url, is_read, created_at,
        sender:profiles!messages_sender_id_fkey(username, display_name, avatar_url)
      `)
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })

    setMessages((data || []).map(normalizeMsg))
    setLoading(false)
  }, [threadId])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          // Fetch the new message with sender info
          const { data } = await supabase
            .from("messages")
            .select(`
              id, thread_id, sender_id, content, media_url, is_read, created_at,
              sender:profiles!messages_sender_id_fkey(username, display_name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single()

          if (data) {
            setMessages(prev => [...prev, normalizeMsg(data)])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [threadId])

  return { messages, loading }
}

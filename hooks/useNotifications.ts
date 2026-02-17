"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
  actor: {
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    async function fetch() {
      const { data } = await supabase
        .from("notifications")
        .select(`
          id, type, title, body, link, is_read, created_at,
          actor:profiles!notifications_actor_id_fkey(username, display_name, avatar_url)
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20)

      const normalized = (data || []).map((n: any) => ({
        ...n,
        actor: Array.isArray(n.actor) ? n.actor[0] || null : n.actor,
      }))
      setNotifications(normalized)
      setUnreadCount(normalized.filter((n: any) => !n.is_read).length)
    }

    fetch()

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => { fetch() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  async function markAllRead() {
    if (!user) return
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, markAsRead, markAllRead }
}

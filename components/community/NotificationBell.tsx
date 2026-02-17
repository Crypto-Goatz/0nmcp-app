"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Bell, Check } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/components/auth/AuthProvider"

export default function NotificationBell() {
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-neon text-bg text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 max-h-96 overflow-y-auto rounded-xl glass-card border border-border shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-neon hover:underline flex items-center gap-1"
              >
                <Check size={10} />
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-8">No notifications</p>
          ) : (
            <div className="py-1">
              {notifications.map(n => (
                <Link
                  key={n.id}
                  href={n.link || "/community"}
                  onClick={() => {
                    if (!n.is_read) markAsRead(n.id)
                    setOpen(false)
                  }}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors ${
                    !n.is_read ? "bg-neon/[0.03]" : ""
                  }`}
                >
                  {n.actor?.avatar_url ? (
                    <img src={n.actor.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-xs font-bold text-neon border border-border shrink-0">
                      {(n.actor?.display_name || n.actor?.username || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-bold">{n.title}</span>
                    </p>
                    {n.body && <p className="text-xs text-text-muted truncate">{n.body}</p>}
                    <p className="text-[10px] text-text-muted mt-1">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 rounded-full bg-neon shrink-0 mt-2" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

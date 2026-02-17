"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, MessageCircle, Bell } from "lucide-react"
import { useAuth } from "./AuthProvider"
import { cn } from "@/lib/utils"

export default function UserMenu() {
  const { user, profile, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon/10 text-neon text-sm font-bold hover:bg-neon/20 transition-colors"
      >
        <User size={14} />
        Sign In
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-neon/30 transition-all"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name || ""}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-xs font-bold text-neon border border-border">
            {(profile?.display_name || profile?.username || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 rounded-xl glass-card border border-border shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-bold text-text truncate">
              {profile?.display_name || profile?.username}
            </p>
            <p className="text-xs text-text-muted truncate">@{profile?.username}</p>
          </div>

          <div className="py-1">
            <MenuLink href={`/community/profile/${profile?.username}`} icon={User} label="Profile" onClick={() => setOpen(false)} />
            <MenuLink href="/community/messages" icon={MessageCircle} label="Messages" onClick={() => setOpen(false)} />
            <MenuLink href="/settings" icon={Settings} label="Settings" onClick={() => setOpen(false)} />
          </div>

          <div className="border-t border-border py-1">
            <button
              onClick={async () => {
                await signOut()
                setOpen(false)
                router.push("/")
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red hover:bg-white/[0.04] transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({ href, icon: Icon, label, onClick }: { href: string; icon: typeof User; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
    >
      <Icon size={14} />
      {label}
    </Link>
  )
}

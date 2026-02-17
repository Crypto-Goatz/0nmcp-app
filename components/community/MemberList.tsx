"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"
import { Search, Loader2 } from "lucide-react"

type Member = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  role: string
  post_count: number
  follower_count: number
}

export default function MemberList() {
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio, role, post_count, follower_count")
        .order("reputation", { ascending: false })
        .limit(100)

      setMembers(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = members.filter(m =>
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    m.display_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-neon" />
      </div>
    )
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted text-sm focus:outline-none focus:border-neon/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(member => (
          <Link
            key={member.id}
            href={`/community/profile/${member.username}`}
            className="flex items-center gap-3 p-3 glass-card rounded-xl border border-border hover:border-border-hi transition-colors"
          >
            {member.avatar_url ? (
              <img src={member.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-sm font-bold text-neon border border-border">
                {(member.display_name || member.username)[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold truncate">{member.display_name || member.username}</p>
                {member.role !== "member" && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    member.role === "admin" ? "bg-neon/10 text-neon" : "bg-purple/10 text-purple"
                  }`}>
                    {member.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted">@{member.username}</p>
            </div>
            <div className="text-right text-xs text-text-muted shrink-0">
              <p>{member.post_count} posts</p>
              <p>{member.follower_count} followers</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">No members found</p>
      )}
    </div>
  )
}

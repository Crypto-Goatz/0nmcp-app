"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, Plus, Check } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"

type Group = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  member_count: number
  post_count: number
  banner_url: string | null
}

export default function GroupHeader({ group }: { group: Group }) {
  const { user } = useAuth()
  const [isMember, setIsMember] = useState(false)
  const [memberCount, setMemberCount] = useState(group.member_count)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    supabase
      .from("group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setIsMember(!!data))
  }, [user, group.id])

  async function toggleMembership() {
    if (!user) return

    if (isMember) {
      await supabase
        .from("group_members")
        .delete()
        .eq("group_id", group.id)
        .eq("user_id", user.id)
      setIsMember(false)
      setMemberCount(prev => prev - 1)
    } else {
      await supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: user.id })
      setIsMember(true)
      setMemberCount(prev => prev + 1)
    }
  }

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      {group.banner_url && (
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${group.banner_url})` }} />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: `${group.color}15`, color: group.color }}
              >
                #
              </div>
              <div>
                <h1 className="text-xl font-black">{group.name}</h1>
                <div className="flex items-center gap-3 text-sm text-text-muted mt-0.5">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    {group.post_count} posts
                  </span>
                </div>
              </div>
            </div>
            {group.description && (
              <p className="text-text-dim text-sm mt-3">{group.description}</p>
            )}
          </div>

          {user && (
            <button
              onClick={toggleMembership}
              className={
                isMember
                  ? "flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neon/30 text-neon text-sm font-medium hover:bg-neon/10 transition-colors shrink-0"
                  : "flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neon text-bg text-sm font-bold hover:brightness-110 transition-all shrink-0"
              }
            >
              {isMember ? <Check size={14} /> : <Plus size={14} />}
              {isMember ? "Joined" : "Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

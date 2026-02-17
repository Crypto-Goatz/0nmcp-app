"use client"

import Link from "next/link"
import { Users, MessageSquare } from "lucide-react"

type Group = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  member_count: number
  post_count: number
}

export default function GroupCard({ group }: { group: Group }) {
  return (
    <Link
      href={`/community/groups/${group.slug}`}
      className="glass-card rounded-xl p-4 border border-border hover:border-border-hi transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${group.color}15`, color: group.color }}
        >
          #
        </div>
        <div>
          <h3 className="font-bold text-sm group-hover:text-neon transition-colors">{group.name}</h3>
          <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
            <span className="flex items-center gap-1">
              <Users size={10} />
              {group.member_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={10} />
              {group.post_count}
            </span>
          </div>
        </div>
      </div>
      {group.description && (
        <p className="text-text-dim text-xs line-clamp-2">{group.description}</p>
      )}
    </Link>
  )
}

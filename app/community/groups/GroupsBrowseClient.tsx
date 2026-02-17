"use client"

import { useState } from "react"
import Nav from "@/components/Nav"
import GroupCard from "@/components/community/GroupCard"
import { Search } from "lucide-react"

type Group = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  member_count: number
  post_count: number
  category: string
}

export default function GroupsBrowseClient({ groups }: { groups: Group[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  const categories = ["all", ...new Set(groups.map(g => g.category))]

  const filtered = groups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === "all" || g.category === category
    return matchSearch && matchCategory
  })

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-black mb-2">Groups</h1>
        <p className="text-text-dim mb-6">Find your tribe in the 0nMCP community</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted text-sm focus:outline-none focus:border-neon/50"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  category === c
                    ? "bg-neon/10 text-neon"
                    : "text-text-muted hover:text-text-dim hover:bg-white/[0.04]"
                }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-12">No groups found</p>
        )}
      </main>
    </>
  )
}

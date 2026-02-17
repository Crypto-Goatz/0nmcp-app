"use client"

import Nav from "@/components/Nav"
import Feed from "@/components/community/Feed"
import PostComposer from "@/components/community/PostComposer"
import GroupCard from "@/components/community/GroupCard"
import Link from "next/link"
import { Users, ChevronRight } from "lucide-react"

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

export default function CommunityFeedClient({ groups }: { groups: Group[] }) {
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            <span className="gradient-text">Community</span>
          </h1>
          <p className="text-text-dim mt-1">Connect, share, and build with the 0nMCP community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main feed */}
          <div className="flex flex-col gap-4">
            <PostComposer />
            <Feed />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-dim flex items-center gap-1.5">
                <Users size={14} />
                Groups
              </h2>
              <Link
                href="/community/groups"
                className="text-xs text-neon hover:underline flex items-center gap-0.5"
              >
                View all <ChevronRight size={12} />
              </Link>
            </div>

            {groups.slice(0, 6).map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

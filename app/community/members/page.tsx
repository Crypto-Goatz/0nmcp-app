"use client"

import Nav from "@/components/Nav"
import MemberList from "@/components/community/MemberList"
import { Users } from "lucide-react"

export default function MembersPage() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Users size={20} className="text-neon" />
          <h1 className="text-2xl font-black">Members</h1>
        </div>
        <MemberList />
      </main>
    </>
  )
}

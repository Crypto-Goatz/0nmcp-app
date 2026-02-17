"use client"


import MessageInbox from "@/components/community/MessageInbox"
import { MessageCircle } from "lucide-react"

export default function MessagesPage() {
  return (
    <>
      <main className="max-w-2xl mx-auto px-4 pt-8 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle size={20} className="text-neon" />
          <h1 className="text-2xl font-black">Messages</h1>
        </div>
        <div className="glass-card rounded-xl border border-border p-4">
          <MessageInbox />
        </div>
      </main>
    </>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import PostCard from "@/components/community/PostCard"
import PostComposer from "@/components/community/PostComposer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type Post = {
  id: string
  type: string
  title: string | null
  content: string
  media_urls: string[]
  like_count: number
  reply_count: number
  is_pinned: boolean
  created_at: string
  author: { username: string; display_name: string | null; avatar_url: string | null }
  group?: { name: string; slug: string; color: string } | null
  reactions: { reaction: string; user_id: string }[]
}

export default function PostThreadClient({ post, replies }: { post: Post; replies: Post[] }) {
  const router = useRouter()

  return (
    <>
      <main className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-dim hover:text-text mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <PostCard post={post} showGroup />

        <div className="mt-6">
          <h2 className="text-sm font-bold text-text-dim mb-3">
            {post.reply_count} {post.reply_count === 1 ? "Reply" : "Replies"}
          </h2>

          <PostComposer
            parentId={post.id}
            groupId={post.group ? undefined : undefined}
            placeholder="Write a reply..."
          />

          <div className="flex flex-col gap-3 mt-4">
            {replies.map(reply => (
              <PostCard key={reply.id} post={reply} />
            ))}
          </div>

          {replies.length === 0 && (
            <p className="text-center text-text-muted py-8 text-sm">No replies yet. Start the conversation!</p>
          )}
        </div>
      </main>
    </>
  )
}

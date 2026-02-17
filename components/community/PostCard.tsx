"use client"

import Link from "next/link"
import { MessageCircle, Clock, Pin } from "lucide-react"
import ReactionBar from "./ReactionBar"
import { cn } from "@/lib/utils"

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
  author: {
    username: string
    display_name: string | null
    avatar_url: string | null
  }
  group?: {
    name: string
    slug: string
    color: string
  } | null
  reactions: { reaction: string; user_id: string }[]
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 604800) return `${Math.floor(s / 86400)}d`
  return new Date(date).toLocaleDateString()
}

export default function PostCard({ post, showGroup = false }: { post: Post; showGroup?: boolean }) {
  return (
    <div className={cn(
      "glass-card rounded-xl p-4 border border-border hover:border-border-hi transition-colors",
      post.is_pinned && "ring-1 ring-neon/20"
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href={`/community/profile/${post.author.username}`}>
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.display_name || ""}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-sm font-bold text-neon border border-border">
              {(post.author.display_name || post.author.username)[0].toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/community/profile/${post.author.username}`}
              className="font-bold text-sm hover:text-neon transition-colors"
            >
              {post.author.display_name || post.author.username}
            </Link>
            <span className="text-text-muted text-xs">@{post.author.username}</span>
            {showGroup && post.group && (
              <Link
                href={`/community/groups/${post.group.slug}`}
                className="text-xs px-2 py-0.5 rounded-full border border-border hover:bg-white/[0.04] transition-colors"
                style={{ color: post.group.color }}
              >
                {post.group.name}
              </Link>
            )}
            {post.is_pinned && (
              <Pin size={12} className="text-neon" />
            )}
          </div>

          <div className="flex items-center gap-1 text-text-muted text-xs mt-0.5">
            <Clock size={10} />
            {timeAgo(post.created_at)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        {post.title && (
          <Link href={`/community/post/${post.id}`}>
            <h3 className="font-bold text-base hover:text-neon transition-colors mb-1">{post.title}</h3>
          </Link>
        )}
        <p className="text-text-dim text-sm whitespace-pre-wrap leading-relaxed">
          {post.content.length > 500 ? (
            <>
              {post.content.slice(0, 500)}...
              <Link href={`/community/post/${post.id}`} className="text-neon hover:underline ml-1">
                Read more
              </Link>
            </>
          ) : post.content}
        </p>
      </div>

      {/* Media */}
      {post.media_urls.length > 0 && (
        <div className={cn(
          "mt-3 gap-2",
          post.media_urls.length === 1 ? "block" : "grid grid-cols-2"
        )}>
          {post.media_urls.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="rounded-lg w-full object-cover max-h-72 border border-border"
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <ReactionBar postId={post.id} reactions={post.reactions || []} likeCount={post.like_count} />

        <Link
          href={`/community/post/${post.id}`}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-dim transition-colors"
        >
          <MessageCircle size={14} />
          {post.reply_count > 0 && <span>{post.reply_count}</span>}
        </Link>
      </div>
    </div>
  )
}

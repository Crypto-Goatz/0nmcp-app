"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase-browser"
import PostCard from "./PostCard"
import { Loader2 } from "lucide-react"

type Props = {
  groupId?: string
  authorId?: string
}

const PAGE_SIZE = 20

export default function Feed({ groupId, authorId }: Props) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  const fetchPosts = useCallback(async (offset = 0) => {
    let query = supabase
      .from("posts")
      .select(`
        id, type, title, content, media_urls, like_count, reply_count, is_pinned, created_at,
        author:profiles!posts_author_id_fkey(username, display_name, avatar_url),
        group:groups(name, slug, color),
        reactions:post_reactions(reaction, user_id)
      `)
      .is("parent_id", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (groupId) query = query.eq("group_id", groupId)
    if (authorId) query = query.eq("author_id", authorId)

    const { data } = await query
    return data || []
  }, [groupId, authorId])

  async function loadInitial() {
    setLoading(true)
    const data = await fetchPosts(0)
    setPosts(data)
    setHasMore(data.length === PAGE_SIZE)
    setLoading(false)
  }

  async function loadMore() {
    const data = await fetchPosts(posts.length)
    setPosts(prev => [...prev, ...data])
    setHasMore(data.length === PAGE_SIZE)
  }

  useEffect(() => {
    loadInitial()
  }, [groupId, authorId])

  // Subscribe to new posts via realtime
  useEffect(() => {
    const channel = supabase
      .channel("feed-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        () => { loadInitial() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [groupId, authorId])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-neon" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No posts yet. Be the first to share something!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} showGroup={!groupId} />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          className="mx-auto px-6 py-2 rounded-lg text-sm text-text-dim hover:text-text bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  )
}

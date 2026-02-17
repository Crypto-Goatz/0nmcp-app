import { createClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import PostThreadClient from "./PostThreadClient"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select(`
      id, type, title, content, media_urls, like_count, reply_count, is_pinned, created_at,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url),
      group:groups(name, slug, color),
      reactions:post_reactions(reaction, user_id)
    `)
    .eq("id", id)
    .single()

  if (!post) notFound()

  const { data: replies } = await supabase
    .from("posts")
    .select(`
      id, type, title, content, media_urls, like_count, reply_count, is_pinned, created_at,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url),
      reactions:post_reactions(reaction, user_id)
    `)
    .eq("parent_id", id)
    .order("created_at", { ascending: true })

  // Normalize Supabase join shapes (arrays → objects for single relations)
  const normalizePost = (p: any) => ({
    ...p,
    author: Array.isArray(p.author) ? p.author[0] : p.author,
    group: Array.isArray(p.group) ? p.group[0] || null : p.group,
    reactions: p.reactions || [],
  })

  return (
    <PostThreadClient
      post={normalizePost(post)}
      replies={(replies || []).map(normalizePost)}
    />
  )
}

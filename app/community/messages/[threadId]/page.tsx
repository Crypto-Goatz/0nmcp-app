import { createClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import ThreadPageClient from "./ThreadPageClient"

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params
  const supabase = await createClient()

  const { data: thread } = await supabase
    .from("message_threads")
    .select("id, participant_ids, last_message_text, last_message_at")
    .eq("id", threadId)
    .single()

  if (!thread) notFound()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !thread.participant_ids.includes(user.id)) notFound()

  // Get other participant's profile
  const otherId = thread.participant_ids.find((id: string) => id !== user.id)
  let otherUser = null
  if (otherId) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", otherId)
      .single()
    otherUser = data
  }

  return <ThreadPageClient threadId={threadId} otherUser={otherUser} />
}

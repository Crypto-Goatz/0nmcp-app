import { createClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import ProfilePageClient from "./ProfilePageClient"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, banner_url, bio, website, badges, role, reputation, post_count, follower_count, following_count, created_at")
    .eq("username", username)
    .single()

  if (!profile) notFound()

  return <ProfilePageClient profile={profile} />
}

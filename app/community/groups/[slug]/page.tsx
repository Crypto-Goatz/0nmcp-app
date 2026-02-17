import { createClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import GroupDetailClient from "./GroupDetailClient"

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, slug, description, color, icon, member_count, post_count, banner_url, created_by")
    .eq("slug", slug)
    .single()

  if (!group) notFound()

  return <GroupDetailClient group={group} />
}

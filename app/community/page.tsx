import { createClient } from "@/lib/supabase-server"
import CommunityFeedClient from "./CommunityFeedClient"

export default async function CommunityPage() {
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, slug, description, color, icon, member_count, post_count")
    .eq("visibility", "public")
    .order("member_count", { ascending: false })

  return <CommunityFeedClient groups={groups || []} />
}

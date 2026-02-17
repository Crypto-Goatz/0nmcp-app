import { createClient } from "@/lib/supabase-server"
import GroupsBrowseClient from "./GroupsBrowseClient"

export default async function GroupsPage() {
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, slug, description, color, icon, member_count, post_count, category")
    .eq("visibility", "public")
    .order("member_count", { ascending: false })

  return <GroupsBrowseClient groups={groups || []} />
}

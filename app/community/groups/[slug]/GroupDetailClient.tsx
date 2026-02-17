"use client"


import GroupHeader from "@/components/community/GroupHeader"
import PostComposer from "@/components/community/PostComposer"
import Feed from "@/components/community/Feed"

type Group = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  member_count: number
  post_count: number
  banner_url: string | null
  created_by: string | null
}

export default function GroupDetailClient({ group }: { group: Group }) {
  return (
    <>
      <main className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        <GroupHeader group={group} />
        <div className="mt-6 flex flex-col gap-4">
          <PostComposer groupId={group.id} placeholder={`Post in ${group.name}...`} />
          <Feed groupId={group.id} />
        </div>
      </main>
    </>
  )
}

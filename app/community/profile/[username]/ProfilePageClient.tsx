"use client"


import ProfileHeader from "@/components/community/ProfileHeader"
import Feed from "@/components/community/Feed"

type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  website: string | null
  badges: string[]
  role: string
  reputation: number
  post_count: number
  follower_count: number
  following_count: number
  created_at: string
}

export default function ProfilePageClient({ profile }: { profile: Profile }) {
  return (
    <>
      <main className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        <ProfileHeader profile={profile} />
        <div className="mt-6">
          <h2 className="text-sm font-bold text-text-dim mb-3">Posts</h2>
          <Feed authorId={profile.id} />
        </div>
      </main>
    </>
  )
}

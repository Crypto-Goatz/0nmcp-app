"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Image, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"
import { cn } from "@/lib/utils"

type Props = {
  groupId?: string
  parentId?: string
  placeholder?: string
  onPost?: () => void
}

export default function PostComposer({ groupId, parentId, placeholder, onPost }: Props) {
  const { user, profile } = useAuth()
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  if (!user) return null

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newFiles = Array.from(files).slice(0, 4 - mediaFiles.length)
    setMediaFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setMediaPreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  function removeMedia(i: number) {
    setMediaFiles(prev => prev.filter((_, idx) => idx !== i))
    setMediaPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit() {
    if (!content.trim() && mediaFiles.length === 0) return
    setLoading(true)

    let mediaUrls: string[] = []
    if (!user) return

    // Upload media
    for (const file of mediaFiles) {
      const ext = file.name.split(".").pop()
      const path = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data } = await supabase.storage.from("media").upload(path, file)
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(data.path)
        mediaUrls.push(publicUrl)
      }
    }

    const type = mediaUrls.length > 0 ? "image" : "text"

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      group_id: groupId || null,
      parent_id: parentId || null,
      type,
      title: showTitle && title.trim() ? title.trim() : null,
      content: content.trim(),
      media_urls: mediaUrls,
    })

    if (!error) {
      setContent("")
      setTitle("")
      setMediaFiles([])
      setMediaPreviews([])
      setShowTitle(false)
      onPost?.()
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="glass-card rounded-xl p-4 border border-border">
      <div className="flex gap-3">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/30 to-cyan/30 flex items-center justify-center text-sm font-bold text-neon border border-border shrink-0">
            {(profile?.display_name || profile?.username || "U")[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          {showTitle && !parentId && (
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title (optional)"
              className="w-full mb-2 px-3 py-2 rounded-lg bg-surface border border-border text-text placeholder:text-text-muted text-sm focus:outline-none focus:border-neon/50"
            />
          )}

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={placeholder || "What's on your mind?"}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-neon/50"
          />

          {/* Media previews */}
          {mediaPreviews.length > 0 && (
            <div className="flex gap-2 mt-2">
              {mediaPreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="" className="w-20 h-20 rounded-lg object-cover border border-border" />
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red flex items-center justify-center"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2 rounded-lg text-text-muted hover:text-text-dim hover:bg-white/[0.04] transition-colors"
                title="Add image"
              >
                <Image size={16} />
              </button>
              {!parentId && (
                <button
                  onClick={() => setShowTitle(!showTitle)}
                  className={cn(
                    "px-2 py-1 rounded-lg text-xs transition-colors",
                    showTitle ? "bg-neon/10 text-neon" : "text-text-muted hover:text-text-dim hover:bg-white/[0.04]"
                  )}
                >
                  Title
                </button>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && mediaFiles.length === 0)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neon text-bg text-sm font-bold hover:brightness-110 transition-all disabled:opacity-40"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {parentId ? "Reply" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

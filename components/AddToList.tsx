"use client"

import { useState } from "react"
import { Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddToListProps {
  /** The text that will be added as a task */
  text: string
  /** Optional source label for tracking where the task came from */
  source?: string
  /** Size variant */
  size?: "sm" | "md"
  /** Additional className */
  className?: string
  /** Show as inline icon only (no background) */
  inline?: boolean
}

export default function AddToList({ text, source, size = "sm", className, inline }: AddToListProps) {
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (added) return

    window.dispatchEvent(new CustomEvent("0n-add-task", {
      detail: { text, source: source || "page" },
    }))

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (inline) {
    return (
      <button
        onClick={handleAdd}
        className={cn(
          "inline-flex items-center justify-center transition-all",
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          added ? "text-neon scale-110" : "text-text-muted/40 hover:text-neon hover:scale-110",
          className
        )}
        title={added ? "Added to tasks!" : "Add to my list"}
      >
        {added ? <Check size={size === "sm" ? 10 : 12} /> : <Plus size={size === "sm" ? 10 : 12} />}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg font-bold transition-all",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]",
        added
          ? "bg-neon/15 text-neon"
          : "bg-white/5 text-text-muted hover:text-neon hover:bg-neon/10",
        className
      )}
      title={added ? "Added to tasks!" : "Add to my list"}
    >
      {added ? <Check size={size === "sm" ? 8 : 10} /> : <Plus size={size === "sm" ? 8 : 10} />}
      {added ? "Added!" : "Add"}
    </button>
  )
}

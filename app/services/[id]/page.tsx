"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Search, Wrench, Zap, Radio, ChevronRight, Terminal
} from "lucide-react"

import { SERVICES, CATEGORIES } from "@/lib/catalog"
import { getToolsForService, type Tool } from "@/lib/tools-data"
import { cn } from "@/lib/utils"

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const service = SERVICES.find(s => s.id === id)
  const allTools = useMemo(() => getToolsForService(id), [id])
  const cat = CATEGORIES.find(c => c.id === service?.category)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "tool" | "action" | "trigger">("all")

  if (!service) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 text-center">
          <p className="text-text-dim">Service not found.</p>
          <Link href="/services" className="text-cyan text-sm mt-2 inline-block">Back to Services</Link>
        </div>
      </div>
    )
  }

  const tools = allTools.filter(t => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    }
    return true
  })

  const counts = {
    all: allTools.length,
    tool: allTools.filter(t => t.type === "tool").length,
    action: allTools.filter(t => t.type === "action").length,
    trigger: allTools.filter(t => t.type === "trigger").length,
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/services" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft size={12} />
          All Services
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: service.color + "18" }}>
            <div className="w-5 h-5 rounded-full" style={{ background: service.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{service.name}</h1>
            <p className="text-sm text-text-dim">{service.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Tools", value: counts.tool, color: service.color },
            { label: "Actions", value: counts.action, color: "#ff6b35" },
            { label: "Triggers", value: counts.trigger, color: "#9945ff" },
            { label: "Category", value: cat?.label || service.category, color: cat?.color || "#00d4ff", isText: true },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
              <div className={`${stat.isText ? "text-sm" : "text-2xl"} font-black`} style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${service.name} tools...`}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-all"
            />
          </div>
        </div>

        {/* Type filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "tool", "action", "trigger"] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full transition-all capitalize",
                typeFilter === type ? "bg-white/10 text-text" : "glass-card text-text-dim hover:text-text"
              )}
            >
              {type === "all" ? `All (${counts.all})` :
               type === "tool" ? `Tools (${counts.tool})` :
               type === "action" ? `Actions (${counts.action})` :
               `Triggers (${counts.trigger})`}
            </button>
          ))}
        </div>

        {/* Tool list */}
        <div className="space-y-2">
          {tools.map((tool, i) => (
            <ToolRow key={tool.name} tool={tool} index={i} serviceColor={service.color} />
          ))}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-12 text-text-dim">
            <Wrench size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tools match your search.</p>
          </div>
        )}

        {/* Execute CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/console"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg font-bold text-sm hover:shadow-lg hover:shadow-neon/20 transition-all"
          >
            <Terminal size={16} />
            Execute {service.name} Tools in Console
          </Link>
        </div>
      </div>
    </div>
  )
}

function ToolRow({ tool, index, serviceColor }: { tool: Tool; index: number; serviceColor: string }) {
  const typeStyles = {
    tool: { bg: "bg-neon/8", text: "text-neon", icon: Wrench },
    action: { bg: "bg-orange/8", text: "text-orange", icon: Zap },
    trigger: { bg: "bg-purple/8", text: "text-purple", icon: Radio },
  }
  const style = typeStyles[tool.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.015, duration: 0.2 }}
      className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-all group"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg}`}>
        <style.icon size={14} className={style.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono font-bold text-text truncate">{tool.name}</code>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
            {tool.type}
          </span>
        </div>
        <p className="text-xs text-text-dim truncate">{tool.description}</p>
      </div>
      <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search, Server, ArrowRight, Filter, BarChart3
} from "lucide-react"
import Nav from "@/components/Nav"
import AddToList from "@/components/AddToList"
import { SERVICES, CATEGORIES, STATS, type Service } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export default function ServicesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...SERVICES]
    if (activeCategory) list = list.filter(s => s.category === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => b.tools - a.tools)
  }, [search, activeCategory])

  const totalTools = filtered.reduce((s, v) => s + v.tools, 0)
  const totalActions = filtered.reduce((s, v) => s + v.actions, 0)
  const totalTriggers = filtered.reduce((s, v) => s + v.triggers, 0)

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Server size={24} className="text-cyan" />
            <h1 className="text-3xl font-black tracking-tight">Service Explorer</h1>
          </div>
          <p className="text-sm text-text-dim">
            Browse {STATS.services} integrated services with {STATS.tools} tools, {STATS.actions} actions, and {STATS.triggers} triggers.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Services", value: filtered.length, color: "#00d4ff" },
            { label: "Tools", value: totalTools, color: "#00ff88" },
            { label: "Actions", value: totalActions, color: "#ff6b35" },
            { label: "Triggers", value: totalTriggers, color: "#9945ff" },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
              <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-all"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
              !activeCategory ? "bg-cyan/20 text-cyan" : "glass-card text-text-dim hover:text-text"
            )}
          >
            All ({SERVICES.length})
          </button>
          {CATEGORIES.map(c => {
            const count = SERVICES.filter(s => s.category === c.id).length
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                  activeCategory === c.id
                    ? "bg-white/10 shadow-sm"
                    : "glass-card hover:bg-white/[0.04]"
                )}
                style={{ color: c.color }}
              >
                {c.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-text-dim">
            <Server size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No services match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cat = CATEGORIES.find(c => c.id === service.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        href={`/services/${service.id}`}
        className="block glass-card rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full" style={{ background: service.color }} />
            <span className="font-bold text-text">{service.name}</span>
          </div>
          <ArrowRight size={14} className="text-text-muted group-hover:text-text group-hover:translate-x-0.5 transition-all" />
        </div>

        <p className="text-xs text-text-dim leading-relaxed mb-4">{service.description}</p>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: service.color + "18", color: service.color }}>
            {service.tools} tools
          </span>
          <span className="text-[10px] text-text-muted">{service.actions} actions</span>
          <span className="text-[10px] text-text-muted">{service.triggers} triggers</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-[10px] text-text-muted uppercase tracking-wider" style={{ color: cat?.color }}>
            {cat?.label || service.category}
          </div>
          <AddToList
            text={`Configure ${service.name} service (${service.tools} tools, ${service.actions} actions)`}
            source="Services"
            inline
          />
        </div>
      </Link>
    </motion.div>
  )
}

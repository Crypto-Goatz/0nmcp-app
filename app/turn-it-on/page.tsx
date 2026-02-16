"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Power, Search, Zap, ArrowRight, ChevronDown, ChevronUp,
  Globe, Server, Sparkles, Copy, Check, ExternalLink,
  ArrowLeftRight, Filter, X
} from "lucide-react"
import Nav from "@/components/Nav"
import AddToList from "@/components/AddToList"
import { cn } from "@/lib/utils"
import {
  EXPANDED_SERVICES, CAPABILITIES, SECTIONS, EXPANSION_STATS,
  getServicesBySection, getCapabilitiesForService, getCapabilitiesByCategory,
  type ExpandedService, type Capability
} from "@/lib/services-expansion"

type View = "services" | "capabilities" | "builder"

const CAPABILITY_CATEGORIES = [...new Set(CAPABILITIES.map(c => c.category))]

export default function TurnItOnPage() {
  const [view, setView] = useState<View>("services")
  const [search, setSearch] = useState("")
  const [expandedSection, setExpandedSection] = useState<string | null>("everyday")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Connection builder state
  const [serviceA, setServiceA] = useState<string | null>(null)
  const [serviceB, setServiceB] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    if (!search) return EXPANDED_SERVICES
    const q = search.toLowerCase()
    return EXPANDED_SERVICES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.sectionLabel.toLowerCase().includes(q) ||
      s.adapter.toLowerCase().includes(q)
    )
  }, [search])

  const filteredCapabilities = useMemo(() => {
    let caps = CAPABILITIES
    if (selectedService) {
      caps = getCapabilitiesForService(selectedService)
    }
    if (selectedCategory) {
      caps = caps.filter(c => c.category === selectedCategory)
    }
    if (search) {
      const q = search.toLowerCase()
      caps = caps.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    }
    return caps
  }, [search, selectedService, selectedCategory])

  const builderCapabilities = useMemo(() => {
    if (!serviceA) return []
    if (!serviceB) return getCapabilitiesForService(serviceA)
    return CAPABILITIES.filter(c =>
      (c.serviceA === serviceA && c.serviceB === serviceB) ||
      (c.serviceA === serviceB && c.serviceB === serviceA)
    )
  }, [serviceA, serviceB])

  const getService = (id: string) => EXPANDED_SERVICES.find(s => s.id === id)

  const copyConfig = (cap: Capability) => {
    const a = getService(cap.serviceA)
    const b = getService(cap.serviceB)
    const config = `{
  "name": "${cap.name}",
  "version": "1.0.0",
  "trigger": { "service": "${cap.serviceA}", "adapter": "${a?.adapter}" },
  "action": { "service": "${cap.serviceB}", "adapter": "${b?.adapter}" },
  "description": "${cap.name}",
  "capability_id": "${cap.id}"
}`
    navigator.clipboard.writeText(config)
    setCopiedId(cap.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neon/5 border border-neon/20 text-neon text-sm font-bold mb-6"
          >
            <Power size={14} />
            Turn it 0n
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-4"
          >
            <span className="gradient-text">{EXPANSION_STATS.services} Services.</span>{" "}
            <span className="text-neon">{EXPANSION_STATS.totalCapabilities.toLocaleString()}+</span>{" "}
            <span className="text-text">Capabilities.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-dim max-w-2xl mx-auto text-lg mb-8"
          >
            Connect any service to any service with one command. No code. No Zapier. Just describe what you want.
          </motion.p>

          {/* Stats bar */}
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { label: "Services", value: EXPANSION_STATS.services, color: "text-neon" },
              { label: "Live", value: EXPANSION_STATS.liveServices, color: "text-cyan" },
              { label: "Federated", value: EXPANSION_STATS.federatedServices, color: "text-purple" },
              { label: "Base Tools", value: EXPANSION_STATS.baseTools.toLocaleString(), color: "text-orange" },
              { label: "Capabilities", value: EXPANSION_STATS.capabilities, color: "text-pink" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* View tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "services" as const, label: "Service Grid", icon: Server },
            { id: "capabilities" as const, label: "Capabilities", icon: ArrowLeftRight },
            { id: "builder" as const, label: "Connection Builder", icon: Zap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id); setSearch(""); setSelectedService(null); setSelectedCategory(null) }}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                view === tab.id ? "bg-neon/15 text-neon border border-neon/30" : "glass-card text-text-dim hover:text-text"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={view === "services" ? "Search 59 services..." : view === "capabilities" ? "Search 126 capabilities..." : "Search services to connect..."}
              className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-neon/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ─── SERVICE GRID VIEW ──────────────────────── */}
        {view === "services" && (
          <div className="space-y-4">
            {SECTIONS.map(section => {
              const services = getServicesBySection(section.id).filter(s =>
                !search || s.name.toLowerCase().includes(search.toLowerCase())
              )
              if (services.length === 0) return null
              const isExpanded = expandedSection === section.id
              const sectionTools = services.reduce((sum, s) => sum + s.tools, 0)

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: section.color }} />
                      <div className="text-left">
                        <h3 className="font-bold text-text">{section.label}</h3>
                        <p className="text-xs text-text-dim">{section.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold" style={{ color: section.color }}>{services.length}</span>
                        <span className="text-xs text-text-muted ml-1">services</span>
                        <span className="text-xs text-text-muted ml-2">{sectionTools} tools</span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                          {services.map((service, i) => (
                            <motion.button
                              key={service.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              onClick={() => { setSelectedService(service.id); setView("capabilities") }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black"
                                style={{ background: (service.color || "#888") + "20", color: service.color || "#888" }}
                              >
                                {service.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-bold text-text truncate">{service.name}</span>
                                  {service.status === "live" && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                  <span>{service.tools} tools</span>
                                  <span className={service.status === "live" ? "text-neon" : "text-purple"}>
                                    {service.status === "live" ? "LIVE" : "FEDERATE"}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* ─── CAPABILITIES VIEW ──────────────────────── */}
        {view === "capabilities" && (
          <div>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedService(null) }}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-bold transition-all",
                  !selectedCategory && !selectedService ? "bg-neon/15 text-neon" : "glass-card text-text-dim hover:text-text"
                )}
              >
                All ({CAPABILITIES.length})
              </button>
              {CAPABILITY_CATEGORIES.map(cat => {
                const count = getCapabilitiesByCategory(cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setSelectedService(null) }}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full font-bold transition-all",
                      selectedCategory === cat ? "bg-neon/15 text-neon" : "glass-card text-text-dim hover:text-text"
                    )}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>

            {selectedService && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-text-muted">Showing capabilities for:</span>
                <span className="text-xs font-bold text-neon bg-neon/10 px-2 py-0.5 rounded-full">
                  {getService(selectedService)?.name}
                </span>
                <button onClick={() => setSelectedService(null)} className="text-text-muted hover:text-text">
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="space-y-2">
              {filteredCapabilities.map((cap, i) => {
                const a = getService(cap.serviceA)
                const b = getService(cap.serviceB)
                return (
                  <motion.div
                    key={cap.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.5) }}
                    className="glass-card rounded-xl px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.03] transition-all group"
                  >
                    <span className="text-[10px] font-mono text-text-muted w-16 shrink-0">{cap.id}</span>

                    {/* Service A */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[8px] font-black shrink-0"
                        style={{ background: (a?.color || "#888") + "20", color: a?.color || "#888" }}
                      >
                        {a?.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-text truncate">{a?.name}</span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight size={14} className="text-neon shrink-0" />

                    {/* Service B */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[8px] font-black shrink-0"
                        style={{ background: (b?.color || "#888") + "20", color: b?.color || "#888" }}
                      >
                        {b?.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-text truncate">{b?.name}</span>
                    </div>

                    {/* Name */}
                    <span className="flex-1 text-xs text-text-dim truncate">{cap.name}</span>

                    {/* Category badge */}
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted shrink-0 hidden lg:inline">
                      {cap.category}
                    </span>

                    {/* Copy .0n config */}
                    <button
                      onClick={() => copyConfig(cap)}
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-neon transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      {copiedId === cap.id ? <Check size={10} /> : <Copy size={10} />}
                      .0n
                    </button>
                    <AddToList
                      text={`Implement: ${cap.name} (${a?.name} → ${b?.name})`}
                      source="Turn it 0n"
                      inline
                      className="opacity-0 group-hover:opacity-100"
                    />
                  </motion.div>
                )
              })}
            </div>

            {filteredCapabilities.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                <ArrowLeftRight size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No capabilities match your search</p>
              </div>
            )}
          </div>
        )}

        {/* ─── CONNECTION BUILDER VIEW ────────────────── */}
        {view === "builder" && (
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Connect Two Services</h3>

              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                {/* Service A picker */}
                <div>
                  <label className="text-xs text-text-dim mb-2 block">Source Service</label>
                  <select
                    value={serviceA || ""}
                    onChange={e => { setServiceA(e.target.value || null); setServiceB(null) }}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-neon/40 transition-all"
                  >
                    <option value="">Select a service...</option>
                    {EXPANDED_SERVICES.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.tools} tools) {s.status === "live" ? "" : "[Federated]"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center">
                    <ArrowRight size={20} className="text-neon" />
                  </div>
                </div>

                {/* Service B picker */}
                <div>
                  <label className="text-xs text-text-dim mb-2 block">Target Service</label>
                  <select
                    value={serviceB || ""}
                    onChange={e => setServiceB(e.target.value || null)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-neon/40 transition-all"
                  >
                    <option value="">Select a service...</option>
                    {EXPANDED_SERVICES.filter(s => s.id !== serviceA).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.tools} tools) {s.status === "live" ? "" : "[Federated]"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Connection visualization */}
            {serviceA && (
              <div className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  {/* Service A visual */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black mx-auto mb-2"
                      style={{ background: (getService(serviceA)?.color || "#888") + "20", color: getService(serviceA)?.color || "#888" }}
                    >
                      {getService(serviceA)?.name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold">{getService(serviceA)?.name}</p>
                    <p className="text-[10px] text-text-muted">{getService(serviceA)?.tools} tools</p>
                  </motion.div>

                  {/* Connection line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-16 h-0.5 bg-gradient-to-r from-neon to-cyan" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/20 to-cyan/20 flex items-center justify-center border border-neon/30">
                      <Zap size={16} className="text-neon" />
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-cyan to-purple" />
                  </motion.div>

                  {/* Service B visual */}
                  {serviceB ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-center"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black mx-auto mb-2"
                        style={{ background: (getService(serviceB)?.color || "#888") + "20", color: getService(serviceB)?.color || "#888" }}
                      >
                        {getService(serviceB)?.name.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold">{getService(serviceB)?.name}</p>
                      <p className="text-[10px] text-text-muted">{getService(serviceB)?.tools} tools</p>
                    </motion.div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-text-muted">
                      <span className="text-xs">Pick</span>
                    </div>
                  )}
                </div>

                {/* Install command */}
                <div className="text-center">
                  <code className="text-xs text-neon bg-neon/5 px-4 py-2 rounded-lg">
                    npx 0nmcp → &quot;Connect {getService(serviceA)?.name}{serviceB ? ` to ${getService(serviceB)?.name}` : ""}&quot;
                  </code>
                </div>
              </div>
            )}

            {/* Available capabilities for this connection */}
            {serviceA && (
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">
                  {serviceB
                    ? `${getService(serviceA)?.name} + ${getService(serviceB)?.name} Capabilities`
                    : `All ${getService(serviceA)?.name} Capabilities`
                  }
                  <span className="text-neon ml-2">({builderCapabilities.length})</span>
                </h3>

                {builderCapabilities.length > 0 ? (
                  <div className="space-y-2">
                    {builderCapabilities.map((cap, i) => {
                      const a = getService(cap.serviceA)
                      const b = getService(cap.serviceB)
                      return (
                        <motion.div
                          key={cap.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="glass-card rounded-xl px-5 py-3 flex items-center gap-3"
                        >
                          <span className="text-[10px] font-mono text-text-muted w-14 shrink-0">{cap.id}</span>
                          <ArrowRight size={12} className="text-neon shrink-0" />
                          <span className="text-sm text-text flex-1">{cap.name}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted">{cap.category}</span>
                          <button
                            onClick={() => copyConfig(cap)}
                            className="text-[10px] text-text-muted hover:text-neon transition-colors"
                          >
                            {copiedId === cap.id ? <Check size={10} /> : <Copy size={10} />}
                          </button>
                          <AddToList
                            text={`Implement: ${cap.name} (${a?.name} → ${b?.name})`}
                            source="Connection Builder"
                            inline
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="glass-card rounded-xl p-8 text-center text-text-muted">
                    <Sparkles size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No pre-built capability yet — but 0nMCP can still connect these services.</p>
                    <p className="text-xs mt-1">Just describe what you want in natural language.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black mb-2">Ready to Turn it 0n?</h2>
            <p className="text-sm text-text-dim mb-6">One command to connect everything. No code. No Zapier.</p>
            <code className="block text-neon bg-neon/5 px-6 py-3 rounded-xl text-sm font-mono mb-4">
              npx 0nmcp
            </code>
            <div className="flex justify-center gap-3">
              <Link
                href="/console"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neon/15 text-neon text-xs font-bold hover:bg-neon/25 transition-colors"
              >
                <Zap size={12} />
                Try Console
              </Link>
              <a
                href="https://0nmcp.com"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl glass-card text-text-dim text-xs font-bold hover:text-text transition-colors"
              >
                <ExternalLink size={12} />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Linkedin, ArrowLeft, Search, Send, Copy, Check,
  User, Star, MessageSquare, Camera, Sparkles,
  BarChart3, ChevronRight, Loader2
} from "lucide-react"
import Nav from "@/components/Nav"
import { cn } from "@/lib/utils"

type Tone = "professional" | "friendly" | "casual" | "formal"

const MOCK_LEADS = [
  { id: "1", name: "Sarah Chen", title: "VP of Engineering", company: "TechFlow AI", location: "San Francisco", score: 92, connected: true },
  { id: "2", name: "Marcus Williams", title: "Head of Sales", company: "GrowthMetrics", location: "Austin", score: 87, connected: false },
  { id: "3", name: "Elena Rodriguez", title: "CEO & Founder", company: "NexGen Solutions", location: "Miami", score: 95, connected: true },
  { id: "4", name: "James Park", title: "Director of Marketing", company: "Velocity Labs", location: "Seattle", score: 78, connected: false },
  { id: "5", name: "Amanda Foster", title: "Chief Revenue Officer", company: "ScaleUp Inc", location: "New York", score: 89, connected: true },
]

const TONE_CONFIG: Record<Tone, { label: string; emoji: string }> = {
  professional: { label: "Professional", emoji: "💼" },
  friendly: { label: "Friendly", emoji: "😊" },
  casual: { label: "Casual", emoji: "👋" },
  formal: { label: "Formal", emoji: "🎩" },
}

function generateMessage(lead: typeof MOCK_LEADS[0], tone: Tone): string {
  const first = lead.name.split(" ")[0]
  const messages: Record<Tone, string> = {
    professional: `Hi ${first},\n\nI came across your profile and was impressed by your work as ${lead.title} at ${lead.company}. Your expertise in driving growth aligns well with what we're building at 0nMCP — a universal AI API orchestrator that connects 26 services through natural language.\n\nI'd love to explore potential synergies. Would you be open to a brief conversation?\n\nBest regards`,
    friendly: `Hey ${first}! 👋\n\nLove what you're doing at ${lead.company}! As someone working in AI orchestration, I think there's a really cool overlap between what you're building and our work on 0nMCP.\n\nWould love to chat sometime — no pressure, just think we'd have a great conversation!\n\nCheers`,
    casual: `${first} — saw your profile and had to reach out. ${lead.company} is doing amazing things.\n\nWe just launched 0nMCP (550 tools, 26 services, one natural language command) and I think you'd find it interesting.\n\nDown to connect?`,
    formal: `Dear ${first},\n\nI hope this message finds you well. I am reaching out regarding a potential opportunity for collaboration between ${lead.company} and our organization.\n\nAs ${lead.title}, your insight into ${lead.company}'s strategic direction would be invaluable as we explore partnerships for our AI orchestration platform, 0nMCP.\n\nI would be honored to schedule a brief introductory call at your earliest convenience.\n\nWith kind regards`,
  }
  return messages[tone]
}

export default function LinkedInPage() {
  const [view, setView] = useState<"leads" | "composer" | "scraper">("leads")
  const [selectedLead, setSelectedLead] = useState<typeof MOCK_LEADS[0] | null>(null)
  const [tone, setTone] = useState<Tone>("professional")
  const [message, setMessage] = useState("")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState("")
  const [scrapeUrl, setScrapeUrl] = useState("")
  const [scraping, setScraping] = useState(false)

  const filteredLeads = MOCK_LEADS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  )

  const generateMsg = async () => {
    if (!selectedLead) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1200))
    setMessage(generateMessage(selectedLead, tone))
    setGenerating(false)
  }

  const copyMsg = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "#0a66c2" + "20" }}>
              <Linkedin size={28} style={{ color: "#0a66c2" }} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">LinkedIn Outreach</h1>
              <p className="text-sm text-text-dim">AI-powered prospecting & engagement — Powered by 0nMCP</p>
            </div>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "leads" as const, label: "Leads", icon: User },
            { id: "composer" as const, label: "AI Composer", icon: MessageSquare },
            { id: "scraper" as const, label: "Scraper", icon: Search },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                view === tab.id ? "text-white" : "glass-card text-text-dim hover:text-text"
              )}
              style={view === tab.id ? { background: "#0a66c2" } : {}}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leads View */}
        {view === "leads" && (
          <div>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-[#0a66c2]/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-white/[0.03] transition-all group cursor-pointer"
                  onClick={() => { setSelectedLead(lead); setView("composer"); setMessage("") }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange to-pink flex items-center justify-center text-sm font-black text-bg shrink-0">
                    {lead.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-text">{lead.name}</span>
                      {lead.connected && <span className="w-1.5 h-1.5 rounded-full bg-neon" />}
                    </div>
                    <p className="text-xs text-text-dim truncate">{lead.title} at {lead.company}</p>
                  </div>
                  <span className="text-xs text-text-muted">{lead.location}</span>

                  {/* Score ring */}
                  <div className="relative w-10 h-10 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.5" fill="none"
                        stroke={lead.score >= 90 ? "#00ff88" : lead.score >= 80 ? "#00d4ff" : "#ff6b35"}
                        strokeWidth="3"
                        strokeDasharray={`${lead.score} ${100 - lead.score}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{lead.score}</span>
                  </div>

                  <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Composer View */}
        {view === "composer" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead selector sidebar */}
            <div className="glass-card rounded-xl p-4 max-h-[600px] overflow-y-auto">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Select Lead</p>
              <div className="space-y-1">
                {MOCK_LEADS.map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => { setSelectedLead(lead); setMessage("") }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all",
                      selectedLead?.id === lead.id ? "bg-[#0a66c2]/15 border border-[#0a66c2]/30" : "hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange to-pink flex items-center justify-center text-[10px] font-black text-bg shrink-0">
                      {lead.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text truncate">{lead.name}</p>
                      <p className="text-[10px] text-text-dim truncate">{lead.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <div className="lg:col-span-2 space-y-4">
              {selectedLead ? (
                <>
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-text">Message to {selectedLead.name}</h3>
                        <p className="text-xs text-text-dim">{selectedLead.title} at {selectedLead.company}</p>
                      </div>
                      <button
                        onClick={generateMsg}
                        disabled={generating}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ background: "#0a66c2", color: "#fff" }}
                      >
                        {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {generating ? "Generating..." : "Generate with AI"}
                      </button>
                    </div>

                    {/* Tone selector */}
                    <div className="flex gap-2 mb-4">
                      {(Object.keys(TONE_CONFIG) as Tone[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTone(t)}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-full transition-all",
                            tone === t ? "bg-white/10 text-text font-bold" : "glass-card text-text-dim"
                          )}
                        >
                          {TONE_CONFIG[t].emoji} {TONE_CONFIG[t].label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Your personalized message will appear here..."
                      rows={10}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-[#0a66c2]/40 transition-all resize-none"
                    />

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-text-muted">{message.length} / 2000</span>
                      <div className="flex gap-2">
                        <button onClick={copyMsg} disabled={!message} className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass-card text-xs font-bold text-text-dim disabled:opacity-30 hover:bg-white/[0.06] transition-all">
                          {copied ? <Check size={10} /> : <Copy size={10} />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                        <button disabled={!message} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-30 transition-all" style={{ background: "#0a66c2" }}>
                          <Send size={10} />
                          Send via LinkedIn
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-card rounded-xl p-12 text-center text-text-dim">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Select a lead to compose a message</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scraper View */}
        {view === "scraper" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">LinkedIn URL</label>
              <div className="flex gap-3">
                <input
                  value={scrapeUrl}
                  onChange={e => setScrapeUrl(e.target.value)}
                  placeholder="Paste LinkedIn profile or search URL..."
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-[#0a66c2]/40 transition-all"
                />
                <button
                  onClick={async () => { setScraping(true); await new Promise(r => setTimeout(r, 2000)); setScraping(false); setScrapeUrl("") }}
                  disabled={!scrapeUrl || scraping}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-30 transition-all"
                  style={{ background: "#0a66c2" }}
                >
                  {scraping ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  {scraping ? "Scraping..." : "Scrape"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Star, label: "Sales Navigator", desc: "Import from search" },
                { icon: User, label: "Bulk Import", desc: "Upload CSV file" },
                { icon: Linkedin, label: "Connections", desc: "Your 1st degree" },
                { icon: Camera, label: "Auto Screenshot", desc: "Capture profiles" },
              ].map(action => (
                <button key={action.label} className="glass-card rounded-xl p-4 text-left hover:bg-white/[0.04] transition-all">
                  <action.icon size={20} className="text-[#0a66c2] mb-2" />
                  <p className="text-xs font-bold text-text">{action.label}</p>
                  <p className="text-[10px] text-text-dim">{action.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

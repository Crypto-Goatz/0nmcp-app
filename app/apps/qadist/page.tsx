"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Search, Send, Copy, Check, Loader2,
  Globe, MessageSquare, Target, Calendar, Sparkles,
  BarChart3, ExternalLink, Radio, Users, BookOpen,
  ChevronRight, Star, Zap
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── PLATFORM DATA ────────────────────────────────────────
type PlatformId = "quora" | "reddit" | "growthhackers" | "indiehackers" | "medium" | "producthunt" | "hackernews" | "warriorforum" | "devto" | "hashnode" | "poe" | "linkedin"

interface Platform {
  id: PlatformId
  name: string
  da: number
  linkType: "dofollow" | "nofollow" | "mixed" | "none"
  automation: "full" | "semi" | "manual"
  relevance: number
  tone: string
  color: string
}

const PLATFORMS: Platform[] = [
  { id: "quora", name: "Quora", da: 93, linkType: "nofollow", automation: "semi", relevance: 9, tone: "Expert, educational", color: "#B92B27" },
  { id: "reddit", name: "Reddit", da: 99, linkType: "nofollow", automation: "semi", relevance: 8, tone: "Casual, authentic", color: "#FF4500" },
  { id: "growthhackers", name: "GrowthHackers", da: 68, linkType: "dofollow", automation: "semi", relevance: 10, tone: "Data-driven", color: "#00BF63" },
  { id: "indiehackers", name: "Indie Hackers", da: 78, linkType: "dofollow", automation: "semi", relevance: 9, tone: "Founder-to-founder", color: "#1F7AF7" },
  { id: "medium", name: "Medium", da: 96, linkType: "nofollow", automation: "full", relevance: 7, tone: "Storytelling", color: "#000000" },
  { id: "producthunt", name: "Product Hunt", da: 90, linkType: "dofollow", automation: "semi", relevance: 8, tone: "Product-focused", color: "#DA552F" },
  { id: "hackernews", name: "Hacker News", da: 92, linkType: "nofollow", automation: "manual", relevance: 6, tone: "Technical depth", color: "#FF6600" },
  { id: "warriorforum", name: "Warrior Forum", da: 72, linkType: "mixed", automation: "manual", relevance: 8, tone: "Results-focused", color: "#CC0000" },
  { id: "devto", name: "Dev.to", da: 85, linkType: "dofollow", automation: "full", relevance: 6, tone: "Developer-friendly", color: "#0A0A0A" },
  { id: "hashnode", name: "Hashnode", da: 82, linkType: "dofollow", automation: "full", relevance: 5, tone: "Technical blog", color: "#2962FF" },
  { id: "poe", name: "Poe (AI Bot)", da: 75, linkType: "none", automation: "full", relevance: 7, tone: "Conversational", color: "#5B4ADB" },
  { id: "linkedin", name: "LinkedIn", da: 98, linkType: "nofollow", automation: "semi", relevance: 8, tone: "Professional", color: "#0A66C2" },
]

const SUBREDDITS = [
  "r/marketing", "r/SEO", "r/SaaS", "r/startups", "r/Entrepreneur",
  "r/GrowthHacking", "r/webdev", "r/SmallBusiness", "r/digital_marketing",
  "r/analytics", "r/PPC", "r/content_marketing", "r/ecommerce", "r/bigseo"
]

const FORUMS = [
  { name: "Warrior Forum", da: 72, niche: "Internet Marketing", activity: "High" },
  { name: "BlackHatWorld", da: 71, niche: "SEO / Marketing", activity: "Very High" },
  { name: "GrowthHackers", da: 68, niche: "Growth", activity: "Medium" },
  { name: "Indie Hackers", da: 78, niche: "Startups", activity: "High" },
  { name: "Moz Community", da: 91, niche: "SEO", activity: "Medium" },
  { name: "WebmasterWorld", da: 62, niche: "Webmaster", activity: "Medium" },
  { name: "Digital Point", da: 60, niche: "General Marketing", activity: "Medium" },
  { name: "Affilorama", da: 55, niche: "Affiliate", activity: "Low" },
  { name: "STM Forum", da: 48, niche: "Affiliate/Media Buy", activity: "Medium" },
  { name: "WickedFire", da: 45, niche: "Monetization", activity: "Low" },
]

type Tab = "generator" | "reddit" | "forums" | "schedule"

interface GeneratedContent {
  platform: string
  content: string
  wordCount: number
  scores: { authenticity: number; value: number; seo: number; platformFit: number }
}

// ─── WEEKLY SCHEDULE DATA ─────────────────────────────────
const WEEKLY_SCHEDULE = [
  { day: "Monday", platforms: ["Quora (2 answers)", "Reddit (3 comments)"], effort: "45 min", backlinks: 2 },
  { day: "Tuesday", platforms: ["LinkedIn (1 post)", "Medium (1 article)"], effort: "90 min", backlinks: 1 },
  { day: "Wednesday", platforms: ["Indie Hackers (1 post)", "Dev.to (1 article)"], effort: "60 min", backlinks: 2 },
  { day: "Thursday", platforms: ["Reddit (3 comments)", "Quora (2 answers)"], effort: "45 min", backlinks: 2 },
  { day: "Friday", platforms: ["GrowthHackers (1 post)", "Product Hunt (engage)"], effort: "60 min", backlinks: 2 },
  { day: "Saturday", platforms: ["Forum posts (2)", "Hashnode (1 article)"], effort: "45 min", backlinks: 2 },
  { day: "Sunday", platforms: ["Review & plan next week"], effort: "30 min", backlinks: 0 },
]

export default function QADistPage() {
  const [tab, setTab] = useState<Tab>("generator")
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformId>>(new Set(["quora", "reddit", "indiehackers"]))
  const [includeBacklinks, setIncludeBacklinks] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedContent[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // Reddit state
  const [redditPost, setRedditPost] = useState("")
  const [redditSubreddit, setRedditSubreddit] = useState("")
  const [redditGenerating, setRedditGenerating] = useState(false)
  const [redditResponse, setRedditResponse] = useState("")

  const togglePlatform = (id: PlatformId) => {
    const next = new Set(selectedPlatforms)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedPlatforms(next)
  }

  const handleGenerate = async () => {
    if (!topic) return
    setGenerating(true)
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000))
    const results: GeneratedContent[] = Array.from(selectedPlatforms).map(pid => {
      const p = PLATFORMS.find(pl => pl.id === pid)!
      const kw = keywords.split(",").map(k => k.trim()).filter(Boolean)
      const kwText = kw.length > 0 ? `\n\nKey areas to focus on: ${kw.join(", ")}.` : ""
      const backlink = includeBacklinks ? `\n\nFor a deeper dive into ${topic.toLowerCase()}, check out our comprehensive guide at 0nmcp.com/guides — it covers everything from setup to advanced workflows.` : ""

      const toneMap: Record<string, string> = {
        quora: `Great question! As someone who's spent years working with AI automation tools, I can share some practical insights on ${topic}.\n\nThe key challenge most teams face is orchestrating multiple services without creating brittle, hard-to-maintain integrations. Here's what I've found works best:\n\n1. **Start with natural language** — Instead of manually configuring each connection, describe what you want in plain English\n2. **Use a unified orchestrator** — Rather than managing 10 different API integrations, funnel everything through one control plane\n3. **Automate the handoffs** — The magic happens when Service A automatically triggers Service B without human intervention${kwText}${backlink}\n\nHope this helps! Happy to elaborate on any specific aspect.`,
        reddit: `Been doing this for about 2 years now and here's what actually works (not just the theoretical stuff):\n\nThe biggest game changer was moving away from Zapier/Make type tools and using something that lets you describe workflows in natural language. Seriously, the amount of time I was spending clicking through UI builders was insane.\n\nFor ${topic}, here's what I'd recommend:\n- Don't try to automate everything at once. Pick your 3 most painful manual processes first\n- Make sure your tools actually talk to each other natively, not through 5 middleware layers\n- Test with real data, not dummy stuff${kwText}${backlink}`,
        growthhackers: `# ${topic}: A Data-Driven Approach\n\nWe ran an experiment across our client base (n=47 SaaS companies) and found some interesting patterns.\n\n**The Problem:** Manual processes between tools create ~4.2 hours of wasted time per employee per week.\n\n**The Solution:** Implementing a unified API orchestrator that connects all services through natural language commands.\n\n**Results:**\n- 67% reduction in manual data entry\n- 3.2x faster lead response times\n- 89% fewer integration failures${kwText}${backlink}`,
        indiehackers: `Hey IH! 👋 Building in public here.\n\nSo we've been working on this problem of ${topic.toLowerCase()} for the past 6 months and wanted to share what we've learned.\n\n**The honest truth:** Most automation tools are overengineered for what 90% of founders actually need. You don't need a visual workflow builder with 47 nodes — you need to say "when someone fills out my form, add them to my CRM and send a welcome email."\n\nThat's literally it. One sentence. Done.\n\nWe built this because we were frustrated with the complexity tax that existing tools impose.${kwText}${backlink}\n\nWould love to hear how others are handling this!`,
        medium: `# ${topic}\n\n*How we're rethinking service automation for the AI age*\n\nIn the past decade, we've seen an explosion of SaaS tools. The average company now uses 110+ software applications. But connecting them? That's still stuck in 2015.\n\nDrag-and-drop workflow builders were revolutionary when they launched. But they've become the new bottleneck — creating visual spaghetti that nobody wants to maintain.\n\n## The Natural Language Shift\n\nWhat if instead of building workflows, you could just *describe outcomes*?${kwText}${backlink}`,
        producthunt: `🚀 Excited to share our approach to ${topic}!\n\nWe built this because we were tired of:\n❌ Clicking through visual workflow builders\n❌ Managing API keys across 15 different tools\n❌ Debugging broken automations at 2am\n\nInstead, we wanted:\n✅ Describe what you want in plain English\n✅ One command to connect everything\n✅ It just works™${kwText}${backlink}`,
        hackernews: `Interesting topic. Here's a technical perspective on ${topic}.\n\nThe fundamental issue is that most integration platforms are built on event-driven architectures with rigid schemas. When you need to connect Service A to Service B, you're essentially writing a translation layer.\n\nA more elegant approach: treat the orchestrator as an AI middleware that understands intent, not just data mapping. Feed it natural language, let it figure out the API calls.\n\nThe tradeoff is latency vs. flexibility — but for most business workflows, an extra 200ms is irrelevant compared to hours saved.${kwText}`,
        warriorforum: `Let me cut straight to the chase on ${topic}.\n\nI've tested literally every automation tool out there — Zapier, Make, n8n, Pipedream — and they all have the same fundamental problem: they make YOU do the work of figuring out how services connect.\n\nWhat if you could just say what you want?\n\n"When someone books a meeting, add them to my CRM, send a confirmation email, and create a Slack notification."\n\nThat's one sentence. No nodes. No connectors. No debugging.\n\nResults we're seeing: 3x faster setup, 80% fewer failed automations, massive time savings.${kwText}${backlink}`,
        devto: `## ${topic}\n\n\`\`\`bash\n# The old way\ncurl -X POST https://api.service-a.com/webhook \\\n  -H "Authorization: Bearer $TOKEN_A" \\\n  -d '{"event": "trigger", "target": "service-b"}'\n\n# The new way\nnpx 0nmcp "Connect Service A to Service B"\n\`\`\`\n\nAs developers, we've been building integration layers for years. REST APIs, webhooks, message queues — all great, but they require us to be the middleware.\n\nWhat if the middleware understood intent?${kwText}${backlink}`,
        hashnode: `# ${topic}: A Developer's Guide\n\nIf you're building anything that connects multiple services, this post is for you.\n\n## The Problem\n\nEvery SaaS product has an API. Every API has its own auth mechanism, rate limits, data format, and quirks. Connecting three services means understanding three different paradigms.\n\n## A Better Approach\n\nNatural language orchestration. Instead of writing glue code, describe what you want the system to do.${kwText}${backlink}`,
        poe: `I'd be happy to help you understand ${topic}!\n\nThink of it this way: imagine you have 59 different tools (email, CRM, calendar, payments, etc.) and you want them all to work together automatically.\n\nTraditionally, you'd need to:\n1. Learn each tool's API\n2. Write code to connect them\n3. Handle errors, retries, rate limits\n4. Maintain it forever\n\nWith an AI orchestrator, you just describe what you want: "When a customer pays, send them a thank you email and add them to my VIP list."\n\nThe AI handles the rest — figuring out which APIs to call, in what order, with what data.${kwText}`,
        linkedin: `${topic} — here's what I've learned after 2 years of building in this space.\n\nThe automation industry is at an inflection point. We've moved from:\n\n📋 Manual processes → ⚙️ Rule-based automation → 🤖 AI-driven orchestration\n\nThe companies winning right now aren't the ones with the most automations — they're the ones where every team member can create automations without writing code.\n\nNatural language is the new interface. "Connect my CRM to Slack" is replacing drag-and-drop workflow builders.\n\nWhat are you seeing in your organization?${kwText}${backlink}`,
      }

      const content = toneMap[pid] || toneMap.quora
      return {
        platform: p.name,
        content,
        wordCount: content.split(/\s+/).length,
        scores: {
          authenticity: 7 + Math.floor(Math.random() * 3),
          value: 7 + Math.floor(Math.random() * 3),
          seo: 6 + Math.floor(Math.random() * 4),
          platformFit: 8 + Math.floor(Math.random() * 2),
        },
      }
    })
    setGenerated(results)
    setGenerating(false)
  }

  const handleRedditGenerate = async () => {
    if (!redditPost) return
    setRedditGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setRedditResponse(`Great question! This is something I've been working on extensively.\n\nBased on what you're describing${redditSubreddit ? ` (common challenge in ${redditSubreddit})` : ""}, here's what I'd recommend:\n\n1. Start by mapping out your current manual processes — you'll be surprised how many could be automated\n2. Look for tools that support natural language commands rather than complex visual builders\n3. Focus on the workflows that save the most time first (usually lead management and notifications)\n\nWe've seen teams cut their integration setup time by 80% using this approach. The key insight is that you don't need to understand APIs — you just need to describe what you want to happen.\n\nHappy to share more specifics if you have a particular use case in mind!`)
    setRedditGenerating(false)
  }

  const copyContent = (idx: number) => {
    navigator.clipboard.writeText(generated[idx].content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-cyan/15">
              <Target size={28} className="text-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">QA Distribution Engine</h1>
              <p className="text-sm text-text-dim">AI-powered content distribution across 12 platforms — Powered by 0nMCP</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Platforms", value: "12", color: "text-cyan" },
            { label: "Avg DA", value: "86", color: "text-neon" },
            { label: "Dofollow", value: "5", color: "text-purple" },
            { label: "Subreddits", value: "14", color: "text-orange" },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-3 text-center">
              <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: "generator" as const, label: "Content Generator", icon: Sparkles },
            { id: "reddit" as const, label: "Reddit Monitor", icon: Radio },
            { id: "forums" as const, label: "Forums", icon: Users },
            { id: "schedule" as const, label: "Schedule", icon: Calendar },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                tab === t.id ? "bg-cyan/15 text-cyan border border-cyan/30" : "glass-card text-text-dim hover:text-text"
              )}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── GENERATOR TAB ────────────────────────── */}
        {tab === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6">
            {/* Left: Controls */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Topic / Question</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., How to automate multi-service workflows with AI..."
                  rows={3}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-all resize-none"
                />
              </div>

              <div className="glass-card rounded-xl p-5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Target Keywords</label>
                <input
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="automation, MCP, AI orchestration"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-all"
                />
              </div>

              <div className="glass-card rounded-xl p-5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 block">
                  Platforms ({selectedPlatforms.size} selected)
                </label>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all",
                        selectedPlatforms.has(p.id) ? "bg-cyan/10 border border-cyan/20" : "hover:bg-white/[0.04]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                          selectedPlatforms.has(p.id) ? "border-cyan bg-cyan" : "border-border"
                        )}
                      >
                        {selectedPlatforms.has(p.id) && <Check size={10} className="text-bg" />}
                      </div>
                      <span className="text-xs font-bold text-text flex-1">{p.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">DA {p.da}</span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded",
                        p.linkType === "dofollow" ? "bg-neon/10 text-neon" : p.linkType === "nofollow" ? "bg-orange/10 text-orange" : "bg-purple/10 text-purple"
                      )}>
                        {p.linkType}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setIncludeBacklinks(!includeBacklinks)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all relative",
                      includeBacklinks ? "bg-cyan" : "bg-border"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all",
                      includeBacklinks ? "left-5.5" : "left-0.5"
                    )} style={{ left: includeBacklinks ? 22 : 2 }} />
                  </div>
                  <span className="text-xs font-bold text-text">Include Natural Backlinks</span>
                </label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic || selectedPlatforms.size === 0 || generating}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-bg disabled:opacity-30 transition-all bg-gradient-to-r from-cyan to-purple"
              >
                {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {generating ? "Generating..." : `Generate for ${selectedPlatforms.size} Platforms`}
              </button>
            </div>

            {/* Right: Results */}
            <div>
              {generated.length > 0 ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="flex gap-3 mb-2">
                    {[
                      { label: "Platforms", value: generated.length },
                      { label: "Total Words", value: generated.reduce((s, g) => s + g.wordCount, 0) },
                      { label: "Backlinks", value: includeBacklinks ? generated.length : 0 },
                    ].map(s => (
                      <div key={s.label} className="glass-card rounded-lg px-4 py-2 text-center">
                        <div className="text-lg font-black text-cyan">{s.value}</div>
                        <div className="text-[9px] text-text-muted uppercase">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {generated.map((g, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card rounded-xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text">{g.platform}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">{g.wordCount} words</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            {[
                              { label: "Auth", score: g.scores.authenticity },
                              { label: "Value", score: g.scores.value },
                              { label: "SEO", score: g.scores.seo },
                              { label: "Fit", score: g.scores.platformFit },
                            ].map(s => (
                              <span key={s.label} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">
                                {s.label}: <span className={s.score >= 8 ? "text-neon" : s.score >= 6 ? "text-cyan" : "text-orange"}>{s.score}/10</span>
                              </span>
                            ))}
                          </div>
                          <button onClick={() => copyContent(idx)} className="flex items-center gap-1 text-xs text-text-muted hover:text-cyan transition-colors">
                            {copiedIdx === idx ? <Check size={10} /> : <Copy size={10} />}
                            {copiedIdx === idx ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <pre className="px-5 py-4 text-sm text-text-dim leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
                        {g.content}
                      </pre>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-16 text-center text-text-muted">
                  <Sparkles size={36} className="mx-auto mb-3 opacity-20" />
                  <h3 className="text-sm font-bold mb-1">AI Content Generator</h3>
                  <p className="text-xs">Enter a topic, select platforms, and generate platform-authentic content with natural backlinks.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── REDDIT MONITOR TAB ───────────────────── */}
        {tab === "reddit" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Response generator */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-bold mb-4">Generate Reddit Response</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Subreddit</label>
                    <select
                      value={redditSubreddit}
                      onChange={e => setRedditSubreddit(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-cyan/40"
                    >
                      <option value="">Select subreddit...</option>
                      {SUBREDDITS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Post Title / Body</label>
                    <textarea
                      value={redditPost}
                      onChange={e => setRedditPost(e.target.value)}
                      placeholder="Paste the Reddit post you want to respond to..."
                      rows={5}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleRedditGenerate}
                    disabled={!redditPost || redditGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-bg disabled:opacity-30 transition-all"
                    style={{ background: "#FF4500" }}
                  >
                    {redditGenerating ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                    {redditGenerating ? "Generating..." : "Generate Response"}
                  </button>
                </div>

                {redditResponse && (
                  <div className="mt-4 p-4 bg-surface rounded-xl">
                    <pre className="text-sm text-text-dim whitespace-pre-wrap leading-relaxed">{redditResponse}</pre>
                    <button
                      onClick={() => { navigator.clipboard.writeText(redditResponse); }}
                      className="mt-2 text-xs text-text-muted hover:text-cyan transition-colors flex items-center gap-1"
                    >
                      <Copy size={10} /> Copy Response
                    </button>
                  </div>
                )}
              </div>

              {/* Monitoring setup */}
              <div className="space-y-4">
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-sm font-bold mb-3">Tracked Subreddits</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBREDDITS.map(s => (
                      <span key={s} className="text-[10px] px-2.5 py-1 rounded-full bg-[#FF4500]/10 text-[#FF4500] font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-sm font-bold mb-3">Automation Integrations</h3>
                  <div className="space-y-2">
                    {[
                      { name: "F5Bot", desc: "Free Reddit keyword monitoring (up to 200 keywords)", status: "Ready" },
                      { name: "n8n Workflow", desc: "Automated search + AI response pipeline", status: "Template" },
                      { name: "Poe Bot", desc: "24/7 brand awareness bot on Poe.com", status: "Template" },
                    ].map(int => (
                      <div key={int.name} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-all">
                        <div>
                          <span className="text-xs font-bold text-text">{int.name}</span>
                          <p className="text-[10px] text-text-muted">{int.desc}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-neon/10 text-neon font-bold">{int.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-sm font-bold mb-2">10:1 Rule Tracker</h3>
                  <p className="text-[10px] text-text-muted mb-3">Reddit requires 10 helpful contributions per 1 self-promotional post</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-neon to-cyan" style={{ width: "73%" }} />
                    </div>
                    <span className="text-xs font-bold text-neon">7.3 / 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FORUMS TAB ───────────────────────────── */}
        {tab === "forums" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5 mb-4">
              <h3 className="text-sm font-bold mb-1">Known Marketing Forums</h3>
              <p className="text-xs text-text-muted">Pre-configured forums with engagement recommendations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FORUMS.map((forum, i) => (
                <motion.div
                  key={forum.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl px-5 py-4 hover:bg-white/[0.03] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-text">{forum.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan font-bold">DA {forum.da}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-text-muted">
                    <span>{forum.niche}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded",
                      forum.activity === "Very High" ? "bg-neon/10 text-neon" :
                      forum.activity === "High" ? "bg-cyan/10 text-cyan" :
                      forum.activity === "Medium" ? "bg-orange/10 text-orange" :
                      "bg-white/5 text-text-muted"
                    )}>
                      {forum.activity} Activity
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-bold mb-3">AI Forum Discovery</h3>
              <p className="text-xs text-text-muted mb-3">Find new forums in your niche using AI-powered search</p>
              <div className="flex gap-3">
                <input
                  placeholder="Enter your niche (e.g., AI automation, SaaS growth)..."
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40"
                />
                <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-bg bg-gradient-to-r from-cyan to-purple">
                  <Search size={14} /> Discover
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── SCHEDULE TAB ─────────────────────────── */}
        {tab === "schedule" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Hours/Week", value: "~6.25", color: "text-cyan" },
                { label: "Backlinks/Week", value: "~11", color: "text-neon" },
                { label: "Backlinks/Month", value: "~44", color: "text-purple" },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                  <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {WEEKLY_SCHEDULE.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl px-5 py-4 flex items-center gap-4"
                >
                  <span className="text-sm font-black text-text w-24">{day.day}</span>
                  <div className="flex-1">
                    {day.platforms.map(p => (
                      <span key={p} className="text-xs text-text-dim mr-3">{p}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-text-muted">{day.effort}</span>
                  <div className="flex items-center gap-1">
                    <ExternalLink size={10} className="text-neon" />
                    <span className="text-xs font-bold text-neon">{day.backlinks}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

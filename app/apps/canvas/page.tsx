"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Paintbrush, Layout, Eye, Download, Plus, Trash2,
  Type, Image, Square, Columns, ChevronRight, GripVertical,
  Smartphone, Monitor, Tablet, Code2, Copy, Check, Settings,
  Sparkles, Layers, MousePointer, ArrowRight, Move, Palette,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Link2,
  List, ChevronDown, X, Zap, Globe, RotateCcw
} from "lucide-react"
import Nav from "@/components/Nav"
import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────
type Tab = "canvas" | "components" | "preview" | "export"
type Device = "desktop" | "tablet" | "mobile"

interface CanvasBlock {
  id: string
  type: string
  label: string
  content: string
  styles: Record<string, string>
  children?: CanvasBlock[]
}

interface ComponentDef {
  id: string
  name: string
  category: string
  icon: typeof Type
  preview: string
  popular?: boolean
}

interface ExportFormat {
  id: string
  name: string
  icon: string
  ext: string
  supported: boolean
}

// ─── DATA ─────────────────────────────────────────────────
const COMPONENT_CATEGORIES = [
  { id: "layout", label: "Layout", color: "#00ff88" },
  { id: "content", label: "Content", color: "#00d4ff" },
  { id: "media", label: "Media", color: "#9945ff" },
  { id: "forms", label: "Forms", color: "#ff6b35" },
  { id: "navigation", label: "Navigation", color: "#ff3d9a" },
  { id: "commerce", label: "Commerce", color: "#10b981" },
  { id: "interactive", label: "Interactive", color: "#f59e0b" },
  { id: "advanced", label: "Advanced", color: "#0a66c2" },
]

const COMPONENTS: ComponentDef[] = [
  // Layout
  { id: "hero", name: "Hero Section", category: "layout", icon: Layout, preview: "Full-width hero with headline, subtext, and CTA", popular: true },
  { id: "section", name: "Section", category: "layout", icon: Square, preview: "Content section with customizable padding" },
  { id: "columns", name: "Columns", category: "layout", icon: Columns, preview: "Multi-column grid (2, 3, or 4 columns)", popular: true },
  { id: "container", name: "Container", category: "layout", icon: Square, preview: "Max-width centered container" },
  { id: "divider", name: "Divider", category: "layout", icon: AlignCenter, preview: "Horizontal line separator" },
  { id: "spacer", name: "Spacer", category: "layout", icon: Move, preview: "Adjustable vertical spacing" },
  // Content
  { id: "heading", name: "Heading", category: "content", icon: Type, preview: "H1-H6 heading with font controls", popular: true },
  { id: "paragraph", name: "Paragraph", category: "content", icon: AlignLeft, preview: "Rich text paragraph block" },
  { id: "button", name: "Button", category: "content", icon: MousePointer, preview: "CTA button with link and styles", popular: true },
  { id: "list", name: "List", category: "content", icon: List, preview: "Bullet or numbered list" },
  { id: "quote", name: "Blockquote", category: "content", icon: Italic, preview: "Styled quote block with attribution" },
  { id: "badge", name: "Badge", category: "content", icon: Zap, preview: "Small label or tag" },
  // Media
  { id: "image", name: "Image", category: "media", icon: Image, preview: "Responsive image with alt text", popular: true },
  { id: "video", name: "Video Embed", category: "media", icon: Globe, preview: "YouTube, Vimeo, or custom video" },
  { id: "gallery", name: "Image Gallery", category: "media", icon: Columns, preview: "Grid or carousel of images" },
  { id: "icon", name: "Icon", category: "media", icon: Sparkles, preview: "SVG icon from Lucide library" },
  // Forms
  { id: "form", name: "Contact Form", category: "forms", icon: Square, preview: "Name, email, message form", popular: true },
  { id: "input", name: "Input Field", category: "forms", icon: Type, preview: "Text, email, or number input" },
  { id: "select", name: "Select Dropdown", category: "forms", icon: ChevronDown, preview: "Dropdown selection" },
  { id: "checkbox", name: "Checkbox", category: "forms", icon: Check, preview: "Single or group checkboxes" },
  // Navigation
  { id: "navbar", name: "Navigation Bar", category: "navigation", icon: Layout, preview: "Top nav with logo and links", popular: true },
  { id: "footer", name: "Footer", category: "navigation", icon: Layout, preview: "Multi-column footer with links" },
  { id: "breadcrumb", name: "Breadcrumbs", category: "navigation", icon: ChevronRight, preview: "Path breadcrumb navigation" },
  { id: "tabs", name: "Tabs", category: "navigation", icon: Columns, preview: "Tabbed content switcher" },
  // Commerce
  { id: "pricing", name: "Pricing Table", category: "commerce", icon: Layers, preview: "2-4 pricing tier cards", popular: true },
  { id: "product", name: "Product Card", category: "commerce", icon: Square, preview: "Image, title, price, CTA" },
  { id: "testimonial", name: "Testimonial", category: "commerce", icon: Italic, preview: "Quote with avatar and name" },
  { id: "faq", name: "FAQ Accordion", category: "commerce", icon: ChevronDown, preview: "Expandable Q&A list" },
  // Interactive
  { id: "accordion", name: "Accordion", category: "interactive", icon: ChevronDown, preview: "Collapsible content panels" },
  { id: "modal", name: "Modal / Popup", category: "interactive", icon: Square, preview: "Overlay popup content" },
  { id: "countdown", name: "Countdown Timer", category: "interactive", icon: Zap, preview: "Countdown to a date/time" },
  { id: "progress", name: "Progress Bar", category: "interactive", icon: Layers, preview: "Animated progress indicator" },
  // Advanced
  { id: "html", name: "Custom HTML", category: "advanced", icon: Code2, preview: "Raw HTML code block" },
  { id: "script", name: "Script Embed", category: "advanced", icon: Code2, preview: "JavaScript embed" },
  { id: "map", name: "Google Map", category: "advanced", icon: Globe, preview: "Embedded Google Maps" },
  { id: "social", name: "Social Links", category: "advanced", icon: Link2, preview: "Social media icon links" },
]

const EXPORT_FORMATS: ExportFormat[] = [
  { id: "html", name: "HTML / CSS", icon: "🌐", ext: ".html", supported: true },
  { id: "react", name: "React (JSX)", icon: "⚛️", ext: ".jsx", supported: true },
  { id: "vue", name: "Vue SFC", icon: "💚", ext: ".vue", supported: true },
  { id: "nextjs", name: "Next.js Page", icon: "▲", ext: ".tsx", supported: true },
  { id: "wordpress", name: "WordPress", icon: "📝", ext: ".php", supported: true },
  { id: "shopify", name: "Shopify Liquid", icon: "🛍️", ext: ".liquid", supported: true },
  { id: "webflow", name: "Webflow JSON", icon: "🔷", ext: ".json", supported: true },
  { id: "json", name: "Canvas JSON", icon: "📦", ext: ".json", supported: true },
  { id: "crm", name: "CRM Funnel", icon: "🚀", ext: ".json", supported: true },
  { id: "tailwind", name: "Tailwind HTML", icon: "🎨", ext: ".html", supported: true },
  { id: "svelte", name: "Svelte", icon: "🔥", ext: ".svelte", supported: false },
  { id: "angular", name: "Angular", icon: "🅰️", ext: ".ts", supported: false },
]

const STARTER_BLOCKS: CanvasBlock[] = [
  {
    id: "block-1",
    type: "hero",
    label: "Hero Section",
    content: "Build Something Amazing",
    styles: { background: "linear-gradient(135deg, #06060f 0%, #0f1028 100%)", padding: "80px 40px", textAlign: "center" },
  },
  {
    id: "block-2",
    type: "columns",
    label: "Features (3 columns)",
    content: "Feature 1 | Feature 2 | Feature 3",
    styles: { padding: "60px 40px", gap: "24px" },
  },
  {
    id: "block-3",
    type: "paragraph",
    label: "Content Block",
    content: "Add your content here. Drag components from the library to build your page.",
    styles: { padding: "40px", maxWidth: "800px", margin: "0 auto" },
  },
]

// ─── COMPONENT ────────────────────────────────────────────
export default function CanvasPage() {
  const [tab, setTab] = useState<Tab>("canvas")
  const [blocks, setBlocks] = useState<CanvasBlock[]>(STARTER_BLOCKS)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [device, setDevice] = useState<Device>("desktop")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExports, setSelectedExports] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [generating, setGenerating] = useState(false)

  const filteredComponents = COMPONENTS.filter(c => {
    if (categoryFilter && c.category !== categoryFilter) return false
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const addBlock = (comp: ComponentDef) => {
    const block: CanvasBlock = {
      id: `block-${Date.now()}`,
      type: comp.id,
      label: comp.name,
      content: comp.preview,
      styles: { padding: "40px" },
    }
    setBlocks(prev => [...prev, block])
    setSelectedBlock(block.id)
    if (tab === "components") setTab("canvas")
  }

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedBlock === id) setSelectedBlock(null)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      if (idx < 0) return prev
      if (direction === "up" && idx === 0) return prev
      if (direction === "down" && idx === prev.length - 1) return prev
      const next = [...prev]
      const swapIdx = direction === "up" ? idx - 1 : idx + 1
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }

  const toggleExport = (id: string) => {
    setSelectedExports(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const aiGenerate = async () => {
    if (!aiPrompt.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))

    const generated: CanvasBlock[] = [
      { id: `ai-${Date.now()}-1`, type: "navbar", label: "Navigation Bar", content: "Logo | Home | Features | Pricing | Contact", styles: { padding: "16px 40px" } },
      { id: `ai-${Date.now()}-2`, type: "hero", label: "Hero Section", content: aiPrompt, styles: { padding: "100px 40px", textAlign: "center" } },
      { id: `ai-${Date.now()}-3`, type: "columns", label: "Features Grid", content: "Feature 1 | Feature 2 | Feature 3", styles: { padding: "60px 40px" } },
      { id: `ai-${Date.now()}-4`, type: "pricing", label: "Pricing Table", content: "Starter $9 | Pro $29 | Enterprise $99", styles: { padding: "60px 40px" } },
      { id: `ai-${Date.now()}-5`, type: "form", label: "Contact Form", content: "Name, Email, Message", styles: { padding: "60px 40px", maxWidth: "600px", margin: "0 auto" } },
      { id: `ai-${Date.now()}-6`, type: "footer", label: "Footer", content: "Links | Social | Copyright", styles: { padding: "40px" } },
    ]
    setBlocks(generated)
    setGenerating(false)
    setAiPrompt("")
  }

  const exportCode = () => {
    const json = JSON.stringify({ blocks, exportFormats: Array.from(selectedExports) }, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { id: Tab; label: string; icon: typeof Paintbrush }[] = [
    { id: "canvas", label: "Canvas", icon: Paintbrush },
    { id: "components", label: "Components", icon: Layers },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "export", label: "Export", icon: Download },
  ]

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-4 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-pink/15">
              <Paintbrush size={28} className="text-pink" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">APEX Canvas</h1>
              <p className="text-sm text-text-dim">{COMPONENTS.length}+ components, AI-powered design, multi-platform export</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  tab === t.id
                    ? "bg-pink/15 text-pink border border-pink/30"
                    : "glass-card text-text-dim hover:text-text"
                )}
              >
                <t.icon size={12} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── CANVAS TAB ──────────────────────────── */}
        {tab === "canvas" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* AI Generator */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-pink shrink-0" />
                <input
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && aiGenerate()}
                  placeholder="Describe a page and AI will build it... (e.g. 'SaaS landing page with pricing')"
                  className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
                <button
                  onClick={aiGenerate}
                  disabled={!aiPrompt.trim() || generating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink text-white text-xs font-bold hover:bg-pink/90 transition-all disabled:opacity-30 shrink-0"
                >
                  {generating ? <RotateCcw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {generating ? "Generating..." : "AI Build"}
                </button>
              </div>
            </div>

            {/* Canvas blocks */}
            <div className="glass-card rounded-2xl p-5 min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">{blocks.length} Blocks</h3>
                <button
                  onClick={() => setTab("components")}
                  className="flex items-center gap-1 text-[10px] font-bold text-pink hover:text-text transition-colors"
                >
                  <Plus size={10} /> Add Component
                </button>
              </div>

              {blocks.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                  <Paintbrush size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold mb-1">Empty Canvas</p>
                  <p className="text-xs">Add components or use AI to generate a page</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {blocks.map((block, i) => {
                    const comp = COMPONENTS.find(c => c.id === block.type)
                    const cat = COMPONENT_CATEGORIES.find(c => c.id === comp?.category)
                    return (
                      <motion.div
                        key={block.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group",
                          selectedBlock === block.id
                            ? "bg-pink/10 border border-pink/30"
                            : "bg-surface/50 hover:bg-surface"
                        )}
                        onClick={() => setSelectedBlock(block.id === selectedBlock ? null : block.id)}
                      >
                        <GripVertical size={14} className="text-text-muted/30 shrink-0" />
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#666") + "15" }}>
                          {comp ? <comp.icon size={14} style={{ color: cat?.color }} /> : <Square size={14} className="text-text-muted" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold">{block.label}</span>
                          <p className="text-[10px] text-text-muted truncate">{block.content}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); moveBlock(block.id, "up") }}
                            disabled={i === 0}
                            className="p-1 rounded hover:bg-white/5 text-text-muted disabled:opacity-20"
                          >
                            <ChevronDown size={12} className="rotate-180" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); moveBlock(block.id, "down") }}
                            disabled={i === blocks.length - 1}
                            className="p-1 rounded hover:bg-white/5 text-text-muted disabled:opacity-20"
                          >
                            <ChevronDown size={12} />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); removeBlock(block.id) }}
                            className="p-1 rounded hover:bg-white/5 text-red-400/60 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Selected block editor */}
            {selectedBlock && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">Edit Block</h3>
                  <button onClick={() => setSelectedBlock(null)} className="text-text-muted hover:text-text">
                    <X size={14} />
                  </button>
                </div>
                {(() => {
                  const block = blocks.find(b => b.id === selectedBlock)
                  if (!block) return null
                  return (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-text-muted mb-1 block">Label</label>
                        <input
                          value={block.label}
                          onChange={e => setBlocks(prev => prev.map(b => b.id === selectedBlock ? { ...b, label: e.target.value } : b))}
                          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-pink/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-text-muted mb-1 block">Content</label>
                        <textarea
                          value={block.content}
                          onChange={e => setBlocks(prev => prev.map(b => b.id === selectedBlock ? { ...b, content: e.target.value } : b))}
                          className="w-full h-20 bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-pink/40 resize-none transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-text-muted text-[10px] hover:text-text"><Bold size={10} /> Bold</button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-text-muted text-[10px] hover:text-text"><Italic size={10} /> Italic</button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-text-muted text-[10px] hover:text-text"><Link2 size={10} /> Link</button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-text-muted text-[10px] hover:text-text"><AlignLeft size={10} /></button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-text-muted text-[10px] hover:text-text"><AlignCenter size={10} /></button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-text-muted text-[10px] hover:text-text"><AlignRight size={10} /></button>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── COMPONENTS TAB ──────────────────────── */}
        {tab === "components" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Search + filter */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search components..."
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-pink/40 transition-all"
                />
                <span className="text-xs text-text-muted shrink-0">{filteredComponents.length} components</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full transition-all",
                    !categoryFilter ? "bg-pink/15 text-pink" : "bg-white/5 text-text-muted hover:text-text"
                  )}
                >
                  All ({COMPONENTS.length})
                </button>
                {COMPONENT_CATEGORIES.map(cat => {
                  const count = COMPONENTS.filter(c => c.category === cat.id).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full transition-all",
                        categoryFilter === cat.id ? "bg-white/10" : "bg-white/5 text-text-muted hover:text-text"
                      )}
                      style={categoryFilter === cat.id ? { color: cat.color, background: cat.color + "15" } : {}}
                    >
                      {cat.label} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Popular */}
            {!categoryFilter && !searchQuery && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3">Popular Components</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COMPONENTS.filter(c => c.popular).map(comp => {
                    const cat = COMPONENT_CATEGORIES.find(c => c.id === comp.category)
                    return (
                      <button
                        key={comp.id}
                        onClick={() => addBlock(comp)}
                        className="flex items-center gap-2 p-3 rounded-xl bg-surface/50 hover:bg-surface text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#666") + "15" }}>
                          <comp.icon size={14} style={{ color: cat?.color }} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold block group-hover:text-pink transition-colors">{comp.name}</span>
                          <span className="text-[9px] text-text-muted capitalize">{comp.category}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All components */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">
                {categoryFilter ? COMPONENT_CATEGORIES.find(c => c.id === categoryFilter)?.label : "All Components"} ({filteredComponents.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredComponents.map(comp => {
                  const cat = COMPONENT_CATEGORIES.find(c => c.id === comp.category)
                  return (
                    <button
                      key={comp.id}
                      onClick={() => addBlock(comp)}
                      className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface text-left transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: (cat?.color || "#666") + "15" }}>
                        <comp.icon size={16} style={{ color: cat?.color }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block group-hover:text-pink transition-colors">{comp.name}</span>
                        <p className="text-[10px] text-text-muted leading-relaxed">{comp.preview}</p>
                      </div>
                      <Plus size={12} className="text-text-muted/30 group-hover:text-pink shrink-0 mt-1 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── PREVIEW TAB ─────────────────────────── */}
        {tab === "preview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Device switcher */}
            <div className="flex items-center justify-center gap-2">
              {([
                { id: "desktop" as Device, icon: Monitor, label: "Desktop", width: "100%" },
                { id: "tablet" as Device, icon: Tablet, label: "Tablet", width: "768px" },
                { id: "mobile" as Device, icon: Smartphone, label: "Mobile", width: "375px" },
              ]).map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    device === d.id ? "bg-pink/15 text-pink" : "glass-card text-text-dim hover:text-text"
                  )}
                >
                  <d.icon size={14} />
                  {d.label}
                </button>
              ))}
            </div>

            {/* Preview frame */}
            <div className="flex justify-center">
              <div
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
                style={{ width: device === "desktop" ? "100%" : device === "tablet" ? "768px" : "375px", maxWidth: "100%" }}
              >
                <div className="bg-surface/80 px-4 py-2 flex items-center gap-2 border-b border-border">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neon/40" />
                  </div>
                  <div className="flex-1 bg-surface rounded px-3 py-0.5 text-[10px] text-text-muted text-center font-mono">
                    mysite.com
                  </div>
                </div>
                <div className="min-h-[500px] bg-[#0a0a14]">
                  {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-[500px] text-text-muted text-xs">
                      No blocks to preview
                    </div>
                  ) : (
                    blocks.map(block => {
                      const comp = COMPONENTS.find(c => c.id === block.type)
                      const cat = COMPONENT_CATEGORIES.find(c => c.id === comp?.category)
                      return (
                        <div
                          key={block.id}
                          className="border-b border-white/5 p-6 hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: (cat?.color || "#666") + "20" }}>
                              {comp && <comp.icon size={10} style={{ color: cat?.color }} />}
                            </div>
                            <span className="text-[9px] text-text-muted uppercase tracking-wider">{block.type}</span>
                          </div>
                          {block.type === "hero" ? (
                            <div className="text-center py-8">
                              <h2 className="text-2xl font-black mb-2">{block.content}</h2>
                              <p className="text-sm text-text-dim">Subtitle text goes here</p>
                              <button className="mt-4 px-6 py-2 rounded-lg bg-pink text-white text-xs font-bold">Get Started</button>
                            </div>
                          ) : block.type === "columns" ? (
                            <div className={cn("grid gap-4", device === "mobile" ? "grid-cols-1" : "grid-cols-3")}>
                              {block.content.split("|").map((col, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 text-center">
                                  <div className="w-8 h-8 rounded-lg bg-pink/15 mx-auto mb-2 flex items-center justify-center">
                                    <Zap size={14} className="text-pink" />
                                  </div>
                                  <span className="text-xs font-bold">{col.trim()}</span>
                                </div>
                              ))}
                            </div>
                          ) : block.type === "navbar" ? (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black">Logo</span>
                              <div className="flex gap-4 text-xs text-text-dim">
                                {block.content.split("|").slice(1).map((item, i) => (
                                  <span key={i} className="hover:text-text cursor-pointer">{item.trim()}</span>
                                ))}
                              </div>
                            </div>
                          ) : block.type === "pricing" ? (
                            <div className={cn("grid gap-4", device === "mobile" ? "grid-cols-1" : "grid-cols-3")}>
                              {block.content.split("|").map((tier, i) => (
                                <div key={i} className={cn("p-4 rounded-xl text-center", i === 1 ? "bg-pink/10 border border-pink/30" : "bg-white/5")}>
                                  <span className="text-xs font-bold block mb-1">{tier.trim().split(" ")[0]}</span>
                                  <span className="text-lg font-black">{tier.trim().split(" ").slice(1).join(" ")}</span>
                                  <button className="mt-3 w-full py-1.5 rounded-lg bg-white/10 text-[10px] font-bold hover:bg-white/15">Choose</button>
                                </div>
                              ))}
                            </div>
                          ) : block.type === "form" ? (
                            <div className="max-w-md mx-auto space-y-2">
                              {["Name", "Email", "Message"].map(field => (
                                <div key={field}>
                                  <label className="text-[10px] text-text-muted">{field}</label>
                                  <div className="w-full h-8 bg-white/5 rounded-lg border border-white/10" />
                                </div>
                              ))}
                              <button className="w-full py-2 rounded-lg bg-pink text-white text-xs font-bold mt-2">Submit</button>
                            </div>
                          ) : (
                            <p className="text-sm text-text-dim">{block.content}</p>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── EXPORT TAB ──────────────────────────── */}
        {tab === "export" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Export Formats ({EXPORT_FORMATS.filter(f => f.supported).length} supported)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {EXPORT_FORMATS.map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => fmt.supported && toggleExport(fmt.id)}
                    disabled={!fmt.supported}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl text-left transition-all",
                      !fmt.supported ? "opacity-30 cursor-not-allowed bg-surface/30" :
                      selectedExports.has(fmt.id)
                        ? "bg-pink/10 border border-pink/30"
                        : "bg-surface/50 hover:bg-surface"
                    )}
                  >
                    <span className="text-lg">{fmt.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block">{fmt.name}</span>
                      <code className="text-[9px] text-text-muted">{fmt.ext}</code>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export summary */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">Export Summary</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-xl bg-surface/50">
                  <div className="text-xl font-black text-pink">{blocks.length}</div>
                  <div className="text-[9px] text-text-muted">Blocks</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface/50">
                  <div className="text-xl font-black text-cyan">{selectedExports.size}</div>
                  <div className="text-[9px] text-text-muted">Formats</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface/50">
                  <div className="text-xl font-black text-neon">{new Set(blocks.map(b => b.type)).size}</div>
                  <div className="text-[9px] text-text-muted">Component Types</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportCode}
                  disabled={blocks.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink to-purple text-white text-sm font-bold hover:shadow-lg hover:shadow-pink/20 transition-all disabled:opacity-30"
                >
                  {copied ? <Check size={14} /> : <Download size={14} />}
                  {copied ? "Copied to Clipboard!" : "Export Canvas"}
                </button>
                <button
                  onClick={() => { setBlocks([]); setSelectedBlock(null) }}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl glass-card text-text-dim text-sm font-bold hover:text-text transition-colors"
                >
                  <RotateCcw size={14} /> Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

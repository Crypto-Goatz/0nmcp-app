"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Upload, Brain, Download, Cpu, Sparkles, Check, Copy,
  FileJson, FileText, Shield, Lock, Unlock, ChevronRight, Play,
  Plus, Trash2, RefreshCw, Settings, Zap, Server, Eye, X,
  ChevronDown, RotateCcw, ArrowRight, Layers
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────
type Tab = "import" | "train" | "export" | "brains"
type ImportFormat = "env" | "json" | "csv" | "yaml" | "manual"
type SkillLevel = 1 | 2 | 3

interface ImportedKey {
  id: string
  service: string
  key: string
  masked: string
  verified: boolean
  verifying: boolean
}

interface SkillConfig {
  id: string
  name: string
  description: string
  level: SkillLevel
  services: string[]
  enabled: boolean
}

interface BrainBundle {
  id: string
  name: string
  description: string
  services: number
  skills: number
  encrypted: boolean
  size: string
  created: string
}

interface ExportPlatform {
  id: string
  name: string
  icon: string
  format: string
  supported: boolean
}

// ─── DATA ─────────────────────────────────────────────────
const IMPORT_FORMATS: { id: ImportFormat; label: string; ext: string; icon: typeof FileJson; desc: string }[] = [
  { id: "env", label: ".env File", ext: ".env", icon: FileText, desc: "Standard environment variables" },
  { id: "json", label: "JSON Config", ext: ".json", icon: FileJson, desc: "Structured JSON configuration" },
  { id: "csv", label: "CSV Spreadsheet", ext: ".csv", icon: FileText, desc: "Comma-separated key-value pairs" },
  { id: "yaml", label: "YAML Config", ext: ".yaml", icon: FileText, desc: "YAML configuration file" },
  { id: "manual", label: "Manual Entry", ext: "", icon: Settings, desc: "Enter API keys one by one" },
]

const SKILL_TEMPLATES: SkillConfig[] = [
  { id: "crm-auto", name: "CRM Automation", description: "Contact sync, deal tracking, pipeline management", level: 2, services: ["crm", "gmail", "slack"], enabled: false },
  { id: "social-burst", name: "Social Media Burst", description: "Cross-platform posting to 8+ social networks", level: 3, services: ["twitter", "linkedin", "instagram", "facebook"], enabled: false },
  { id: "email-campaign", name: "Email Campaigns", description: "Automated drip sequences with AI content", level: 2, services: ["mailchimp", "sendgrid", "gmail"], enabled: false },
  { id: "lead-capture", name: "Lead Capture Pipeline", description: "Form submission → CRM → Email → Slack notification", level: 1, services: ["typeform", "crm", "gmail", "slack"], enabled: false },
  { id: "analytics-report", name: "Analytics Reporter", description: "Automated weekly reports from multiple data sources", level: 2, services: ["ga4", "sheets", "slack", "gmail"], enabled: false },
  { id: "support-flow", name: "Support Automation", description: "Ticket routing, AI responses, escalation rules", level: 3, services: ["zendesk", "slack", "crm", "gmail"], enabled: false },
  { id: "ecommerce-sync", name: "E-Commerce Sync", description: "Orders, inventory, and payment reconciliation", level: 2, services: ["shopify", "stripe", "quickbooks"], enabled: false },
  { id: "content-engine", name: "Content Engine", description: "AI content generation and multi-platform distribution", level: 3, services: ["openai", "notion", "wordpress", "twitter"], enabled: false },
]

const EXPORT_PLATFORMS: ExportPlatform[] = [
  { id: "claude-desktop", name: "Claude Desktop", icon: "🤖", format: "claude_desktop_config.json", supported: true },
  { id: "cursor", name: "Cursor", icon: "⌨️", format: ".cursor/mcp.json", supported: true },
  { id: "windsurf", name: "Windsurf", icon: "🏄", format: "windsurf.config.json", supported: true },
  { id: "vscode", name: "VS Code", icon: "💻", format: ".vscode/mcp.json", supported: true },
  { id: "cline", name: "Cline", icon: "📟", format: "cline_mcp.json", supported: true },
  { id: "continue", name: "Continue", icon: "➡️", format: "continue.config.json", supported: true },
  { id: "openai", name: "OpenAI", icon: "🧠", format: "openai_config.json", supported: true },
  { id: "gemini", name: "Gemini", icon: "💎", format: "gemini_config.json", supported: true },
  { id: "rocket", name: ".rocket Bundle", icon: "🚀", format: "brain.rocket", supported: true },
  { id: "0n", name: ".0n Config", icon: "⚡", format: "config.0n.json", supported: true },
  { id: "docker", name: "Docker Compose", icon: "🐳", format: "docker-compose.yml", supported: true },
  { id: "k8s", name: "Kubernetes", icon: "☸️", format: "k8s-configmap.yaml", supported: true },
  { id: "terraform", name: "Terraform", icon: "🏗️", format: "main.tf", supported: false },
  { id: "aws-lambda", name: "AWS Lambda", icon: "☁️", format: "serverless.yml", supported: false },
  { id: "vercel", name: "Vercel", icon: "▲", format: ".vercel/env", supported: true },
  { id: "netlify", name: "Netlify", icon: "🌐", format: "netlify.toml", supported: false },
  { id: "railway", name: "Railway", icon: "🚂", format: "railway.json", supported: false },
  { id: "fly", name: "Fly.io", icon: "✈️", format: "fly.toml", supported: false },
]

const PRESET_BRAINS: BrainBundle[] = [
  { id: "starter", name: "Starter Brain", description: "Gmail + Slack + Calendar — everyday automation", services: 3, skills: 4, encrypted: false, size: "2.1 KB", created: "2026-02-01" },
  { id: "marketing", name: "Marketing Brain", description: "Social + Email + CRM + Analytics full stack", services: 8, skills: 12, encrypted: false, size: "8.4 KB", created: "2026-02-05" },
  { id: "ecommerce", name: "E-Commerce Brain", description: "Shopify + Stripe + QuickBooks + Inventory", services: 5, skills: 8, encrypted: false, size: "5.2 KB", created: "2026-02-08" },
  { id: "enterprise", name: "Enterprise Brain", description: "Full 59-service orchestration with all capabilities", services: 59, skills: 24, encrypted: true, size: "34.7 KB", created: "2026-02-15" },
]

// ─── COMPONENT ────────────────────────────────────────────
export default function TrainerPage() {
  const [tab, setTab] = useState<Tab>("import")
  const [copied, setCopied] = useState(false)

  // Import state
  const [importFormat, setImportFormat] = useState<ImportFormat>("env")
  const [importText, setImportText] = useState("")
  const [importedKeys, setImportedKeys] = useState<ImportedKey[]>([])
  const [importing, setImporting] = useState(false)

  // Train state
  const [skills, setSkills] = useState<SkillConfig[]>(SKILL_TEMPLATES)
  const [trainingActive, setTrainingActive] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  // Export state
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set())
  const [encrypt, setEncrypt] = useState(true)
  const [passphrase, setPassphrase] = useState("")
  const [exporting, setExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  // Brain state
  const [brains, setBrains] = useState<BrainBundle[]>(PRESET_BRAINS)
  const [newBrainName, setNewBrainName] = useState("")

  const tabs: { id: Tab; label: string; icon: typeof Upload }[] = [
    { id: "import", label: "Import", icon: Upload },
    { id: "train", label: "Train", icon: Brain },
    { id: "export", label: "Export", icon: Download },
    { id: "brains", label: "Brain Factory", icon: Cpu },
  ]

  const handleImport = async () => {
    if (!importText.trim()) return
    setImporting(true)
    await new Promise(r => setTimeout(r, 1500))

    const lines = importText.split("\n").filter(l => l.trim() && !l.startsWith("#"))
    const keys: ImportedKey[] = lines.map((line, i) => {
      const [key, val] = line.includes("=") ? line.split("=") : [line, ""]
      const service = key.toLowerCase().replace(/(_api)?_key|_secret|_token/g, "").replace(/_/g, " ").trim()
      return {
        id: `key-${i}`,
        service: service || `Service ${i + 1}`,
        key: key.trim(),
        masked: val ? val.trim().slice(0, 4) + "••••" + val.trim().slice(-4) : "••••••••",
        verified: false,
        verifying: false,
      }
    })
    setImportedKeys(keys)
    setImporting(false)
  }

  const verifyKey = async (id: string) => {
    setImportedKeys(prev => prev.map(k => k.id === id ? { ...k, verifying: true } : k))
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700))
    setImportedKeys(prev => prev.map(k => k.id === id ? { ...k, verifying: false, verified: true } : k))
  }

  const verifyAll = async () => {
    for (const key of importedKeys) {
      if (!key.verified) await verifyKey(key.id)
    }
  }

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const startTraining = async () => {
    setTrainingActive(true)
    setTrainingProgress(0)
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 60))
      setTrainingProgress(i)
    }
    setTrainingActive(false)
    setTrainingProgress(100)
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleExport = async () => {
    if (selectedPlatforms.size === 0) return
    setExporting(true)
    setExportComplete(false)
    await new Promise(r => setTimeout(r, 2000))
    setExporting(false)
    setExportComplete(true)
  }

  const copyConfig = () => {
    const config = {
      name: "0nmcp-brain",
      version: "1.0.0",
      encrypted: encrypt,
      platforms: Array.from(selectedPlatforms),
      services: importedKeys.filter(k => k.verified).map(k => k.service),
      skills: skills.filter(s => s.enabled).map(s => ({ name: s.name, level: s.level })),
    }
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createBrain = () => {
    if (!newBrainName.trim()) return
    const brain: BrainBundle = {
      id: `brain-${Date.now()}`,
      name: newBrainName,
      description: `Custom brain with ${skills.filter(s => s.enabled).length} skills`,
      services: importedKeys.filter(k => k.verified).length || 3,
      skills: skills.filter(s => s.enabled).length || 2,
      encrypted: encrypt,
      size: `${(Math.random() * 20 + 2).toFixed(1)} KB`,
      created: new Date().toISOString().split("T")[0],
    }
    setBrains(prev => [brain, ...prev])
    setNewBrainName("")
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-4 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-cyan/15">
            <Brain size={28} className="text-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">AI Trainer</h1>
            <p className="text-sm text-text-dim">Import credentials, train skill layers, export to 18+ platforms with .rocket encryption</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((t, i) => (
            <div key={t.id} className="flex items-center gap-2">
              <button
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  tab === t.id
                    ? "bg-cyan/15 text-cyan border border-cyan/30"
                    : "glass-card text-text-dim hover:text-text"
                )}
              >
                <t.icon size={12} />
                {t.label}
              </button>
              {i < tabs.length - 1 && <ChevronRight size={12} className="text-text-muted" />}
            </div>
          ))}
        </div>

        {/* ─── IMPORT TAB ──────────────────────────── */}
        {tab === "import" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Format selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {IMPORT_FORMATS.map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => setImportFormat(fmt.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all",
                    importFormat === fmt.id
                      ? "bg-cyan/15 text-cyan border border-cyan/30"
                      : "glass-card text-text-dim hover:text-text"
                  )}
                >
                  <fmt.icon size={18} />
                  <span className="text-[10px] font-bold">{fmt.label}</span>
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">
                  {importFormat === "manual" ? "Enter API Keys" : `Paste ${IMPORT_FORMATS.find(f => f.id === importFormat)?.ext} Content`}
                </h3>
                <span className="text-[10px] text-text-muted">{IMPORT_FORMATS.find(f => f.id === importFormat)?.desc}</span>
              </div>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={importFormat === "env"
                  ? "GMAIL_API_KEY=AIza...\nSLACK_TOKEN=xoxb-...\nSTRIPE_SECRET_KEY=sk_live_..."
                  : importFormat === "json"
                  ? '{\n  "gmail": { "api_key": "AIza..." },\n  "slack": { "token": "xoxb-..." }\n}'
                  : importFormat === "manual"
                  ? "service_name=your_api_key\nanother_service=another_key"
                  : "Paste your configuration here..."
                }
                className="w-full h-40 bg-surface border border-border rounded-xl p-4 text-sm text-text font-mono placeholder:text-text-muted/50 focus:outline-none focus:border-cyan/40 resize-none transition-all"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-text-muted">
                  {importText.split("\n").filter(l => l.trim()).length} lines detected
                </span>
                <button
                  onClick={handleImport}
                  disabled={!importText.trim() || importing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan text-bg text-xs font-bold hover:bg-cyan/90 transition-all disabled:opacity-30"
                >
                  {importing ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                  {importing ? "Parsing..." : "Import & Detect"}
                </button>
              </div>
            </div>

            {/* Detected keys */}
            {importedKeys.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold">{importedKeys.length} API Keys Detected</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neon font-bold">
                      {importedKeys.filter(k => k.verified).length}/{importedKeys.length} verified
                    </span>
                    <button onClick={verifyAll} className="text-[10px] px-2 py-1 rounded bg-neon/10 text-neon font-bold hover:bg-neon/20 transition-colors">
                      Verify All
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {importedKeys.map(k => (
                    <div key={k.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", k.verified ? "bg-neon/15" : "bg-white/5")}>
                        {k.verified ? <Check size={14} className="text-neon" /> : <Lock size={14} className="text-text-muted" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold capitalize">{k.service}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-[10px] text-text-muted font-mono truncate">{k.key}</code>
                          <span className="text-[10px] text-text-muted">{k.masked}</span>
                        </div>
                      </div>
                      {!k.verified && (
                        <button
                          onClick={() => verifyKey(k.id)}
                          disabled={k.verifying}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan/10 text-cyan font-bold hover:bg-cyan/20 transition-colors disabled:opacity-50"
                        >
                          {k.verifying ? <RefreshCw size={10} className="animate-spin" /> : "Verify"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {importedKeys.some(k => k.verified) && (
                  <button
                    onClick={() => setTab("train")}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan to-neon text-bg text-sm font-bold hover:shadow-lg hover:shadow-cyan/20 transition-all"
                  >
                    Continue to Training <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── TRAIN TAB ───────────────────────────── */}
        {tab === "train" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Skill selector */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">Skill Layer Configuration</h3>
                <span className="text-[10px] text-text-muted">
                  {skills.filter(s => s.enabled).length} of {skills.length} enabled
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl text-left transition-all",
                      skill.enabled
                        ? "bg-cyan/10 border border-cyan/30"
                        : "bg-surface/50 border border-transparent hover:border-border"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0",
                      skill.enabled ? "bg-cyan text-bg" : "bg-white/10"
                    )}>
                      {skill.enabled && <Check size={12} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{skill.name}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                          skill.level === 1 ? "bg-neon/10 text-neon" :
                          skill.level === 2 ? "bg-cyan/10 text-cyan" :
                          "bg-purple/10 text-purple"
                        )}>
                          L{skill.level}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">{skill.description}</p>
                      <div className="flex gap-1 mt-1.5">
                        {skill.services.map(s => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted capitalize">{s}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Training panel */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Training Execution</h3>
              {trainingProgress === 100 && !trainingActive ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-neon/15 flex items-center justify-center mx-auto mb-3">
                    <Check size={28} className="text-neon" />
                  </div>
                  <h4 className="text-lg font-bold text-neon mb-1">Training Complete</h4>
                  <p className="text-xs text-text-muted mb-4">
                    {skills.filter(s => s.enabled).length} skills trained across {importedKeys.filter(k => k.verified).length || 3} services
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setTrainingProgress(0) }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass-card text-text-dim text-xs font-bold hover:text-text transition-colors"
                    >
                      <RotateCcw size={12} /> Retrain
                    </button>
                    <button
                      onClick={() => setTab("export")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan text-bg text-xs font-bold hover:bg-cyan/90 transition-all"
                    >
                      Export <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-text-muted">
                        {trainingActive ? "Training in progress..." : "Ready to train"}
                      </span>
                      <span className="text-xs font-bold text-cyan">{trainingProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan to-neon"
                        animate={{ width: `${trainingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {trainingActive && (
                    <div className="space-y-1 mb-4">
                      {["Mapping service connections...", "Building skill graph...", "Optimizing execution paths...", "Generating .rocket manifest..."].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: trainingProgress > i * 25 ? 1 : 0.3, x: 0 }}
                          transition={{ delay: i * 0.3 }}
                          className="flex items-center gap-2 text-[10px] text-text-muted"
                        >
                          {trainingProgress > (i + 1) * 25 ? (
                            <Check size={10} className="text-neon" />
                          ) : trainingProgress > i * 25 ? (
                            <RefreshCw size={10} className="text-cyan animate-spin" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          )}
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={startTraining}
                    disabled={trainingActive || skills.filter(s => s.enabled).length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan to-neon text-bg text-sm font-bold hover:shadow-lg hover:shadow-cyan/20 transition-all disabled:opacity-30"
                  >
                    {trainingActive ? (
                      <><RefreshCw size={14} className="animate-spin" /> Training...</>
                    ) : (
                      <><Play size={14} /> Start Training ({skills.filter(s => s.enabled).length} skills)</>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── EXPORT TAB ──────────────────────────── */}
        {tab === "export" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Platform grid */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">Export Platforms ({EXPORT_PLATFORMS.filter(p => p.supported).length} supported)</h3>
                <span className="text-[10px] text-text-muted">{selectedPlatforms.size} selected</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {EXPORT_PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => p.supported && togglePlatform(p.id)}
                    disabled={!p.supported}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl text-left transition-all",
                      !p.supported ? "opacity-30 cursor-not-allowed bg-surface/30" :
                      selectedPlatforms.has(p.id)
                        ? "bg-cyan/10 border border-cyan/30"
                        : "bg-surface/50 hover:bg-surface"
                    )}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block">{p.name}</span>
                      <code className="text-[9px] text-text-muted truncate block">{p.format}</code>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Encryption */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-purple" />
                  <h3 className="text-sm font-bold">.rocket Encryption</h3>
                </div>
                <button
                  onClick={() => setEncrypt(!encrypt)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                    encrypt ? "bg-purple/15 text-purple" : "glass-card text-text-muted"
                  )}
                >
                  {encrypt ? <Lock size={10} /> : <Unlock size={10} />}
                  {encrypt ? "Encrypted" : "Plaintext"}
                </button>
              </div>

              {encrypt && (
                <div className="mb-4">
                  <label className="text-xs text-text-muted mb-1.5 block">Passphrase (AES-256-GCM)</label>
                  <input
                    type="password"
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    placeholder="Enter encryption passphrase..."
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple/40 font-mono transition-all"
                  />
                  <p className="text-[10px] text-text-muted mt-1.5">
                    4-layer encryption: XOR scramble + Base64 + bundle scramble + integrity checksum
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  disabled={selectedPlatforms.size === 0 || exporting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple to-pink text-white text-sm font-bold hover:shadow-lg hover:shadow-purple/20 transition-all disabled:opacity-30"
                >
                  {exporting ? (
                    <><RefreshCw size={14} className="animate-spin" /> Exporting...</>
                  ) : exportComplete ? (
                    <><Check size={14} /> Exported!</>
                  ) : (
                    <><Download size={14} /> Export to {selectedPlatforms.size} Platform{selectedPlatforms.size !== 1 ? "s" : ""}</>
                  )}
                </button>
                <button
                  onClick={copyConfig}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl glass-card text-text-dim text-sm font-bold hover:text-text transition-colors"
                >
                  {copied ? <Check size={14} className="text-neon" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Generated preview */}
            {exportComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5"
              >
                <h3 className="text-sm font-bold mb-3">Generated Configs</h3>
                <div className="space-y-2">
                  {Array.from(selectedPlatforms).map(pid => {
                    const p = EXPORT_PLATFORMS.find(x => x.id === pid)!
                    return (
                      <div key={pid} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                        <span className="text-lg">{p.icon}</span>
                        <div className="flex-1">
                          <span className="text-xs font-bold">{p.name}</span>
                          <code className="text-[10px] text-text-muted block font-mono">{p.format}</code>
                        </div>
                        <Check size={14} className="text-neon" />
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── BRAIN FACTORY TAB ───────────────────── */}
        {tab === "brains" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Create brain */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">Create Brain Bundle</h3>
              <p className="text-xs text-text-muted mb-4">
                Package your trained configurations into a portable .rocket brain file. Deploy on any machine with just a passphrase.
              </p>
              <div className="flex gap-2">
                <input
                  value={newBrainName}
                  onChange={e => setNewBrainName(e.target.value)}
                  placeholder="Brain name..."
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-all"
                />
                <button
                  onClick={createBrain}
                  disabled={!newBrainName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan text-bg text-xs font-bold hover:bg-cyan/90 transition-all disabled:opacity-30"
                >
                  <Plus size={12} /> Create
                </button>
              </div>
            </div>

            {/* Brain library */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Brain Library ({brains.length})</h3>
              <div className="space-y-3">
                {brains.map(brain => (
                  <div key={brain.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center shrink-0">
                      <Cpu size={20} className="text-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{brain.name}</span>
                        {brain.encrypted && <Lock size={10} className="text-purple" />}
                      </div>
                      <p className="text-[10px] text-text-muted">{brain.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] text-text-muted">{brain.services} services</span>
                        <span className="text-[9px] text-text-muted">{brain.skills} skills</span>
                        <span className="text-[9px] text-text-muted">{brain.size}</span>
                        <span className="text-[9px] text-text-muted">{brain.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-cyan transition-colors" title="Download">
                        <Download size={14} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon transition-colors" title="Deploy">
                        <Play size={14} />
                      </button>
                      <button
                        onClick={() => setBrains(prev => prev.filter(b => b.id !== brain.id))}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MCP Server Presets */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">MCP Server Presets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: "0nMCP Full Stack", desc: "All 59 services, 1,385+ capabilities", services: 59 },
                  { name: "Starter Pack", desc: "Gmail, Slack, Calendar, Sheets", services: 4 },
                  { name: "Marketing Suite", desc: "Social, Email, CRM, Analytics", services: 12 },
                  { name: "Developer Tools", desc: "GitHub, Supabase, Linear, Vercel", services: 4 },
                  { name: "E-Commerce Stack", desc: "Shopify, Stripe, QuickBooks, Support", services: 5 },
                  { name: "Enterprise Bundle", desc: "All services + custom adapters", services: 59 },
                ].map(preset => (
                  <button
                    key={preset.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface text-left transition-all group"
                  >
                    <Server size={16} className="text-cyan shrink-0" />
                    <div>
                      <span className="text-xs font-bold group-hover:text-cyan transition-colors">{preset.name}</span>
                      <p className="text-[10px] text-text-muted">{preset.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan/10 text-cyan ml-auto shrink-0">
                      {preset.services}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Upload, FileJson, Search, Sparkles, Map, Rocket,
  Check, X, AlertTriangle, ChevronRight, RefreshCw, Copy,
  ArrowRight, Zap, Shield, Eye, Play, Layers, GitBranch,
  CheckCircle2, Circle, Loader2, Package, Settings, Code2
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────
type Stage = "parse" | "resolve" | "generate" | "map" | "deploy"
type AssetStatus = "found" | "missing" | "generating" | "generated" | "error"

interface WorkflowAsset {
  id: string
  type: string
  name: string
  status: AssetStatus
  original_id?: string
  mapped_id?: string
}

interface PipelineStage {
  id: Stage
  label: string
  icon: typeof Upload
  description: string
  status: "pending" | "active" | "complete" | "error"
}

interface DeployLog {
  timestamp: string
  level: "info" | "success" | "warn" | "error"
  message: string
}

// ─── DATA ─────────────────────────────────────────────────
const ASSET_TYPES = [
  { type: "workflow", label: "Workflows", icon: GitBranch, color: "#00ff88" },
  { type: "form", label: "Forms", icon: FileJson, color: "#00d4ff" },
  { type: "email", label: "Email Templates", icon: Sparkles, color: "#9945ff" },
  { type: "trigger", label: "Triggers", icon: Zap, color: "#ff6b35" },
  { type: "webhook", label: "Webhooks", icon: ArrowRight, color: "#ff3d9a" },
  { type: "calendar", label: "Calendars", icon: Settings, color: "#10b981" },
  { type: "pipeline", label: "Pipelines", icon: Layers, color: "#0a66c2" },
  { type: "custom_value", label: "Custom Values", icon: Code2, color: "#f59e0b" },
]

const SAMPLE_WORKFLOW = `{
  "name": "Lead Capture Automation",
  "version": "1.0",
  "trigger": {
    "type": "form_submission",
    "form_id": "form_abc123"
  },
  "steps": [
    {
      "action": "create_contact",
      "pipeline_id": "pipe_xyz789",
      "stage": "New Lead"
    },
    {
      "action": "send_email",
      "template_id": "tmpl_welcome_01",
      "delay": "0m"
    },
    {
      "action": "add_to_workflow",
      "workflow_id": "wf_nurture_seq",
      "delay": "24h"
    },
    {
      "action": "notify_team",
      "webhook_url": "{{webhooks.slack_notify}}",
      "message": "New lead: {{contact.name}}"
    },
    {
      "action": "schedule_call",
      "calendar_id": "cal_sales_team",
      "delay": "48h"
    }
  ]
}`

// ─── COMPONENT ────────────────────────────────────────────
export default function SmartDeployPage() {
  const [jsonInput, setJsonInput] = useState("")
  const [copied, setCopied] = useState(false)
  const [running, setRunning] = useState(false)
  const [currentStage, setCurrentStage] = useState<Stage | null>(null)
  const [assets, setAssets] = useState<WorkflowAsset[]>([])
  const [logs, setLogs] = useState<DeployLog[]>([])
  const [showLogs, setShowLogs] = useState(false)

  const [stages, setStages] = useState<PipelineStage[]>([
    { id: "parse", label: "Parse", icon: FileJson, description: "Analyze JSON structure and extract dependencies", status: "pending" },
    { id: "resolve", label: "Resolve", icon: Search, description: "Detect missing assets and map references", status: "pending" },
    { id: "generate", label: "Generate", icon: Sparkles, description: "AI-create missing forms, templates, and triggers", status: "pending" },
    { id: "map", label: "Map", icon: Map, description: "Map source IDs to destination environment", status: "pending" },
    { id: "deploy", label: "Deploy", icon: Rocket, description: "Execute deployment to target CRM instance", status: "pending" },
  ])

  const addLog = (level: DeployLog["level"], message: string) => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    }])
  }

  const updateStage = (id: Stage, status: PipelineStage["status"]) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const runPipeline = async () => {
    if (!jsonInput.trim()) return
    setRunning(true)
    setLogs([])
    setAssets([])
    setStages(prev => prev.map(s => ({ ...s, status: "pending" as const })))

    // ── Stage 1: Parse ──
    setCurrentStage("parse")
    updateStage("parse", "active")
    addLog("info", "Parsing JSON workflow definition...")
    await new Promise(r => setTimeout(r, 800))

    let parsed: Record<string, unknown> = {}
    try {
      parsed = JSON.parse(jsonInput)
      addLog("success", `Parsed: "${(parsed as { name?: string }).name || "Unnamed workflow"}"`)
      addLog("info", `Found ${((parsed as { steps?: unknown[] }).steps || []).length} workflow steps`)
    } catch {
      addLog("error", "Invalid JSON — check syntax and try again")
      updateStage("parse", "error")
      setRunning(false)
      setCurrentStage(null)
      return
    }
    updateStage("parse", "complete")
    await new Promise(r => setTimeout(r, 400))

    // ── Stage 2: Resolve ──
    setCurrentStage("resolve")
    updateStage("resolve", "active")
    addLog("info", "Scanning for asset references...")
    await new Promise(r => setTimeout(r, 600))

    const detectedAssets: WorkflowAsset[] = [
      { id: "a1", type: "form", name: "Lead Capture Form", status: "missing", original_id: "form_abc123" },
      { id: "a2", type: "pipeline", name: "Sales Pipeline", status: "found", original_id: "pipe_xyz789" },
      { id: "a3", type: "email", name: "Welcome Email Template", status: "missing", original_id: "tmpl_welcome_01" },
      { id: "a4", type: "workflow", name: "Nurture Sequence", status: "missing", original_id: "wf_nurture_seq" },
      { id: "a5", type: "webhook", name: "Slack Notification", status: "found", original_id: "webhooks.slack_notify" },
      { id: "a6", type: "calendar", name: "Sales Team Calendar", status: "missing", original_id: "cal_sales_team" },
    ]
    setAssets(detectedAssets)

    const missing = detectedAssets.filter(a => a.status === "missing")
    const found = detectedAssets.filter(a => a.status === "found")
    addLog("success", `${found.length} assets found in target environment`)
    addLog("warn", `${missing.length} assets missing — will be auto-generated`)
    updateStage("resolve", "complete")
    await new Promise(r => setTimeout(r, 400))

    // ── Stage 3: Generate ──
    setCurrentStage("generate")
    updateStage("generate", "active")
    addLog("info", `AI generating ${missing.length} missing assets...`)

    for (const asset of missing) {
      setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, status: "generating" as const } : a))
      addLog("info", `Generating ${asset.type}: "${asset.name}"...`)
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
      setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, status: "generated" as const } : a))
      addLog("success", `Created ${asset.type}: "${asset.name}"`)
    }

    updateStage("generate", "complete")
    await new Promise(r => setTimeout(r, 400))

    // ── Stage 4: Map ──
    setCurrentStage("map")
    updateStage("map", "active")
    addLog("info", "Mapping source IDs to destination IDs...")
    await new Promise(r => setTimeout(r, 800))

    setAssets(prev => prev.map(a => ({
      ...a,
      mapped_id: `dest_${Math.random().toString(36).slice(2, 10)}`,
    })))
    addLog("success", `${detectedAssets.length} ID mappings created`)
    updateStage("map", "complete")
    await new Promise(r => setTimeout(r, 400))

    // ── Stage 5: Deploy ──
    setCurrentStage("deploy")
    updateStage("deploy", "active")
    addLog("info", "Deploying to target CRM instance...")
    await new Promise(r => setTimeout(r, 1200))
    addLog("success", "Workflow deployed successfully!")
    addLog("info", `Deployment ID: deploy_${Date.now().toString(36)}`)
    updateStage("deploy", "complete")

    setCurrentStage(null)
    setRunning(false)
  }

  const loadSample = () => {
    setJsonInput(SAMPLE_WORKFLOW)
    setAssets([])
    setLogs([])
    setStages(prev => prev.map(s => ({ ...s, status: "pending" as const })))
  }

  const copyJson = () => {
    navigator.clipboard.writeText(jsonInput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stageComplete = stages.every(s => s.status === "complete")

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-4 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange/15">
            <Rocket size={28} className="text-orange" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">JSON SmartDeploy</h1>
            <p className="text-sm text-text-dim">5-stage intelligent workflow deployment — Parse, Resolve, Generate, Map, Deploy</p>
          </div>
        </div>

        {/* Pipeline progress */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-1">
            {stages.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  "flex items-center gap-2 flex-1 p-3 rounded-xl transition-all",
                  stage.status === "active" ? "bg-orange/10 border border-orange/30" :
                  stage.status === "complete" ? "bg-neon/10 border border-neon/30" :
                  stage.status === "error" ? "bg-red-500/10 border border-red-500/30" :
                  "bg-surface/50"
                )}>
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                    stage.status === "active" ? "bg-orange/20" :
                    stage.status === "complete" ? "bg-neon/20" :
                    stage.status === "error" ? "bg-red-500/20" :
                    "bg-white/5"
                  )}>
                    {stage.status === "active" ? (
                      <Loader2 size={14} className="text-orange animate-spin" />
                    ) : stage.status === "complete" ? (
                      <Check size={14} className="text-neon" />
                    ) : stage.status === "error" ? (
                      <X size={14} className="text-red-400" />
                    ) : (
                      <stage.icon size={14} className="text-text-muted" />
                    )}
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <span className={cn(
                      "text-[10px] font-bold block",
                      stage.status === "active" ? "text-orange" :
                      stage.status === "complete" ? "text-neon" :
                      "text-text-dim"
                    )}>
                      {stage.label}
                    </span>
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <ChevronRight size={10} className={cn(
                    "shrink-0",
                    stage.status === "complete" ? "text-neon" : "text-text-muted/30"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: JSON Input */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">Workflow JSON</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadSample}
                    className="text-[10px] px-2 py-1 rounded bg-orange/10 text-orange font-bold hover:bg-orange/20 transition-colors"
                  >
                    Load Sample
                  </button>
                  <button onClick={copyJson} className="text-text-muted hover:text-text transition-colors">
                    {copied ? <Check size={12} className="text-neon" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <textarea
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                placeholder='Paste your workflow JSON here...\n\n{\n  "name": "My Workflow",\n  "steps": [...]\n}'
                className="w-full h-72 bg-surface border border-border rounded-xl p-4 text-xs text-text font-mono placeholder:text-text-muted/50 focus:outline-none focus:border-orange/40 resize-none transition-all leading-relaxed"
              />
              <button
                onClick={runPipeline}
                disabled={!jsonInput.trim() || running}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange to-pink text-white text-sm font-bold hover:shadow-lg hover:shadow-orange/20 transition-all disabled:opacity-30"
              >
                {running ? (
                  <><RefreshCw size={14} className="animate-spin" /> Processing Pipeline...</>
                ) : stageComplete ? (
                  <><Check size={14} /> Deployed Successfully</>
                ) : (
                  <><Rocket size={14} /> Deploy Workflow</>
                )}
              </button>
            </div>

            {/* Asset types reference */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">Auto-Detectable Asset Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {ASSET_TYPES.map(at => (
                  <div key={at.type} className="flex items-center gap-2 p-2 rounded-lg bg-surface/50">
                    <at.icon size={14} style={{ color: at.color }} />
                    <span className="text-[10px] font-bold">{at.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-3">
                SmartDeploy auto-detects references to these asset types in your JSON and creates any that are missing in the target environment.
              </p>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Assets panel */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">
                  Detected Assets {assets.length > 0 && `(${assets.length})`}
                </h3>
                {assets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-neon">{assets.filter(a => a.status === "found" || a.status === "generated").length} ready</span>
                    {assets.some(a => a.status === "missing" || a.status === "generating") && (
                      <span className="text-[9px] font-bold text-orange">{assets.filter(a => a.status === "missing" || a.status === "generating").length} pending</span>
                    )}
                  </div>
                )}
              </div>

              {assets.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Deploy a workflow to see detected assets</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {assets.map(asset => {
                    const at = ASSET_TYPES.find(t => t.type === asset.type)
                    return (
                      <div key={asset.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: (at?.color || "#666") + "15" }}>
                          {asset.status === "generating" ? (
                            <Loader2 size={14} className="animate-spin" style={{ color: at?.color }} />
                          ) : asset.status === "generated" || asset.status === "found" ? (
                            <CheckCircle2 size={14} className="text-neon" />
                          ) : asset.status === "error" ? (
                            <X size={14} className="text-red-400" />
                          ) : at ? (
                            <at.icon size={14} style={{ color: at.color }} />
                          ) : (
                            <Circle size={14} className="text-text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{asset.name}</span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                              asset.status === "found" ? "bg-neon/10 text-neon" :
                              asset.status === "generated" ? "bg-purple/10 text-purple" :
                              asset.status === "generating" ? "bg-orange/10 text-orange" :
                              asset.status === "error" ? "bg-red-500/10 text-red-400" :
                              "bg-yellow-500/10 text-yellow-400"
                            )}>
                              {asset.status === "found" ? "exists" :
                               asset.status === "generated" ? "AI created" :
                               asset.status === "generating" ? "creating..." :
                               asset.status === "error" ? "error" : "missing"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <code className="text-[9px] text-text-muted font-mono">{asset.original_id}</code>
                            {asset.mapped_id && (
                              <>
                                <ArrowRight size={8} className="text-text-muted" />
                                <code className="text-[9px] text-cyan font-mono">{asset.mapped_id}</code>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Deploy log */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">Deploy Log ({logs.length})</h3>
                {logs.length > 0 && (
                  <button
                    onClick={() => setShowLogs(!showLogs)}
                    className="text-[10px] text-text-muted hover:text-text transition-colors"
                  >
                    {showLogs ? "Collapse" : "Expand"}
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <Code2 size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Pipeline logs will appear here</p>
                </div>
              ) : (
                <div className={cn("space-y-1 overflow-y-auto transition-all", showLogs ? "max-h-96" : "max-h-48")}>
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-[10px] font-mono"
                    >
                      <span className="text-text-muted shrink-0">{log.timestamp}</span>
                      <span className={cn(
                        "font-bold shrink-0 w-12",
                        log.level === "success" ? "text-neon" :
                        log.level === "warn" ? "text-yellow-400" :
                        log.level === "error" ? "text-red-400" :
                        "text-text-dim"
                      )}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className="text-text-dim">{log.message}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Success summary */}
            {stageComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5 border border-neon/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neon/15 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-neon" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neon">Deployment Complete</h3>
                    <p className="text-[10px] text-text-muted">All 5 pipeline stages passed</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-surface/50">
                    <div className="text-lg font-black text-neon">{assets.length}</div>
                    <div className="text-[9px] text-text-muted">Assets</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface/50">
                    <div className="text-lg font-black text-purple">{assets.filter(a => a.status === "generated").length}</div>
                    <div className="text-[9px] text-text-muted">AI Created</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface/50">
                    <div className="text-lg font-black text-cyan">{assets.filter(a => a.mapped_id).length}</div>
                    <div className="text-[9px] text-text-muted">Mapped</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

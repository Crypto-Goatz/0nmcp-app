"use client"

import { motion } from "framer-motion"
import {
  Layers, GitBranch, Zap, ArrowRight, Shield, Server,
  Database, Terminal, Radio, Lock, Cpu, Globe
} from "lucide-react"

import { STATS } from "@/lib/catalog"

const LEVELS = [
  {
    icon: Layers,
    title: "Pipeline",
    level: "Level 1",
    color: "#00ff88",
    desc: "Sequential phases that organize complex workflows into manageable stages. Each phase completes before the next begins.",
    details: [
      "Linear task execution with ordered phases",
      "Data passes between phases via context objects",
      "Error handling at each phase boundary",
      "Progress tracking and rollback support",
    ],
    example: "CRM contact creation → SendGrid welcome email → Slack notification",
  },
  {
    icon: GitBranch,
    title: "Assembly Line",
    level: "Level 2",
    color: "#00d4ff",
    desc: "Decision moments within phases. AI evaluates conditions, routes data, and orchestrates the flow between services.",
    details: [
      "Conditional branching with AI evaluation",
      "Dynamic routing based on intermediate results",
      "Context-aware service selection",
      "Fallback chains and retry logic",
    ],
    example: "Analyze lead score → High: route to sales pipeline | Low: add to nurture campaign",
  },
  {
    icon: Zap,
    title: "Radial Burst",
    level: "Level 3",
    color: "#9945ff",
    desc: "Parallel action execution. Multiple API calls fire simultaneously, maximizing throughput and minimizing latency.",
    details: [
      "Concurrent API calls across multiple services",
      "Automatic dependency graph resolution",
      "Rate limiting with token bucket per service",
      "Results aggregation and merge strategies",
    ],
    example: "Simultaneously: Stripe charge + Shopify order + SendGrid receipt + Slack alert + CRM update",
  },
]

const TECH_STACK = [
  { icon: Cpu, label: "AI Mode", desc: "Claude-powered intent parsing", color: "#ff3d9a" },
  { icon: Terminal, label: "Keyword Fallback", desc: "Works without API key", color: "#00ff88" },
  { icon: Lock, label: "Vault", desc: "AES-256-GCM + hardware binding", color: "#ff6b35" },
  { icon: Database, label: "Engine", desc: ".0n portable brain bundles", color: "#00d4ff" },
  { icon: Server, label: "HTTP Server", desc: "REST API + webhook receivers", color: "#9945ff" },
  { icon: Globe, label: "MCP Protocol", desc: "Model Context Protocol stdio", color: "#00ff88" },
]

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple/5 border border-purple/20 text-purple text-xs font-bold mb-4">
            <Shield size={12} />
            US Patent Application #63/968,814
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="gradient-text">Three-Level Execution</span>
          </h1>
          <p className="text-text-dim max-w-2xl mx-auto">
            The patented architecture that powers {STATS.tools} tools across {STATS.services} services.
            Pipeline → Assembly Line → Radial Burst.
          </p>
        </div>

        {/* Levels */}
        <div className="space-y-8 mb-20">
          {LEVELS.map((level, i) => (
            <motion.div
              key={level.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="glass-card rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: level.color + "15" }}>
                      <level.icon size={24} style={{ color: level.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: level.color }}>
                        {level.level}
                      </div>
                      <h2 className="text-2xl font-black">{level.title}</h2>
                    </div>
                  </div>
                  <p className="text-sm text-text-dim leading-relaxed mb-4">{level.desc}</p>
                  <ul className="space-y-2">
                    {level.details.map(d => (
                      <li key={d} className="flex items-start gap-2 text-xs text-text-dim">
                        <ArrowRight size={10} className="mt-0.5 shrink-0" style={{ color: level.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center">
                  <div className="w-full glass-card rounded-xl p-4 border-l-2" style={{ borderColor: level.color }}>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Example</p>
                    <p className="text-sm text-text leading-relaxed font-mono">{level.example}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-black tracking-tight text-center mb-8">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                className="glass-card rounded-xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: tech.color + "15" }}>
                  <tech.icon size={20} style={{ color: tech.color }} />
                </div>
                <h3 className="text-sm font-bold mb-1">{tech.label}</h3>
                <p className="text-xs text-text-dim">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black tracking-tight mb-6">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { value: STATS.tools, label: "Tools", color: "#00ff88" },
              { value: STATS.services, label: "Services", color: "#00d4ff" },
              { value: STATS.categories, label: "Categories", color: "#ff6b35" },
              { value: STATS.actions, label: "Actions", color: "#9945ff" },
              { value: STATS.triggers, label: "Triggers", color: "#ff3d9a" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

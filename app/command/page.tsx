"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import {
  Zap, Activity, Workflow, Database, Globe2, GitBranch,
  Play, Pause, Settings, Upload, Download, Code2, Layers,
  Radio, Network, Terminal, ChevronRight, ArrowUpRight, Sparkles
} from "lucide-react"
import Nav from "@/components/Nav"

interface WorkflowStats {
  total: number
  active: number
  executions: number
  successRate: number
}

interface ConnectionStatus {
  service: string
  status: "connected" | "error" | "pending"
  latency: number
  color: string
}

export default function CommandCenter() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [stats, setStats] = useState<WorkflowStats>({
    total: 47,
    active: 12,
    executions: 1283,
    successRate: 99.2
  })

  const [connections] = useState<ConnectionStatus[]>([
    { service: "Stripe", status: "connected", latency: 42, color: "#635BFF" },
    { service: "Slack", status: "connected", latency: 28, color: "#4A154B" },
    { service: "OpenAI", status: "connected", latency: 156, color: "#10a37f" },
    { service: "GitHub", status: "connected", latency: 89, color: "#238636" },
    { service: "Notion", status: "pending", latency: 0, color: "#000000" },
    { service: "Linear", status: "connected", latency: 67, color: "#5E6AD2" },
  ])

  const [recentExecutions] = useState([
    { id: "exec-001", workflow: "Customer Onboarding", status: "success", duration: 2.3, time: "2m ago" },
    { id: "exec-002", workflow: "Invoice Generation", status: "success", duration: 1.8, time: "5m ago" },
    { id: "exec-003", workflow: "Support Ticket Routing", status: "running", duration: 0, time: "now" },
    { id: "exec-004", workflow: "Data Sync", status: "success", duration: 4.1, time: "12m ago" },
  ])

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date().toLocaleTimeString())
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        executions: prev.executions + Math.floor(Math.random() * 3)
      }))
    }, 3000)
    
    return () => {
      clearInterval(timeInterval)
      clearInterval(statsInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
      <Nav />

      <div className="pt-20 px-4 sm:px-6 pb-16">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon/20 to-cyan/20 border border-neon/30 flex items-center justify-center">
                <Terminal className="text-neon" size={20} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-text">Command Center</h1>
                <p className="text-sm text-text-dim">Real-time orchestration dashboard for .0n workflows</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon/10 border border-neon/30">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                <span className="text-xs font-bold text-neon">LIVE</span>
              </div>
              {mounted && <span className="text-xs text-text-muted">Last updated: {currentTime}</span>}
            </div>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatPanel
              label="Total Workflows"
              value={stats.total}
              icon={<Workflow size={20} />}
              color="#00ff88"
              trend="+3 this week"
            />
            <StatPanel
              label="Active Now"
              value={stats.active}
              icon={<Activity size={20} />}
              color="#00d4ff"
              trend="Running"
              pulse
            />
            <StatPanel
              label="Total Executions"
              value={stats.executions.toLocaleString()}
              icon={<Zap size={20} />}
              color="#9945ff"
              trend="+127 today"
            />
            <StatPanel
              label="Success Rate"
              value={`${stats.successRate}%`}
              icon={<Sparkles size={20} />}
              color="#ff3d9a"
              trend="Excellent"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Actions */}
              <div className="command-panel">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text">Quick Actions</h2>
                  <button className="text-xs text-cyan hover:text-text transition-colors">View All</button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <ActionButton
                    icon={<Upload size={18} />}
                    label="Import .0n"
                    color="#00ff88"
                  />
                  <ActionButton
                    icon={<Code2 size={18} />}
                    label="New Workflow"
                    color="#00d4ff"
                  />
                  <ActionButton
                    icon={<Database size={18} />}
                    label="Connections"
                    color="#9945ff"
                  />
                  <ActionButton
                    icon={<Settings size={18} />}
                    label="Configure"
                    color="#ff6b35"
                  />
                </div>
              </div>

              {/* Recent Executions */}
              <div className="command-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-cyan" />
                    <h2 className="text-lg font-bold text-text">Recent Executions</h2>
                  </div>
                  <Link href="/executions" className="text-xs text-cyan hover:text-text transition-colors flex items-center gap-1">
                    View All <ChevronRight size={12} />
                  </Link>
                </div>

                <div className="space-y-2">
                  {recentExecutions.map((exec) => (
                    <div key={exec.id} className="execution-row group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          exec.status === "success" ? "bg-green" :
                          exec.status === "running" ? "bg-cyan animate-pulse" :
                          "bg-red"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-text truncate">{exec.workflow}</div>
                          <div className="text-xs text-text-muted">{exec.id}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-mono text-text-dim">
                            {exec.status === "running" ? "Running..." : `${exec.duration}s`}
                          </div>
                          <div className="text-xs text-text-muted">{exec.time}</div>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <ArrowUpRight size={14} className="text-cyan" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Library */}
              <div className="command-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-purple" />
                    <h2 className="text-lg font-bold text-text">Workflow Library</h2>
                  </div>
                  <Link href="/library" className="text-xs text-purple hover:text-text transition-colors flex items-center gap-1">
                    Browse <ChevronRight size={12} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Customer Onboarding", services: 4, runs: 234, color: "#00ff88" },
                    { name: "Invoice Automation", services: 3, runs: 567, color: "#00d4ff" },
                    { name: "Support Routing", services: 5, runs: 891, color: "#9945ff" },
                    { name: "Data Pipeline", services: 6, runs: 1234, color: "#ff6b35" },
                  ].map((workflow) => (
                    <div key={workflow.name} className="workflow-card group">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${workflow.color}15` }}
                        >
                          <Workflow size={16} style={{ color: workflow.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-text truncate">{workflow.name}</div>
                          <div className="text-xs text-text-muted">{workflow.services} services</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-dim">{workflow.runs.toLocaleString()} runs</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded">
                          <Play size={12} className="text-text" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="command-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} className="text-neon" />
                    <h2 className="text-lg font-bold text-text">Connections</h2>
                  </div>
                  <span className="text-xs font-bold text-neon">{connections.filter(c => c.status === "connected").length}/{connections.length}</span>
                </div>

                <div className="space-y-3">
                  {connections.map((conn) => (
                    <div key={conn.service} className="connection-row">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            conn.status === "connected" ? "bg-green" :
                            conn.status === "pending" ? "bg-amber animate-pulse" :
                            "bg-red"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-text">{conn.service}</div>
                          {conn.status === "connected" && (
                            <div className="text-xs text-text-muted">{conn.latency}ms</div>
                          )}
                          {conn.status === "pending" && (
                            <div className="text-xs text-amber">Connecting...</div>
                          )}
                        </div>
                        <div
                          className="w-6 h-6 rounded-md flex-shrink-0"
                          style={{ background: `${conn.color}20` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-2 rounded-lg border border-border-hi hover:bg-white/5 text-sm font-semibold text-text transition-all flex items-center justify-center gap-2">
                  <Network size={14} />
                  Add Connection
                </button>
              </div>

              {/* System Health */}
              <div className="command-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Radio size={18} className="text-cyan" />
                  <h2 className="text-lg font-bold text-text">System Health</h2>
                </div>

                <div className="space-y-4">
                  <HealthMetric label="API Latency" value="42ms" percentage={95} color="#00ff88" />
                  <HealthMetric label="Execution Queue" value="3" percentage={12} color="#00d4ff" />
                  <HealthMetric label="Memory Usage" value="2.1GB" percentage={34} color="#9945ff" />
                  <HealthMetric label="Success Rate" value="99.2%" percentage={99} color="#ff3d9a" />
                </div>
              </div>

              {/* .0n Standard Badge */}
              <div className="command-panel bg-gradient-to-br from-neon/5 to-cyan/5 border-neon/20">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon/10 border border-neon/30 mb-3">
                    <Code2 size={16} className="text-neon" />
                    <span className="text-sm font-bold text-neon">.0n Standard</span>
                  </div>
                  <p className="text-xs text-text-dim leading-relaxed mb-4">
                    Universal file format for MCP integrations. Import, export, and share workflows seamlessly.
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 rounded-lg bg-neon/10 hover:bg-neon/20 border border-neon/30 text-xs font-semibold text-neon transition-all">
                      Learn More
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-border-hi text-xs font-semibold text-text transition-all">
                      Import .0n
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatPanel({ label, value, icon, color, trend, pulse }: {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: string
  pulse?: boolean
}) {
  const iconElement = icon as React.ReactElement<{ style?: React.CSSProperties; className?: string }>
  
  return (
    <div className="command-panel">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${pulse ? 'animate-pulse' : ''}`}
            style={{ background: `${color}15` }}
          >
            {React.cloneElement(iconElement, { style: { color }, className: iconElement.props.className })}
          </div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-black tracking-tight" style={{ color }}>
          {value}
        </div>
        {trend && (
          <span className="text-xs text-text-muted">{trend}</span>
        )}
      </div>
    </div>
  )
}

function ActionButton({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const iconElement = icon as React.ReactElement<{ style?: React.CSSProperties; className?: string }>
  
  return (
    <button
      className="action-button group"
      style={{ borderColor: `${color}20` }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
        style={{ background: `${color}15` }}
      >
        {React.cloneElement(iconElement, { style: { color }, className: iconElement.props.className })}
      </div>
      <span className="text-xs font-semibold text-text">{label}</span>
    </button>
  )
}

function HealthMetric({ label, value, percentage, color }: {
  label: string
  value: string
  percentage: number
  color: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-text-dim">{label}</span>
        <span className="text-xs font-mono text-text">{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
    </div>
  )
}

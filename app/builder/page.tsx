"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GitBranch, Plus, Trash2, GripVertical, Play, Save,
  Sparkles, Server, Zap, Radio, ChevronDown, ArrowRight,
  Layers, Download, CheckCircle2, Terminal, X
} from "lucide-react"

import { SERVICES, SKILLS } from "@/lib/catalog"
import { TOOLS_BY_SERVICE, type Tool } from "@/lib/tools-data"
import { cn } from "@/lib/utils"

interface SkillStep {
  id: string
  serviceId: string
  toolName: string
  description: string
  config: Record<string, string>
}

interface SkillDraft {
  name: string
  description: string
  steps: SkillStep[]
  level: 1 | 2 | 3
}

export default function BuilderPage() {
  const [draft, setDraft] = useState<SkillDraft>({
    name: "",
    description: "",
    steps: [],
    level: 1,
  })
  const [showAddStep, setShowAddStep] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [exported, setExported] = useState(false)

  const addStep = (serviceId: string, tool: Tool) => {
    setDraft(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: crypto.randomUUID(),
          serviceId,
          toolName: tool.name,
          description: tool.description,
          config: {},
        },
      ],
    }))
    setShowAddStep(false)
    setSelectedService(null)
  }

  const removeStep = (id: string) => {
    setDraft(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }))
  }

  const moveStep = (index: number, dir: -1 | 1) => {
    setDraft(prev => {
      const steps = [...prev.steps]
      const target = index + dir
      if (target < 0 || target >= steps.length) return prev
      ;[steps[index], steps[target]] = [steps[target], steps[index]]
      return { ...prev, steps }
    })
  }

  const exportSkill = () => {
    const skill = {
      "0n_version": "1.0",
      name: draft.name,
      description: draft.description,
      level: draft.level,
      steps: draft.steps.map((s, i) => ({
        order: i + 1,
        service: s.serviceId,
        tool: s.toolName,
        description: s.description,
        config: s.config,
      })),
      services: [...new Set(draft.steps.map(s => s.serviceId))],
      created: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(skill, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${draft.name.toLowerCase().replace(/\s+/g, "-") || "skill"}.0n.json`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const uniqueServices = [...new Set(draft.steps.map(s => s.serviceId))]

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <GitBranch size={24} className="text-purple" />
          <h1 className="text-3xl font-black tracking-tight">Skill Builder</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-sm font-bold text-text mb-4">Basic Information</h2>
              <div className="space-y-3">
                <input
                  value={draft.name}
                  onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Skill name..."
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple/40 transition-all"
                />
                <textarea
                  value={draft.description}
                  onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this skill do?"
                  rows={2}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple/40 transition-all resize-none"
                />
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setDraft(prev => ({ ...prev, level }))}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        draft.level === level ? "bg-white/10 text-text" : "glass-card text-text-dim"
                      )}
                    >
                      {level === 1 ? <Layers size={12} /> : level === 2 ? <GitBranch size={12} /> : <Zap size={12} />}
                      Level {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-text">Capability Chain</h2>
                <span className="text-xs text-text-muted">{draft.steps.length} step{draft.steps.length !== 1 ? "s" : ""}</span>
              </div>

              {draft.steps.length === 0 ? (
                <div className="text-center py-8 text-text-dim">
                  <Sparkles size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Add tools to build your skill workflow</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {draft.steps.map((step, i) => {
                    const svc = SERVICES.find(s => s.id === step.serviceId)
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 glass-card rounded-xl px-3 py-2.5 group"
                      >
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="text-text-muted hover:text-text disabled:opacity-20 transition-colors">
                            <ChevronDown size={10} className="rotate-180" />
                          </button>
                          <button onClick={() => moveStep(i, 1)} disabled={i === draft.steps.length - 1} className="text-text-muted hover:text-text disabled:opacity-20 transition-colors">
                            <ChevronDown size={10} />
                          </button>
                        </div>

                        <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black" style={{ background: (svc?.color || "#fff") + "18", color: svc?.color }}>
                          {i + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono font-bold text-text truncate">{step.toolName}</code>
                          </div>
                          <p className="text-[10px] text-text-dim truncate">{step.description}</p>
                        </div>

                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: (svc?.color || "#fff") + "18", color: svc?.color }}>
                          {svc?.name}
                        </span>

                        <button onClick={() => removeStep(step.id)} className="text-text-muted hover:text-red transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Add step */}
              <button
                onClick={() => setShowAddStep(!showAddStep)}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:border-purple/40 text-text-dim hover:text-text text-sm transition-all w-full justify-center"
              >
                <Plus size={14} />
                Add Step
              </button>

              {/* Step picker */}
              <AnimatePresence>
                {showAddStep && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-text">Select a service</p>
                        <button onClick={() => { setShowAddStep(false); setSelectedService(null) }} className="text-text-muted hover:text-text">
                          <X size={14} />
                        </button>
                      </div>

                      {!selectedService ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                          {SERVICES.filter(s => TOOLS_BY_SERVICE[s.id]?.length > 0).map(svc => (
                            <button
                              key={svc.id}
                              onClick={() => setSelectedService(svc.id)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                            >
                              <div className="w-3 h-3 rounded-full" style={{ background: svc.color }} />
                              <span className="text-xs font-bold text-text">{svc.name}</span>
                              <span className="text-[10px] text-text-muted ml-auto">{svc.tools}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <button onClick={() => setSelectedService(null)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text mb-2">
                            <ChevronDown size={10} className="rotate-90" />
                            Back
                          </button>
                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {(TOOLS_BY_SERVICE[selectedService] || []).map(tool => (
                              <button
                                key={tool.name}
                                onClick={() => addStep(selectedService, tool)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                              >
                                <span className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded ${
                                  tool.type === "tool" ? "bg-neon/8 text-neon" :
                                  tool.type === "action" ? "bg-orange/8 text-orange" :
                                  "bg-purple/8 text-purple"
                                }`}>
                                  {tool.type}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <code className="text-[11px] font-mono text-text">{tool.name}</code>
                                  <p className="text-[10px] text-text-dim truncate">{tool.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="glass-card rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Actions</h3>
              <button
                onClick={exportSkill}
                disabled={!draft.name || draft.steps.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {exported ? <CheckCircle2 size={14} /> : <Download size={14} />}
                {exported ? "Exported!" : "Export .0n Skill"}
              </button>
              <button
                disabled={!draft.name || draft.steps.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-card text-text-dim font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.06] transition-all"
              >
                <Play size={14} />
                Test Skill
              </button>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-dim">Steps</span>
                  <span className="font-bold text-text">{draft.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Services</span>
                  <span className="font-bold text-text">{uniqueServices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Level</span>
                  <span className="font-bold" style={{ color: draft.level === 1 ? "#00ff88" : draft.level === 2 ? "#00d4ff" : "#9945ff" }}>
                    {draft.level}
                  </span>
                </div>
              </div>

              {uniqueServices.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Services Used</p>
                  <div className="flex flex-wrap gap-1">
                    {uniqueServices.map(sid => {
                      const svc = SERVICES.find(s => s.id === sid)
                      return (
                        <span key={sid} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: (svc?.color || "#fff") + "12", color: svc?.color }}>
                          {svc?.name || sid}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Flow preview */}
            {draft.steps.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Flow</h3>
                <div className="flex flex-col items-center gap-1">
                  {draft.steps.map((step, i) => {
                    const svc = SERVICES.find(s => s.id === step.serviceId)
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: (svc?.color || "#fff") + "18", color: svc?.color }}>
                          {svc?.name}: {step.toolName.split("_").slice(1).join("_")}
                        </div>
                        {i < draft.steps.length - 1 && (
                          <ArrowRight size={12} className="text-text-muted rotate-90 my-1" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Templates */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Quick Templates</h3>
              <div className="space-y-2">
                {SKILLS.slice(0, 4).map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => {
                      setDraft({
                        name: skill.name,
                        description: skill.description,
                        steps: skill.services.map(sid => {
                          const tools = TOOLS_BY_SERVICE[sid] || []
                          const tool = tools[0]
                          return {
                            id: crypto.randomUUID(),
                            serviceId: sid,
                            toolName: tool?.name || `${sid}_execute`,
                            description: tool?.description || `Execute ${sid} operation`,
                            config: {},
                          }
                        }),
                        level: skill.level,
                      })
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <Sparkles size={12} className="text-pink" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text truncate">{skill.name}</p>
                      <p className="text-[10px] text-text-dim truncate">{skill.services.length} services</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

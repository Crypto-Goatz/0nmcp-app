"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles, Play, ChevronRight, Terminal, Layers, GitBranch,
  Zap, ArrowRight, Shield, Clock, Star
} from "lucide-react"

import AddToList from "@/components/AddToList"
import { SKILLS, SERVICES } from "@/lib/catalog"

const LEVEL_CONFIG = {
  1: { label: "Basic", color: "#00ff88", desc: "Sequential pipeline" },
  2: { label: "Enhanced", color: "#00d4ff", desc: "Assembly line with AI routing" },
  3: { label: "Advanced", color: "#9945ff", desc: "Radial burst parallel execution" },
}

export default function SkillsPage() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null)
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)

  const filtered = activeLevel ? SKILLS.filter(s => s.level === activeLevel) : SKILLS

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={24} className="text-pink" />
              <h1 className="text-3xl font-black tracking-tight">SkillForge</h1>
            </div>
            <p className="text-sm text-text-dim">
              Pre-built automations powered by 0nMCP. Chain multiple services into powerful workflows.
            </p>
          </div>
          <Link
            href="/builder"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink to-purple text-white text-sm font-bold hover:shadow-lg transition-all"
          >
            <GitBranch size={14} />
            Build Custom
          </Link>
        </div>

        {/* Execution Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {([1, 2, 3] as const).map(level => {
            const config = LEVEL_CONFIG[level]
            const count = SKILLS.filter(s => s.level === level).length
            return (
              <button
                key={level}
                onClick={() => setActiveLevel(activeLevel === level ? null : level)}
                className={`glass-card rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                  activeLevel === level ? "ring-1" : ""
                }`}
                style={{ borderColor: activeLevel === level ? config.color : undefined }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: config.color + "18" }}>
                    {level === 1 ? <Layers size={12} style={{ color: config.color }} /> :
                     level === 2 ? <GitBranch size={12} style={{ color: config.color }} /> :
                     <Zap size={12} style={{ color: config.color }} />}
                  </div>
                  <span className="text-sm font-bold" style={{ color: config.color }}>Level {level}: {config.label}</span>
                </div>
                <p className="text-xs text-text-dim">{config.desc}</p>
                <p className="text-[10px] text-text-muted mt-2">{count} skill{count !== 1 ? "s" : ""}</p>
              </button>
            )
          })}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill, i) => {
            const config = LEVEL_CONFIG[skill.level]
            const expanded = expandedSkill === skill.id

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedSkill(expanded ? null : skill.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-pink" />
                      <span className="font-bold text-text text-sm">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AddToList
                        text={`Set up skill: ${skill.name} — ${skill.description}`}
                        source="Skills"
                        inline
                      />
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: config.color + "18", color: config.color }}
                      >
                        L{skill.level}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-dim leading-relaxed mb-3">{skill.description}</p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skill.services.map(sid => {
                      const svc = SERVICES.find(s => s.id === sid)
                      return (
                        <span
                          key={sid}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: (svc?.color || "#fff") + "12", color: svc?.color || "#fff" }}
                        >
                          {svc?.name || sid}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">{skill.category}</span>
                    <ChevronRight
                      size={14}
                      className={`text-text-muted transition-transform ${expanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border px-5 py-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Execution Flow</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {skill.services.map((sid, j) => {
                            const svc = SERVICES.find(s => s.id === sid)
                            return (
                              <span key={sid} className="flex items-center gap-1">
                                <span className="text-xs font-mono" style={{ color: svc?.color }}>{svc?.name || sid}</span>
                                {j < skill.services.length - 1 && <ArrowRight size={10} className="text-text-muted" />}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Capability</p>
                        <div className="flex items-center gap-3 text-xs text-text-dim">
                          <span className="flex items-center gap-1">
                            <Shield size={10} /> {config.label}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> ~{skill.level * 2}s avg
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={10} /> {skill.services.length} services
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Link
                          href="/console"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon/10 text-neon text-xs font-bold hover:bg-neon/20 transition-colors"
                        >
                          <Play size={10} />
                          Run in Console
                        </Link>
                        <Link
                          href="/builder"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-text-dim text-xs font-bold hover:bg-white/[0.06] transition-colors"
                        >
                          <GitBranch size={10} />
                          Customize
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

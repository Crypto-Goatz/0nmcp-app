"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart3, Linkedin, ListTodo, Sparkles, ArrowRight,
  Shield, Zap, Globe, Eye, MessageSquare, Target, Power,
  GraduationCap, Bot, Brain, Rocket, Paintbrush
} from "lucide-react"

import AddToList from "@/components/AddToList"

const APPS = [
  {
    id: "assistant",
    name: "0nMCP Assistant",
    tagline: "AI Chat Interface",
    description: "Browser-based assistant for 0nMCP. Dual-mode execution (Anthropic API or local server), tool detection, workflow generation, and .0n config export.",
    icon: Bot,
    color: "#00ff88",
    badge: "Chat + Execute",
    features: ["Dual execution mode", "Tool detection", "Workflow builder", "Quick actions"],
    status: "live",
  },
  {
    id: "cro9",
    name: "CRO9",
    tagline: "Behavioral Tracker",
    description: "147 behavioral metrics with GDPR/CCPA compliance. One-line installation, real-time analytics, exit intent detection.",
    icon: BarChart3,
    color: "#ff6b35",
    badge: "147 Metrics",
    features: ["One-line install", "Cookie consent", "Exit intent hooks", "Multi-platform"],
    status: "live",
  },
  {
    id: "linkedin",
    name: "LinkedIn Outreach",
    tagline: "AI-Powered Prospecting",
    description: "Profile scraping, AI message composition with tone selection, lead scoring, and automated screenshot capture.",
    icon: Linkedin,
    color: "#0a66c2",
    badge: "AI Composer",
    features: ["Profile scraper", "Lead scoring", "Tone-aware AI", "Bulk import"],
    status: "live",
  },
  {
    id: "focus",
    name: "Focus Flow",
    tagline: "Task & Focus Manager",
    description: "AI-powered project breakdown, phase-based workflows, Pomodoro timer, drag-drop notes, and step-by-step task guidance.",
    icon: ListTodo,
    color: "#10b981",
    badge: "AI Planning",
    features: ["Phase workflows", "Pomodoro timer", "AI breakdown", "Notes system"],
    status: "live",
  },
  {
    id: "courses",
    name: "AI Course Builder",
    tagline: "Generate Complete Courses",
    description: "Enter a topic and AI generates a full curriculum — modules, lessons, quizzes, and content. Export as JSON or teach directly.",
    icon: GraduationCap,
    color: "#9945ff",
    badge: "AI Generator",
    features: ["Full curriculum", "Lesson content", "Quiz builder", "JSON export"],
    status: "live",
  },
  {
    id: "qadist",
    name: "QA Distribution",
    tagline: "SEO Content Engine",
    description: "AI-powered content distribution across 12 high-authority platforms. Reddit monitoring, forum discovery, quality scoring, and weekly scheduling.",
    icon: Target,
    color: "#00d4ff",
    badge: "12 Platforms",
    features: ["Multi-platform AI", "Reddit monitor", "Forum discovery", "Quality scoring"],
    status: "live",
  },
  {
    id: "trainer",
    name: "AI Trainer",
    tagline: "Universal Config Platform",
    description: "Import credentials from any format, train skill layers interactively, and export to 18+ AI platforms with .rocket encryption.",
    icon: Brain,
    color: "#00d4ff",
    badge: "18+ Platforms",
    features: ["Multi-format import", "Skill training", ".rocket encryption", "Brain factory"],
    status: "live",
  },
  {
    id: "smartdeploy",
    name: "JSON SmartDeploy",
    tagline: "Workflow Deployment Engine",
    description: "5-stage intelligent pipeline — Parse, Resolve, Generate, Map, Deploy. Auto-detects missing assets and AI-creates them.",
    icon: Rocket,
    color: "#ff6b35",
    badge: "5-Stage Pipeline",
    features: ["Auto-detection", "AI generation", "ID mapping", "CRM deploy"],
    status: "live",
  },
  {
    id: "canvas",
    name: "APEX Canvas",
    tagline: "Visual Page Builder",
    description: "36+ components, AI-powered page generation, responsive preview, and multi-platform export to HTML, React, Vue, Shopify, and more.",
    icon: Paintbrush,
    color: "#ff3d9a",
    badge: "AI Builder",
    features: ["36+ components", "AI generation", "Responsive preview", "12 export formats"],
    status: "live",
  },
  {
    id: "botcoaches",
    name: "BotCoaches",
    tagline: "AI Behavior Training",
    description: "Train portable AI behaviors, export as .brain files, deploy on any LLM. The Brain/Skull/Body paradigm.",
    icon: Sparkles,
    color: "#9945ff",
    badge: "Coming Soon",
    features: ["Brain training", ".brain export", "Marketplace", "LLM-agnostic"],
    status: "soon",
  },
]

export default function AppsPage() {
  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/5 border border-orange/20 text-orange text-xs font-bold mb-4">
            <Zap size={12} />
            Powered by 0nMCP
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="gradient-text">Integrated Apps</span>
          </h1>
          <p className="text-text-dim max-w-2xl mx-auto">
            Production-ready tools that plug into the 0nMCP ecosystem. Each app leverages the orchestrator
            for AI-powered automation across 59 services and 1,385+ capabilities.
          </p>
        </div>

        {/* Apps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {APPS.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={app.status === "soon" ? "#" : `/apps/${app.id}`}
                className={`block glass-card rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group ${
                  app.status === "soon" ? "opacity-70 cursor-default" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: app.color + "15" }}>
                      <app.icon size={24} style={{ color: app.color }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black">{app.name}</h2>
                      <p className="text-xs text-text-dim">{app.tagline}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: app.color + "18", color: app.color }}>
                    {app.badge}
                  </span>
                </div>

                <p className="text-sm text-text-dim leading-relaxed mb-4">{app.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {app.features.map(f => (
                    <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {app.status !== "soon" && (
                    <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: app.color }}>
                      Open App <ArrowRight size={12} />
                    </div>
                  )}
                  <AddToList
                    text={`Explore ${app.name}: ${app.description}`}
                    source="Apps Hub"
                    size="sm"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

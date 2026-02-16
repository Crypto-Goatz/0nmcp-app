import Link from "next/link"
import { STATS, SERVICES, CATEGORIES, SKILLS } from "@/lib/catalog"
import {
  Zap, Server, Layers, Radio, Sparkles, ArrowRight,
  GitBranch, Shield, Globe, ChevronRight, Terminal
} from "lucide-react"
import Nav from "@/components/Nav"

function StatCard({ value, label, color, delay }: { value: number | string; label: string; color: string; delay: number }) {
  return (
    <div
      className="stat-card glass-card rounded-2xl p-6 text-center animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl md:text-5xl font-black tracking-tight mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-sm text-text-dim uppercase tracking-widest font-semibold">{label}</div>
    </div>
  )
}

function ServiceCard({ id, name, category, tools, color, description, delay }: {
  id: string; name: string; category: string; tools: number; color: string; description: string; delay: number
}) {
  const cat = CATEGORIES.find(c => c.id === category)
  return (
    <Link
      href={`/services/${id}`}
      className="glass-card rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 animate-fade-in group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="font-bold text-text text-sm">{name}</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: color + "18", color }}>
          {tools}
        </span>
      </div>
      <p className="text-xs text-text-muted line-clamp-1">{description}</p>
      <div className="text-[10px] text-text-muted mt-2 uppercase tracking-wider">
        {cat?.label || category}
      </div>
    </Link>
  )
}

function SkillCard({ name, description, services, level, delay }: {
  name: string; description: string; services: string[]; level: number; delay: number
}) {
  return (
    <div
      className="glass-card rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-pink" />
        <span className="font-bold text-text text-sm">{name}</span>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple/10 text-purple">
          L{level}
        </span>
      </div>
      <p className="text-xs text-text-dim leading-relaxed mb-3">{description}</p>
      <div className="flex flex-wrap gap-1">
        {services.map(s => {
          const svc = SERVICES.find(sv => sv.id === s)
          return (
            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">
              {svc?.name || s}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function Home() {
  const sortedServices = [...SERVICES].sort((a, b) => b.tools - a.tools)

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/5 border border-neon/20 text-neon text-xs font-bold mb-6 animate-fade-in">
              <Radio size={12} />
              Universal AI API Orchestrator
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <span className="gradient-text">{STATS.tools} Tools.</span>
              <br />
              <span className="text-text">{STATS.services} Services.</span>
              <br />
              <span className="text-text-dim">One Command.</span>
            </h1>
            <p className="text-lg text-text-dim max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
              Chain, combine, and automate MCP servers with natural language.
              The most comprehensive MCP orchestrator available.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Link href="/console" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg font-bold text-sm hover:shadow-lg hover:shadow-neon/20 transition-all">
                <Terminal size={16} />
                Open Console
              </Link>
              <Link href="/services" className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-text font-semibold text-sm hover:bg-white/[0.06] transition-all">
                <Server size={16} />
                Explore Services
              </Link>
              <Link href="/builder" className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-text font-semibold text-sm hover:bg-white/[0.06] transition-all">
                <GitBranch size={16} />
                Build Skills
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            <StatCard value={STATS.tools} label="Tools" color="#00ff88" delay={400} />
            <StatCard value={STATS.services} label="Services" color="#00d4ff" delay={440} />
            <StatCard value={STATS.actions} label="Actions" color="#ff6b35" delay={480} />
            <StatCard value={STATS.triggers} label="Triggers" color="#9945ff" delay={520} />
            <StatCard value={STATS.total} label="Total" color="#ff3d9a" delay={560} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Services</h2>
              <p className="text-sm text-text-dim mt-1">{STATS.services} integrations across {STATS.categories} categories</p>
            </div>
            <Link href="/services" className="flex items-center gap-1 text-sm text-cyan hover:text-text transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(c => {
              const count = SERVICES.filter(s => s.category === c.id).length
              return (
                <span key={c.id} className="text-xs font-semibold px-3 py-1.5 rounded-full glass-card" style={{ color: c.color }}>
                  {c.label} ({count})
                </span>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sortedServices.map((s, i) => (
              <ServiceCard
                key={s.id}
                id={s.id}
                name={s.name}
                category={s.category}
                tools={s.tools}
                color={s.color}
                description={s.description}
                delay={100 + i * 40}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 px-4 sm:px-6 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-pink" />
                <h2 className="text-3xl font-black tracking-tight">Pre-Built Skills</h2>
              </div>
              <p className="text-sm text-text-dim">Ready-to-use automations powered by 0nMCP. From SkillForge.</p>
            </div>
            <Link href="/skills" className="flex items-center gap-1 text-sm text-pink hover:text-text transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SKILLS.map((skill, i) => (
              <SkillCard
                key={skill.id}
                name={skill.name}
                description={skill.description}
                services={skill.services}
                level={skill.level}
                delay={100 + i * 60}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight mb-2">Patented Architecture</h2>
            <p className="text-sm text-text-dim">US Patent Application #63/968,814 — Three-Level Execution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Pipeline", desc: "Sequential phases that organize complex workflows into manageable stages.", color: "#00ff88", level: "Level 1" },
              { icon: GitBranch, title: "Assembly Line", desc: "Decision moments within phases. AI evaluates conditions and routes data.", color: "#00d4ff", level: "Level 2" },
              { icon: Zap, title: "Radial Burst", desc: "Parallel action execution. Multiple API calls fire simultaneously.", color: "#9945ff", level: "Level 3" },
            ].map((arch, i) => (
              <div
                key={arch.title}
                className="glass-card rounded-2xl p-6 text-center animate-fade-in animate-pulse-glow"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: arch.color + "15" }}>
                  <arch.icon size={28} style={{ color: arch.color }} />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: arch.color }}>
                  {arch.level}
                </div>
                <h3 className="text-xl font-black mb-2">{arch.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">{arch.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/architecture" className="inline-flex items-center gap-1 text-sm text-purple hover:text-text transition-colors">
              Deep Dive <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">Ready to orchestrate?</span>
          </h2>
          <p className="text-lg text-text-dim mb-8">
            Install 0nMCP and connect {STATS.services} services in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.npmjs.com/package/0nmcp"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg font-bold text-sm hover:shadow-lg hover:shadow-neon/20 transition-all"
            >
              <code className="font-mono">npx 0nmcp</code>
              <ArrowRight size={16} />
            </a>
            <a
              href="https://github.com/0nork/0nMCP"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-text font-semibold text-sm hover:bg-white/[0.06] transition-all"
            >
              <Shield size={16} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-neon to-cyan flex items-center justify-center">
              <Zap size={12} className="text-bg" />
            </div>
            <span className="text-sm text-text-dim">
              0nMCP v{STATS.version} — {STATS.tools} tools, {STATS.services} services
            </span>
          </div>
          <div className="text-xs text-text-muted">
            MIT — &copy; 2026 <a href="https://0nork.com" className="text-text-dim hover:text-text">0nORK</a> / <a href="https://rocketopp.com" className="text-text-dim hover:text-text">RocketOpp, LLC</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

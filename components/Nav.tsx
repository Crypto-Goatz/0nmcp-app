"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Zap, Server, Layers, Sparkles, Terminal, Settings,
  Globe, Menu, X, LayoutDashboard, GitBranch, Grid3X3, Power
} from "lucide-react"
import { STATS } from "@/lib/catalog"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/console", label: "Console", icon: Terminal },
  { href: "/services", label: "Services", icon: Server },
  { href: "/skills", label: "Skills", icon: Sparkles },
  { href: "/builder", label: "Builder", icon: GitBranch },
  { href: "/architecture", label: "Architecture", icon: Layers },
  { href: "/apps", label: "Apps", icon: Grid3X3 },
  { href: "/turn-it-on", label: "Turn it 0n", icon: Power },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-cyan flex items-center justify-center">
            <Zap size={16} className="text-bg" />
          </div>
          <span className="font-black text-lg tracking-tight">0nMCP</span>
          <span className="text-xs text-text-muted hidden sm:inline">v{STATS.version}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-neon/10 text-neon font-bold"
                    : "text-text-dim hover:text-text hover:bg-white/[0.04]"
                )}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            )
          })}
          <a
            href="https://0nmcp.com"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon/10 text-neon text-xs font-bold hover:bg-neon/20 transition-colors ml-2"
          >
            <Globe size={12} />
            0nmcp.com
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] text-text-dim"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden px-4 pb-4 border-t border-border flex flex-col gap-1">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-neon/10 text-neon font-bold"
                    : "text-text-dim hover:text-text hover:bg-white/[0.04]"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}

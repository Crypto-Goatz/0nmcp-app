"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Zap, Terminal, Server, Sparkles, GitBranch, Layers,
  Grid3X3, Power, Settings, Users, LayoutDashboard,
  ChevronLeft, ChevronRight, Globe, MessageSquare, Combine
} from "lucide-react"
import { cn } from "@/lib/utils"
import UserMenu from "./auth/UserMenu"
import NotificationBell from "./community/NotificationBell"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard, color: "#eef0ff" },
  { href: "/console", label: "Console", icon: Terminal, color: "#00ff88" },
  { href: "/services", label: "Services", icon: Server, color: "#00d4ff" },
  { href: "/skills", label: "Skills", icon: Sparkles, color: "#ff3d9a" },
  { href: "/builder", label: "Builder", icon: GitBranch, color: "#9945ff" },
  { href: "/composer", label: "Composer", icon: Combine, color: "#ff6b35" },
  { href: "/architecture", label: "Arch", icon: Layers, color: "#ff6b35" },
  { href: "/apps", label: "Apps", icon: Grid3X3, color: "#00d4ff" },
  { href: "/community", label: "Community", icon: Users, color: "#9945ff" },
]

const BOTTOM_ITEMS = [
  { href: "/turn-it-on", label: "Turn it 0n", icon: Power, color: "#00ff88" },
  { href: "/settings", label: "Settings", icon: Settings, color: "#484e78" },
]

export default function NavRail() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-all duration-300 ease-out",
        "bg-[#060610]/95 backdrop-blur-xl border-r border-border/50",
        expanded ? "w-[200px]" : "w-[64px]"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 h-16 shrink-0 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-cyan flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-neon/30 transition-shadow">
          <Zap size={16} className="text-bg" />
        </div>
        {expanded && (
          <span className="font-black text-lg tracking-tight whitespace-nowrap overflow-hidden">
            0nMCP
          </span>
        )}
      </Link>

      {/* Divider */}
      <div className="mx-3 h-px bg-gradient-to-r from-neon/20 via-cyan/10 to-transparent" />

      {/* Main nav */}
      <div className="flex-1 flex flex-col gap-0.5 px-2 py-3 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl transition-all duration-200 group",
                expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                active
                  ? "bg-white/[0.08] text-text"
                  : "text-text-muted hover:text-text hover:bg-white/[0.04]"
              )}
            >
              {/* Active indicator — glowing left bar */}
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: item.color, boxShadow: `0 0 12px ${item.color}60` }}
                />
              )}

              <item.icon
                size={18}
                className="shrink-0 transition-colors"
                style={active ? { color: item.color } : undefined}
              />

              {expanded && (
                <span className={cn(
                  "text-sm font-semibold whitespace-nowrap overflow-hidden",
                  active && "font-bold"
                )}>
                  {item.label}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {!expanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold text-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[60] shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* Bottom section */}
      <div className="px-2 pb-2 flex flex-col gap-0.5">
        <div className="mx-1 h-px bg-border/30 mb-1" />

        {BOTTOM_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl transition-all duration-200 group",
                expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                active
                  ? "bg-white/[0.08] text-text"
                  : "text-text-muted hover:text-text hover:bg-white/[0.04]"
              )}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: item.color, boxShadow: `0 0 12px ${item.color}60` }}
                />
              )}
              <item.icon size={18} className="shrink-0" style={active ? { color: item.color } : undefined} />
              {expanded && (
                <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
              )}
              {!expanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold text-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[60] shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}

        {/* External link */}
        <a
          href="https://0nmcp.com"
          target="_blank"
          rel="noopener"
          className={cn(
            "flex items-center gap-3 rounded-xl transition-all duration-200 text-text-muted hover:text-neon hover:bg-neon/5 group",
            expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
          )}
        >
          <Globe size={18} className="shrink-0" />
          {expanded && <span className="text-sm font-semibold whitespace-nowrap">0nmcp.com</span>}
          {!expanded && (
            <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold text-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[60] shadow-xl">
              0nmcp.com
            </div>
          )}
        </a>

        {/* Collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center py-2 rounded-xl text-text-muted hover:text-text hover:bg-white/[0.04] transition-all mt-1"
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* User section */}
        <div className={cn(
          "flex items-center gap-2 pt-1 border-t border-border/30",
          expanded ? "px-1 justify-between" : "justify-center flex-col"
        )}>
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}

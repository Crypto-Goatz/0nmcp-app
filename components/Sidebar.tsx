"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap, X, Plus, Check, Trash2, Bell, ListTodo, AlertTriangle,
  ChevronDown, ChevronRight, Clock, Circle, CircleDot, CheckCircle2,
  Brain, Send, Play, Pause, Settings, Inbox,
  BarChart3, Layers, Timer, Clipboard, Edit3, Sparkles, RotateCcw,
  AlertCircle, Info, CheckCircle, XCircle,
  PanelRightClose, PanelRightOpen, Activity, Rocket,
  Calendar, StickyNote, Tag, Flag, Server, Radio
} from "lucide-react"
import { cn } from "@/lib/utils"
import { STATS } from "@/lib/catalog"

// ─── TYPES ────────────────────────────────────────────────
type TaskStatus = "todo" | "in-progress" | "done"
type TaskPriority = 1 | 2 | 3 | 4
type TaskCategory = "work" | "dev" | "personal" | "urgent" | "research"
type NotificationType = "info" | "success" | "warning" | "error"
type PanelId = "pulse" | "tasks" | "activity" | "focus" | "quick"

interface Task {
  id: string
  text: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  notes: string
  dueDate: string | null
  createdAt: number
  completedAt: number | null
  focusTime: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: number
  read: boolean
  source?: string
}

// ─── CONSTANTS ────────────────────────────────────────────
const CATEGORIES: { id: TaskCategory; label: string; color: string }[] = [
  { id: "work", label: "Work", color: "#ff6b35" },
  { id: "dev", label: "Dev", color: "#00d4ff" },
  { id: "personal", label: "Personal", color: "#10b981" },
  { id: "urgent", label: "Urgent", color: "#f87171" },
  { id: "research", label: "Research", color: "#9945ff" },
]

const PRIORITIES: { level: TaskPriority; label: string; color: string }[] = [
  { level: 1, label: "Low", color: "#484e78" },
  { level: 2, label: "Med", color: "#00d4ff" },
  { level: 3, label: "High", color: "#ff6b35" },
  { level: 4, label: "Critical", color: "#f87171" },
]

const STATUS_CYCLE: TaskStatus[] = ["todo", "in-progress", "done"]
const STATUS_ICONS = { "todo": Circle, "in-progress": CircleDot, "done": CheckCircle2 }
const STATUS_COLORS = { "todo": "#484e78", "in-progress": "#00d4ff", "done": "#00ff88" }

const STORAGE_KEY_TASKS = "0n-cc-tasks"
const STORAGE_KEY_NOTIFS = "0n-cc-notifs"
const STORAGE_KEY_PANELS = "0n-sidebar-panels"
const STORAGE_KEY_COLLAPSED = "0n-sidebar-collapsed"

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return "now"
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

// ─── COLLAPSIBLE PANEL WRAPPER ────────────────────────────
function Panel({
  id, title, icon: Icon, color, count, open, onToggle, children
}: {
  id: string; title: string; icon: typeof Zap; color: string
  count?: number; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/[0.02] transition-colors group"
      >
        <Icon size={13} style={{ color }} className="shrink-0" />
        <span className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex-1 text-left">
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center" style={{ background: color + "20", color }}>
            {count}
          </span>
        )}
        <ChevronDown
          size={12}
          className={cn("text-text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── MAIN SIDEBAR ─────────────────────────────────────────
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loaded, setLoaded] = useState(false)

  // Panel open states
  const [openPanels, setOpenPanels] = useState<Record<PanelId, boolean>>({
    pulse: true, tasks: true, activity: true, focus: false, quick: false,
  })

  // Task input
  const [quickText, setQuickText] = useState("")
  const [quickCategory, setQuickCategory] = useState<TaskCategory>("work")
  const [quickPriority, setQuickPriority] = useState<TaskPriority>(2)

  // Focus timer
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null)
  const [focusTime, setFocusTime] = useState(0)
  const [focusRunning, setFocusRunning] = useState(false)
  const focusInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Brain dump
  const [brainDump, setBrainDump] = useState("")

  // ─── LOAD / SAVE ─────────────────────────────────
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_KEY_TASKS)
      const n = localStorage.getItem(STORAGE_KEY_NOTIFS)
      const p = localStorage.getItem(STORAGE_KEY_PANELS)
      const c = localStorage.getItem(STORAGE_KEY_COLLAPSED)
      if (t) setTasks(JSON.parse(t))
      if (n) setNotifications(JSON.parse(n))
      if (p) setOpenPanels(prev => ({ ...prev, ...JSON.parse(p) }))
      if (c) setCollapsed(JSON.parse(c))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks))
  }, [tasks, loaded])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications))
  }, [notifications, loaded])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY_PANELS, JSON.stringify(openPanels))
  }, [openPanels, loaded])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(collapsed))
  }, [collapsed, loaded])

  // ─── GLOBAL EVENT LISTENERS ──────────────────────
  const addNotification = useCallback((title: string, message: string, type: NotificationType = "info", source?: string) => {
    setNotifications(prev => [{
      id: uid(), title, message, type, timestamp: Date.now(), read: false, source,
    }, ...prev].slice(0, 100))
  }, [])

  const addTaskFromEvent = useCallback((text: string, source?: string) => {
    const task: Task = {
      id: uid(), text, category: "work", priority: 2, status: "todo",
      notes: source ? `Added from ${source}` : "",
      dueDate: null, createdAt: Date.now(), completedAt: null, focusTime: 0,
    }
    setTasks(prev => [task, ...prev])
    addNotification("Task Added", text, "success", source)
  }, [addNotification])

  useEffect(() => {
    const handleAddTask = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.text) addTaskFromEvent(detail.text, detail.source)
    }
    const handleNotify = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.title) addNotification(detail.title, detail.message || "", detail.type || "info", detail.source)
    }
    window.addEventListener("0n-add-task", handleAddTask)
    window.addEventListener("0n-notify", handleNotify)
    return () => {
      window.removeEventListener("0n-add-task", handleAddTask)
      window.removeEventListener("0n-notify", handleNotify)
    }
  }, [addTaskFromEvent, addNotification])

  useEffect(() => {
    if (!loaded) return
    if (notifications.length === 0) {
      addNotification("Welcome to Command Center", "Your mission control sidebar is ready.", "info", "system")
    }
  }, [loaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── FOCUS TIMER ────────────────────────────────
  useEffect(() => {
    if (focusRunning && focusTaskId) {
      focusInterval.current = setInterval(() => setFocusTime(prev => prev + 1), 1000)
    } else if (focusInterval.current) {
      clearInterval(focusInterval.current)
    }
    return () => { if (focusInterval.current) clearInterval(focusInterval.current) }
  }, [focusRunning, focusTaskId])

  // ─── TASK ACTIONS ───────────────────────────────
  const addTask = () => {
    if (!quickText.trim()) return
    setTasks(prev => [{
      id: uid(), text: quickText.trim(), category: quickCategory, priority: quickPriority,
      status: "todo", notes: "", dueDate: null, createdAt: Date.now(), completedAt: null, focusTime: 0,
    }, ...prev])
    setQuickText("")
  }

  const cycleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx = STATUS_CYCLE.indexOf(t.status)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return { ...t, status: next, completedAt: next === "done" ? Date.now() : null }
    }))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (focusTaskId === id) { setFocusTaskId(null); setFocusRunning(false); setFocusTime(0) }
  }

  const startFocus = (id: string) => {
    if (focusTaskId === id) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, focusTime: t.focusTime + focusTime } : t))
      setFocusTaskId(null); setFocusRunning(false); setFocusTime(0)
    } else {
      if (focusTaskId) {
        setTasks(prev => prev.map(t => t.id === focusTaskId ? { ...t, focusTime: t.focusTime + focusTime } : t))
      }
      setFocusTaskId(id); setFocusRunning(true); setFocusTime(0)
    }
  }

  const parseBrainDump = () => {
    if (!brainDump.trim()) return
    const lines = brainDump.split("\n").filter(l => l.trim())
    const newTasks: Task[] = lines.map(line => ({
      id: uid(), text: line.replace(/^[-*\u2022]\s*/, "").trim(), category: "work" as TaskCategory,
      priority: 2 as TaskPriority, status: "todo" as TaskStatus, notes: "From brain dump",
      dueDate: null, createdAt: Date.now(), completedAt: null, focusTime: 0,
    }))
    setTasks(prev => [...newTasks, ...prev])
    addNotification("Brain Dump", `${newTasks.length} tasks parsed`, "success")
    setBrainDump("")
  }

  const togglePanel = (id: PanelId) => {
    setOpenPanels(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // ─── COMPUTED ───────────────────────────────────
  const todoCount = tasks.filter(t => t.status === "todo").length
  const activeCount = tasks.filter(t => t.status === "in-progress").length
  const doneCount = tasks.filter(t => t.status === "done").length
  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const notifIcon = (type: NotificationType) => {
    switch (type) {
      case "success": return <CheckCircle size={11} className="text-neon" />
      case "warning": return <AlertCircle size={11} className="text-amber" />
      case "error": return <XCircle size={11} className="text-red" />
      default: return <Info size={11} className="text-cyan" />
    }
  }

  // ─── COLLAPSED STATE ────────────────────────────
  if (collapsed) {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-[48px] z-40 bg-[#060610]/95 backdrop-blur-xl border-l border-border/50 flex flex-col items-center py-3 gap-2">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-xl hover:bg-white/[0.06] text-text-muted hover:text-neon transition-colors"
          title="Open sidebar"
        >
          <PanelRightOpen size={16} />
        </button>
        <div className="w-6 h-px bg-border/30" />

        {/* Mini indicators */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <div className="relative" title={`${todoCount + activeCount} tasks`}>
            <ListTodo size={14} className="text-text-muted" />
            {(todoCount + activeCount) > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3 h-3 rounded-full bg-cyan text-[7px] font-black text-bg flex items-center justify-center">
                {todoCount + activeCount}
              </span>
            )}
          </div>
          <div className="relative" title={`${unreadCount} notifications`}>
            <Bell size={14} className="text-text-muted" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3 h-3 rounded-full bg-pink text-[7px] font-black text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          {focusRunning && (
            <div className="flex flex-col items-center" title="Focus active">
              <Timer size={14} className="text-cyan animate-pulse" />
              <span className="text-[7px] font-mono text-cyan mt-0.5">{formatTime(focusTime)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── FULL SIDEBAR ───────────────────────────────
  return (
    <div className="fixed top-0 right-0 bottom-0 w-[320px] z-40 bg-[#060610]/95 backdrop-blur-xl border-l border-border/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          <span className="text-[11px] font-black tracking-widest uppercase text-text-dim">Command</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text transition-colors"
        >
          <PanelRightClose size={14} />
        </button>
      </div>

      {/* Scrollable panels */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* ─── SYSTEM PULSE ─────────────────────── */}
        <Panel
          id="pulse" title="System Pulse" icon={Activity} color="#00ff88"
          open={openPanels.pulse} onToggle={() => togglePanel("pulse")}
        >
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Tools", value: STATS.tools, color: "#00ff88" },
              { label: "Services", value: STATS.services, color: "#00d4ff" },
              { label: "Total", value: STATS.total, color: "#ff3d9a" },
            ].map(s => (
              <div key={s.label} className="text-center py-2 rounded-lg bg-white/[0.02]">
                <div className="text-lg font-black font-mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[8px] text-text-muted uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2 px-1">
            <Radio size={10} className="text-neon" />
            <span className="text-[9px] text-text-muted">v{STATS.version}</span>
            <span className="text-[9px] text-neon ml-auto">ONLINE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
          </div>
        </Panel>

        {/* ─── TASKS ───────────────────────────── */}
        <Panel
          id="tasks" title="Tasks" icon={ListTodo} color="#00d4ff"
          count={todoCount + activeCount}
          open={openPanels.tasks} onToggle={() => togglePanel("tasks")}
        >
          {/* Quick add */}
          <div className="flex gap-1.5 mb-2">
            <input
              value={quickText}
              onChange={e => setQuickText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Add task..."
              className="flex-1 bg-white/[0.04] border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] text-text placeholder:text-text-muted focus:outline-none focus:border-neon/30 transition-all"
            />
            <button
              onClick={addTask}
              disabled={!quickText.trim()}
              className="w-7 h-7 rounded-lg bg-neon/80 flex items-center justify-center text-bg disabled:opacity-30 hover:bg-neon transition-all shrink-0"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-1 mb-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setQuickCategory(c.id)}
                className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-full transition-all",
                  quickCategory === c.id ? "border" : "opacity-30 hover:opacity-60"
                )}
                style={quickCategory === c.id ? { background: c.color + "15", color: c.color, borderColor: c.color + "40" } : {}}
              >
                {c.label}
              </button>
            ))}
            <div className="ml-auto flex gap-0.5">
              {PRIORITIES.map(p => (
                <button
                  key={p.level}
                  onClick={() => setQuickPriority(p.level)}
                  className={cn("w-4 h-4 rounded text-[7px] font-black flex items-center justify-center transition-all",
                    quickPriority === p.level ? "border" : "opacity-25 hover:opacity-50"
                  )}
                  style={quickPriority === p.level ? { background: p.color + "20", color: p.color, borderColor: p.color + "50" } : {}}
                >
                  {p.level}
                </button>
              ))}
            </div>
          </div>

          {/* Mini stats */}
          <div className="flex items-center gap-3 mb-2 text-[9px]">
            <span className="text-text-muted">{todoCount} todo</span>
            <span className="text-cyan">{activeCount} active</span>
            <span className="text-neon">{doneCount} done</span>
          </div>

          {/* Task list */}
          <div className="space-y-1 max-h-[240px] overflow-y-auto pr-1 -mr-1">
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-text-muted">
                <Inbox size={20} className="mx-auto mb-1 opacity-30" />
                <p className="text-[10px]">No tasks</p>
              </div>
            ) : tasks.filter(t => t.status !== "done").slice(0, 10).map(task => {
              const pri = PRIORITIES.find(p => p.level === task.priority)
              const StatusIcon = STATUS_ICONS[task.status]
              const isFocused = focusTaskId === task.id
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded-lg transition-all group relative",
                    isFocused ? "bg-cyan/10 border border-cyan/20" : "bg-white/[0.02] hover:bg-white/[0.04]"
                  )}
                >
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full" style={{ background: pri?.color }} />
                  <button onClick={() => cycleStatus(task.id)} className="mt-0.5 shrink-0 hover:scale-110 transition-transform pl-1">
                    <StatusIcon size={12} style={{ color: STATUS_COLORS[task.status] }} />
                  </button>
                  <span className="text-[11px] text-text-dim flex-1 leading-snug">{task.text}</span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => startFocus(task.id)} className={cn("p-0.5 rounded", isFocused ? "text-cyan" : "text-text-muted hover:text-text")}>
                      {isFocused ? <Pause size={9} /> : <Play size={9} />}
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="p-0.5 rounded text-text-muted hover:text-red">
                      <Trash2 size={9} />
                    </button>
                  </div>
                </div>
              )
            })}
            {doneCount > 0 && (
              <button
                onClick={() => setTasks(prev => prev.filter(t => t.status !== "done"))}
                className="w-full text-[9px] text-text-muted hover:text-neon py-1 transition-colors"
              >
                Clear {doneCount} completed
              </button>
            )}
          </div>
        </Panel>

        {/* ─── ACTIVITY ────────────────────────── */}
        <Panel
          id="activity" title="Activity" icon={Bell} color="#ff3d9a"
          count={unreadCount}
          open={openPanels.activity} onToggle={() => togglePanel("activity")}
        >
          {unreadCount > 0 && (
            <button
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-[9px] font-bold text-cyan hover:text-text transition-colors mb-2 block"
            >
              Mark all read
            </button>
          )}
          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 -mr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-text-muted">
                <Bell size={20} className="mx-auto mb-1 opacity-30" />
                <p className="text-[10px]">No activity</p>
              </div>
            ) : notifications.slice(0, 8).map(n => (
              <div
                key={n.id}
                onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all",
                  n.read ? "bg-transparent opacity-50" : "bg-white/[0.02]"
                )}
              >
                <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-text-dim truncate">{n.title}</span>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-pink shrink-0" />}
                  </div>
                  {n.message && <p className="text-[9px] text-text-muted mt-0.5 truncate">{n.message}</p>}
                  <span className="text-[8px] text-text-muted">{timeAgo(n.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ─── FOCUS TIMER ─────────────────────── */}
        <Panel
          id="focus" title="Focus" icon={Timer} color="#00d4ff"
          open={openPanels.focus} onToggle={() => togglePanel("focus")}
        >
          {focusTaskId ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan/5 border border-cyan/20">
              <div className="text-xl font-black font-mono text-cyan">{formatTime(focusTime)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-dim truncate">{tasks.find(t => t.id === focusTaskId)?.text}</p>
              </div>
              <button
                onClick={() => setFocusRunning(!focusRunning)}
                className="p-1.5 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
              >
                {focusRunning ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                onClick={() => startFocus(focusTaskId)}
                className="text-[9px] font-bold text-text-muted hover:text-red transition-colors"
              >
                Stop
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Timer size={20} className="mx-auto mb-1 text-text-muted opacity-30" />
              <p className="text-[10px] text-text-muted">Click play on a task to start focusing</p>
            </div>
          )}
        </Panel>

        {/* ─── QUICK ADD / BRAIN DUMP ──────────── */}
        <Panel
          id="quick" title="Brain Dump" icon={Brain} color="#9945ff"
          open={openPanels.quick} onToggle={() => togglePanel("quick")}
        >
          <textarea
            value={brainDump}
            onChange={e => setBrainDump(e.target.value)}
            placeholder={"- Fix checkout bug\n- Review PR #42\n- Email client"}
            className="w-full h-20 bg-white/[0.03] border border-border/50 rounded-lg p-2.5 text-[11px] text-text font-mono placeholder:text-text-muted/30 focus:outline-none focus:border-purple/30 resize-none transition-all leading-relaxed"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[8px] text-text-muted">
              {brainDump.split("\n").filter(l => l.trim()).length} items
            </span>
            <button
              onClick={parseBrainDump}
              disabled={!brainDump.trim()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple/80 text-white text-[9px] font-bold hover:bg-purple transition-all disabled:opacity-30"
            >
              <Sparkles size={9} /> Parse
            </button>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            {[
              { label: "From clipboard", icon: Clipboard, action: async () => {
                try { const t = await navigator.clipboard.readText(); if (t) addTaskFromEvent(t.slice(0, 200), "clipboard") }
                catch { addNotification("Clipboard", "Access denied", "warning") }
              }},
              { label: "Clear done", icon: Trash2, action: () => {
                const c = tasks.filter(t => t.status === "done").length
                setTasks(prev => prev.filter(t => t.status !== "done"))
                if (c) addNotification("Cleanup", `${c} cleared`, "success")
              }},
              { label: "Reset all", icon: RotateCcw, action: () => {
                setTasks(prev => prev.map(t => ({ ...t, status: "todo" as TaskStatus, completedAt: null })))
              }},
              { label: "Export JSON", icon: Send, action: () => {
                navigator.clipboard.writeText(JSON.stringify(tasks, null, 2))
                addNotification("Export", "Copied", "success")
              }},
            ].map(qa => (
              <button
                key={qa.label}
                onClick={qa.action}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
              >
                <qa.icon size={10} className="text-text-muted group-hover:text-neon transition-colors shrink-0" />
                <span className="text-[9px] font-bold text-text-muted group-hover:text-text transition-colors">{qa.label}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between">
        <span className="text-[8px] text-text-muted font-mono">0nMCP v{STATS.version}</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-neon" />
          <span className="text-[8px] text-neon font-bold">READY</span>
        </div>
      </div>
    </div>
  )
}

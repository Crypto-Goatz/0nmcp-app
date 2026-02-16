"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap, X, Plus, Check, Trash2, Bell, ListTodo, AlertTriangle,
  ChevronDown, ChevronRight, Clock, Circle, CircleDot, CheckCircle2,
  Brain, Send, GripVertical, Flag, Tag, Calendar, StickyNote,
  Sparkles, RotateCcw, Play, Pause, ChevronUp, Settings, Inbox,
  BarChart3, Layers, Timer, ArrowRight, Clipboard, Edit3,
  AlertCircle, Info, CheckCircle, XCircle, Filter, Search
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────
type TaskStatus = "todo" | "in-progress" | "done"
type TaskPriority = 1 | 2 | 3 | 4
type TaskCategory = "work" | "dev" | "personal" | "urgent" | "research"
type PanelTab = "tasks" | "notifications" | "quick"
type NotificationType = "info" | "success" | "warning" | "error"

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
  subtasks: Subtask[]
}

interface Subtask {
  id: string
  title: string
  done: boolean
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
const CATEGORIES: { id: TaskCategory; label: string; color: string; icon: typeof Tag }[] = [
  { id: "work", label: "Work", color: "#ff6b35", icon: Layers },
  { id: "dev", label: "Dev", color: "#00d4ff", icon: Zap },
  { id: "personal", label: "Personal", color: "#10b981", icon: StickyNote },
  { id: "urgent", label: "Urgent", color: "#f87171", icon: AlertTriangle },
  { id: "research", label: "Research", color: "#9945ff", icon: Brain },
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

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

// ─── COMPONENT ────────────────────────────────────────────
export default function CommandCenter() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<PanelTab>("tasks")
  const [tasks, setTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loaded, setLoaded] = useState(false)

  // Task input
  const [quickText, setQuickText] = useState("")
  const [quickCategory, setQuickCategory] = useState<TaskCategory>("work")
  const [quickPriority, setQuickPriority] = useState<TaskPriority>(2)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [quickNotes, setQuickNotes] = useState("")
  const [quickDue, setQuickDue] = useState("")

  // Brain dump
  const [brainDump, setBrainDump] = useState("")
  const [brainMode, setBrainMode] = useState(false)

  // Focus
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null)
  const [focusTime, setFocusTime] = useState(0)
  const [focusRunning, setFocusRunning] = useState(false)
  const focusInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Filter
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [editingId, setEditingId] = useState<string | null>(null)

  // ─── LOAD / SAVE ─────────────────────────────────
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_KEY_TASKS)
      const n = localStorage.getItem(STORAGE_KEY_NOTIFS)
      if (t) setTasks(JSON.parse(t))
      if (n) setNotifications(JSON.parse(n))
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

  // ─── GLOBAL EVENT LISTENERS ──────────────────────
  const addNotification = useCallback((title: string, message: string, type: NotificationType = "info", source?: string) => {
    setNotifications(prev => [{
      id: uid(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
      source,
    }, ...prev].slice(0, 100))
  }, [])

  const addTaskFromEvent = useCallback((text: string, source?: string) => {
    const task: Task = {
      id: uid(),
      text,
      category: "work",
      priority: 2,
      status: "todo",
      notes: source ? `Added from ${source}` : "",
      dueDate: null,
      createdAt: Date.now(),
      completedAt: null,
      focusTime: 0,
      subtasks: [],
    }
    setTasks(prev => [task, ...prev])
    addNotification("Task Added", text, "success", source)
  }, [addNotification])

  useEffect(() => {
    const handleAddTask = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.text) {
        addTaskFromEvent(detail.text, detail.source)
        // Briefly open the panel to show feedback
        setOpen(true)
        setTab("tasks")
      }
    }
    const handleNotify = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.title) {
        addNotification(detail.title, detail.message || "", detail.type || "info", detail.source)
      }
    }
    window.addEventListener("0n-add-task", handleAddTask)
    window.addEventListener("0n-notify", handleNotify)
    return () => {
      window.removeEventListener("0n-add-task", handleAddTask)
      window.removeEventListener("0n-notify", handleNotify)
    }
  }, [addTaskFromEvent, addNotification])

  // ─── WELCOME NOTIFICATION ───────────────────────
  useEffect(() => {
    if (!loaded) return
    if (notifications.length === 0) {
      addNotification(
        "Welcome to Command Center",
        "Your organizational backbone is ready. Add tasks, track issues, and stay focused.",
        "info",
        "system"
      )
    }
  }, [loaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── FOCUS TIMER ────────────────────────────────
  useEffect(() => {
    if (focusRunning && focusTaskId) {
      focusInterval.current = setInterval(() => {
        setFocusTime(prev => prev + 1)
      }, 1000)
    } else if (focusInterval.current) {
      clearInterval(focusInterval.current)
    }
    return () => { if (focusInterval.current) clearInterval(focusInterval.current) }
  }, [focusRunning, focusTaskId])

  // ─── TASK ACTIONS ───────────────────────────────
  const addTask = () => {
    if (!quickText.trim()) return
    const task: Task = {
      id: uid(),
      text: quickText.trim(),
      category: quickCategory,
      priority: quickPriority,
      status: "todo",
      notes: quickNotes,
      dueDate: quickDue || null,
      createdAt: Date.now(),
      completedAt: null,
      focusTime: 0,
      subtasks: [],
    }
    setTasks(prev => [task, ...prev])
    addNotification("Task Created", quickText.trim(), "success")
    setQuickText("")
    setQuickNotes("")
    setQuickDue("")
    setShowAdvanced(false)
  }

  const parseBrainDump = () => {
    if (!brainDump.trim()) return
    const lines = brainDump.split("\n").filter(l => l.trim())
    const newTasks: Task[] = lines.map(line => ({
      id: uid(),
      text: line.replace(/^[-*•]\s*/, "").trim(),
      category: "work" as TaskCategory,
      priority: 2 as TaskPriority,
      status: "todo" as TaskStatus,
      notes: "From brain dump",
      dueDate: null,
      createdAt: Date.now(),
      completedAt: null,
      focusTime: 0,
      subtasks: [],
    }))
    setTasks(prev => [...newTasks, ...prev])
    addNotification("Brain Dump", `${newTasks.length} tasks parsed`, "success")
    setBrainDump("")
    setBrainMode(false)
  }

  const cycleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx = STATUS_CYCLE.indexOf(t.status)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return {
        ...t,
        status: next,
        completedAt: next === "done" ? Date.now() : null,
      }
    }))
  }

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    setTasks(prev => prev.filter(t => t.id !== id))
    if (task) addNotification("Task Deleted", task.text, "warning")
    if (focusTaskId === id) {
      setFocusTaskId(null)
      setFocusRunning(false)
      setFocusTime(0)
    }
  }

  const startFocus = (id: string) => {
    if (focusTaskId === id) {
      // Save accumulated time
      setTasks(prev => prev.map(t => t.id === id ? { ...t, focusTime: t.focusTime + focusTime } : t))
      setFocusTaskId(null)
      setFocusRunning(false)
      setFocusTime(0)
    } else {
      // Save prev task time
      if (focusTaskId) {
        setTasks(prev => prev.map(t => t.id === focusTaskId ? { ...t, focusTime: t.focusTime + focusTime } : t))
      }
      setFocusTaskId(id)
      setFocusRunning(true)
      setFocusTime(0)
      const task = tasks.find(t => t.id === id)
      if (task) addNotification("Focus Started", task.text, "info")
    }
  }

  const toggleSubtask = (taskId: string, subId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      return { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s) }
    }))
  }

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      return { ...t, subtasks: [...t.subtasks, { id: uid(), title: title.trim(), done: false }] }
    }))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // ─── COMPUTED ───────────────────────────────────
  const filteredTasks = statusFilter === "all" ? tasks : tasks.filter(t => t.status === statusFilter)
  const todoCount = tasks.filter(t => t.status === "todo").length
  const inProgressCount = tasks.filter(t => t.status === "in-progress").length
  const doneCount = tasks.filter(t => t.status === "done").length
  const unreadCount = notifications.filter(n => !n.read).length
  const badgeCount = todoCount + inProgressCount + unreadCount

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const notifIcon = (type: NotificationType) => {
    switch (type) {
      case "success": return <CheckCircle size={12} className="text-neon" />
      case "warning": return <AlertCircle size={12} className="text-amber" />
      case "error": return <XCircle size={12} className="text-red" />
      default: return <Info size={12} className="text-cyan" />
    }
  }

  return (
    <>
      {/* ─── FLOATING ACTION BUTTON ────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg group",
          open
            ? "bg-surface border border-border rotate-45"
            : "bg-gradient-to-br from-neon to-cyan hover:shadow-neon/30 hover:scale-105"
        )}
      >
        {open ? (
          <X size={20} className="text-text-dim -rotate-45" />
        ) : (
          <Zap size={20} className="text-bg" />
        )}

        {/* Badge */}
        {!open && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink text-[9px] font-black text-white flex items-center justify-center animate-count-up">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </button>

      {/* ─── FOCUS BAR (when focusing) ─────────────── */}
      <AnimatePresence>
        {focusTaskId && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-6 left-6 right-24 z-[55] glass rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <Timer size={14} className="text-cyan shrink-0" />
            <span className="text-xs font-bold text-cyan font-mono">{formatTime(focusTime)}</span>
            <span className="text-xs text-text-dim truncate flex-1">
              {tasks.find(t => t.id === focusTaskId)?.text}
            </span>
            <button
              onClick={() => setFocusRunning(!focusRunning)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"
            >
              {focusRunning ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <button
              onClick={() => startFocus(focusTaskId)}
              className="text-[10px] font-bold text-cyan hover:text-text transition-colors"
            >
              Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SLIDE-OUT PANEL ───────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[58] bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[59] w-full max-w-md glass border-l border-border flex flex-col"
            >
              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon to-cyan flex items-center justify-center">
                      <Zap size={14} className="text-bg" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black tracking-tight">Command Center</h2>
                      <p className="text-[9px] text-text-muted">{tasks.length} tasks &middot; {unreadCount} unread</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted">
                    <X size={16} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1">
                  {([
                    { id: "tasks" as PanelTab, label: "Tasks", icon: ListTodo, count: todoCount + inProgressCount },
                    { id: "notifications" as PanelTab, label: "Alerts", icon: Bell, count: unreadCount },
                    { id: "quick" as PanelTab, label: "Quick Add", icon: Sparkles, count: 0 },
                  ]).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[10px] font-bold transition-all relative",
                        tab === t.id
                          ? "bg-neon/10 text-neon"
                          : "text-text-muted hover:text-text hover:bg-white/[0.03]"
                      )}
                    >
                      <t.icon size={12} />
                      {t.label}
                      {t.count > 0 && (
                        <span className="w-4 h-4 rounded-full bg-pink/80 text-[8px] font-black text-white flex items-center justify-center">
                          {t.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── TASKS TAB ─────────────────────── */}
              {tab === "tasks" && (
                <div className="flex-1 flex flex-col min-h-0 px-5 pb-5">
                  {/* Quick add */}
                  <div className="mb-3">
                    <div className="flex gap-1.5">
                      <input
                        value={quickText}
                        onChange={e => setQuickText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addTask()}
                        placeholder="Add a task..."
                        className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-neon/30 transition-all"
                      />
                      <button
                        onClick={addTask}
                        disabled={!quickText.trim()}
                        className="w-9 h-9 rounded-xl bg-neon flex items-center justify-center text-bg disabled:opacity-30 hover:bg-neon/90 transition-all shrink-0"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Category + Priority selectors */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setQuickCategory(c.id)}
                          className={cn(
                            "text-[8px] font-bold px-1.5 py-0.5 rounded-full transition-all",
                            quickCategory === c.id ? "border" : "opacity-40 hover:opacity-70"
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
                            className={cn(
                              "w-5 h-5 rounded text-[8px] font-black flex items-center justify-center transition-all",
                              quickPriority === p.level ? "border" : "opacity-30 hover:opacity-60"
                            )}
                            style={quickPriority === p.level ? { background: p.color + "20", color: p.color, borderColor: p.color + "50" } : {}}
                            title={p.label}
                          >
                            {p.level}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-text-muted hover:text-text transition-colors ml-1"
                      >
                        <ChevronDown size={10} className={cn("transition-transform", showAdvanced && "rotate-180")} />
                      </button>
                    </div>

                    {/* Advanced fields */}
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-1.5 flex gap-1.5">
                            <input
                              value={quickNotes}
                              onChange={e => setQuickNotes(e.target.value)}
                              placeholder="Notes..."
                              className="flex-1 bg-surface border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-text placeholder:text-text-muted focus:outline-none focus:border-neon/30 transition-all"
                            />
                            <input
                              type="date"
                              value={quickDue}
                              onChange={e => setQuickDue(e.target.value)}
                              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-text focus:outline-none focus:border-neon/30 transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Stats bar */}
                  <div className="flex items-center gap-3 mb-3">
                    {([
                      { label: "All", value: "all" as const, count: tasks.length },
                      { label: "Todo", value: "todo" as const, count: todoCount },
                      { label: "Active", value: "in-progress" as const, count: inProgressCount },
                      { label: "Done", value: "done" as const, count: doneCount },
                    ]).map(s => (
                      <button
                        key={s.value}
                        onClick={() => setStatusFilter(s.value)}
                        className={cn(
                          "text-[9px] font-bold px-2 py-1 rounded-lg transition-all",
                          statusFilter === s.value
                            ? "bg-neon/10 text-neon"
                            : "text-text-muted hover:text-text"
                        )}
                      >
                        {s.label} ({s.count})
                      </button>
                    ))}
                  </div>

                  {/* Task list */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12 text-text-muted">
                        <Inbox size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No tasks yet</p>
                      </div>
                    ) : (
                      filteredTasks.map(task => {
                        const cat = CATEGORIES.find(c => c.id === task.category)
                        const pri = PRIORITIES.find(p => p.level === task.priority)
                        const StatusIcon = STATUS_ICONS[task.status]
                        const isFocused = focusTaskId === task.id
                        const subDone = task.subtasks.filter(s => s.done).length
                        const subTotal = task.subtasks.length
                        return (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                              "rounded-xl p-3 transition-all group relative",
                              isFocused ? "bg-cyan/10 border border-cyan/30" : "bg-surface/50 hover:bg-surface/80",
                              task.status === "done" && "opacity-50"
                            )}
                          >
                            {/* Priority stripe */}
                            <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: pri?.color }} />

                            <div className="flex items-start gap-2 pl-2">
                              {/* Status toggle */}
                              <button onClick={() => cycleStatus(task.id)} className="mt-0.5 shrink-0 hover:scale-110 transition-transform">
                                <StatusIcon size={14} style={{ color: STATUS_COLORS[task.status] }} />
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn("text-xs font-bold", task.status === "done" && "line-through text-text-muted")}>
                                    {task.text}
                                  </span>
                                </div>

                                {/* Meta */}
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: (cat?.color || "#666") + "15", color: cat?.color }}>
                                    {cat?.label}
                                  </span>
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: (pri?.color || "#666") + "15", color: pri?.color }}>
                                    P{task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span className="text-[8px] text-text-muted flex items-center gap-0.5">
                                      <Calendar size={8} /> {task.dueDate}
                                    </span>
                                  )}
                                  {task.focusTime > 0 && (
                                    <span className="text-[8px] text-cyan flex items-center gap-0.5">
                                      <Timer size={8} /> {formatTime(task.focusTime)}
                                    </span>
                                  )}
                                  {subTotal > 0 && (
                                    <span className="text-[8px] text-text-muted">
                                      {subDone}/{subTotal} subtasks
                                    </span>
                                  )}
                                </div>

                                {/* Notes */}
                                {task.notes && (
                                  <p className="text-[9px] text-text-muted mt-1 leading-relaxed">{task.notes}</p>
                                )}

                                {/* Subtasks */}
                                {editingId === task.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="mt-2 space-y-1 overflow-hidden"
                                  >
                                    {task.subtasks.map(sub => (
                                      <button
                                        key={sub.id}
                                        onClick={() => toggleSubtask(task.id, sub.id)}
                                        className="flex items-center gap-1.5 text-[10px] text-text-dim w-full text-left hover:text-text transition-colors"
                                      >
                                        {sub.done ? <CheckCircle2 size={10} className="text-neon" /> : <Circle size={10} className="text-text-muted" />}
                                        <span className={cn(sub.done && "line-through text-text-muted")}>{sub.title}</span>
                                      </button>
                                    ))}
                                    <input
                                      placeholder="Add subtask..."
                                      onKeyDown={e => {
                                        if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                                          addSubtask(task.id, (e.target as HTMLInputElement).value)
                                          ;(e.target as HTMLInputElement).value = ""
                                        }
                                      }}
                                      className="w-full bg-transparent text-[10px] text-text-dim placeholder:text-text-muted/50 focus:outline-none border-b border-border/30 pb-1"
                                    />
                                  </motion.div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={() => setEditingId(editingId === task.id ? null : task.id)}
                                  className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text transition-colors"
                                  title="Subtasks"
                                >
                                  <Layers size={10} />
                                </button>
                                <button
                                  onClick={() => startFocus(task.id)}
                                  className={cn("p-1 rounded hover:bg-white/5 transition-colors", isFocused ? "text-cyan" : "text-text-muted hover:text-text")}
                                  title={isFocused ? "Stop focus" : "Focus"}
                                >
                                  {isFocused ? <Pause size={10} /> : <Play size={10} />}
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ─── NOTIFICATIONS TAB ─────────────── */}
              {tab === "notifications" && (
                <div className="flex-1 flex flex-col min-h-0 px-5 pb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-text-muted">{notifications.length} total &middot; {unreadCount} unread</span>
                    <div className="flex gap-2">
                      <button onClick={markAllRead} className="text-[9px] font-bold text-cyan hover:text-text transition-colors">
                        Mark all read
                      </button>
                      <button onClick={clearNotifications} className="text-[9px] font-bold text-text-muted hover:text-red-400 transition-colors">
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 -mr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-12 text-text-muted">
                        <Bell size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No notifications</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          className={cn(
                            "flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all",
                            n.read ? "bg-surface/30" : "bg-surface/60 border border-border/50"
                          )}
                        >
                          <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("text-[10px] font-bold", !n.read && "text-text")}>{n.title}</span>
                              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-cyan" />}
                            </div>
                            {n.message && <p className="text-[9px] text-text-muted mt-0.5 leading-relaxed">{n.message}</p>}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] text-text-muted">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              {n.source && (
                                <span className="text-[8px] text-text-muted/60">{n.source}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ─── QUICK ADD TAB ─────────────────── */}
              {tab === "quick" && (
                <div className="flex-1 flex flex-col min-h-0 px-5 pb-5">
                  {/* Brain dump mode */}
                  <div className="glass-card rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain size={14} className="text-purple" />
                      <h3 className="text-xs font-bold">Brain Dump</h3>
                    </div>
                    <p className="text-[10px] text-text-muted mb-2">
                      Dump everything on your mind. Each line becomes a task.
                    </p>
                    <textarea
                      value={brainDump}
                      onChange={e => setBrainDump(e.target.value)}
                      placeholder={"- Fix the checkout bug\n- Review PR #42\n- Email client about launch date\n- Set up analytics dashboard\n- Order new domain certificates"}
                      className="w-full h-32 bg-surface border border-border rounded-xl p-3 text-xs text-text font-mono placeholder:text-text-muted/40 focus:outline-none focus:border-purple/40 resize-none transition-all leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-text-muted">
                        {brainDump.split("\n").filter(l => l.trim()).length} lines
                      </span>
                      <button
                        onClick={parseBrainDump}
                        disabled={!brainDump.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple text-white text-[10px] font-bold hover:bg-purple/90 transition-all disabled:opacity-30"
                      >
                        <Sparkles size={10} /> Parse into Tasks
                      </button>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="glass-card rounded-xl p-4 mb-4">
                    <h3 className="text-xs font-bold mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Add from clipboard", icon: Clipboard, action: async () => {
                          try {
                            const text = await navigator.clipboard.readText()
                            if (text) addTaskFromEvent(text.slice(0, 200), "clipboard")
                          } catch { addNotification("Clipboard", "Access denied", "warning") }
                        }},
                        { label: "Clear completed", icon: Trash2, action: () => {
                          const count = tasks.filter(t => t.status === "done").length
                          setTasks(prev => prev.filter(t => t.status !== "done"))
                          addNotification("Cleanup", `${count} completed tasks cleared`, "success")
                        }},
                        { label: "Reset all to todo", icon: RotateCcw, action: () => {
                          setTasks(prev => prev.map(t => ({ ...t, status: "todo" as TaskStatus, completedAt: null })))
                          addNotification("Reset", "All tasks reset to todo", "info")
                        }},
                        { label: "Export tasks JSON", icon: Send, action: () => {
                          navigator.clipboard.writeText(JSON.stringify(tasks, null, 2))
                          addNotification("Export", "Tasks copied to clipboard", "success")
                        }},
                      ].map(qa => (
                        <button
                          key={qa.label}
                          onClick={qa.action}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/50 hover:bg-surface text-left transition-all group"
                        >
                          <qa.icon size={12} className="text-text-muted group-hover:text-neon transition-colors" />
                          <span className="text-[10px] font-bold text-text-dim group-hover:text-text transition-colors">{qa.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="text-xs font-bold mb-3">Overview</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Total", value: tasks.length, color: "#eef0ff" },
                        { label: "Todo", value: todoCount, color: "#484e78" },
                        { label: "Active", value: inProgressCount, color: "#00d4ff" },
                        { label: "Done", value: doneCount, color: "#00ff88" },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                          <div className="text-[8px] text-text-muted uppercase tracking-wider">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {tasks.length > 0 && (
                      <div className="mt-3 h-1.5 rounded-full bg-surface overflow-hidden flex">
                        {todoCount > 0 && <div className="h-full" style={{ width: `${(todoCount / tasks.length) * 100}%`, background: "#484e78" }} />}
                        {inProgressCount > 0 && <div className="h-full" style={{ width: `${(inProgressCount / tasks.length) * 100}%`, background: "#00d4ff" }} />}
                        {doneCount > 0 && <div className="h-full" style={{ width: `${(doneCount / tasks.length) * 100}%`, background: "#00ff88" }} />}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

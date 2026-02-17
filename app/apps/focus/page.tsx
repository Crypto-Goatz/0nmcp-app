"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ListTodo, ArrowLeft, Plus, Check, Trash2, Play, Pause,
  RotateCcw, Sparkles, ChevronDown, GripVertical, Timer,
  StickyNote, Loader2, X, Clock, Zap
} from "lucide-react"

import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  duration?: number
}

interface Phase {
  id: string
  title: string
  description: string
  durationMinutes: number
  tasks: Task[]
}

interface Note {
  id: string
  text: string
  color: string
  timestamp: number
}

const PRIORITY_COLORS = {
  low: { bg: "bg-neon/8", text: "text-neon", label: "Low" },
  medium: { bg: "bg-amber/8", text: "text-amber", label: "Med" },
  high: { bg: "bg-red/8", text: "text-red", label: "High" },
}

const NOTE_COLORS = ["#1e293b", "#312e81", "#881337", "#064e3b", "#78350f"]

const SAMPLE_PHASES: Phase[] = [
  {
    id: "1",
    title: "Setup & Configuration",
    description: "Initialize the project and configure core dependencies",
    durationMinutes: 30,
    tasks: [
      { id: "1a", text: "Initialize project with npm", completed: false, priority: "high", duration: 5 },
      { id: "1b", text: "Install core dependencies", completed: false, priority: "high", duration: 10 },
      { id: "1c", text: "Configure TypeScript and ESLint", completed: false, priority: "medium", duration: 10 },
      { id: "1d", text: "Set up environment variables", completed: false, priority: "low", duration: 5 },
    ],
  },
  {
    id: "2",
    title: "Core Implementation",
    description: "Build the main features and business logic",
    durationMinutes: 60,
    tasks: [
      { id: "2a", text: "Create database schema", completed: false, priority: "high", duration: 15 },
      { id: "2b", text: "Build API routes", completed: false, priority: "high", duration: 20 },
      { id: "2c", text: "Implement authentication", completed: false, priority: "medium", duration: 15 },
      { id: "2d", text: "Add error handling", completed: false, priority: "medium", duration: 10 },
    ],
  },
]

export default function FocusPage() {
  const [phases, setPhases] = useState<Phase[]>(SAMPLE_PHASES)
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState<Note[]>([])
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0])
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatorInput, setGeneratorInput] = useState("")
  const [generating, setGenerating] = useState(false)
  const [view, setView] = useState<"focus" | "notes">("focus")
  const [newTaskText, setNewTaskText] = useState("")

  const currentPhase = phases[currentPhaseIdx]
  const totalTasks = phases.reduce((s, p) => s + p.tasks.length, 0)
  const completedTasks = completedIds.size
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const activeTask = useMemo(() => {
    if (!currentPhase) return null
    return currentPhase.tasks.find(t => !completedIds.has(t.id))
  }, [currentPhase, completedIds])

  const phaseComplete = useMemo(() => {
    if (!currentPhase) return false
    return currentPhase.tasks.every(t => completedIds.has(t.id))
  }, [currentPhase, completedIds])

  const toggleTask = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addTask = () => {
    if (!newTaskText.trim() || !currentPhase) return
    setPhases(prev => prev.map(p =>
      p.id === currentPhase.id
        ? { ...p, tasks: [...p.tasks, { id: crypto.randomUUID(), text: newTaskText.trim(), completed: false, priority: "medium" }] }
        : p
    ))
    setNewTaskText("")
  }

  const deleteTask = (phaseId: string, taskId: string) => {
    setPhases(prev => prev.map(p =>
      p.id === phaseId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p
    ))
    setCompletedIds(prev => { const next = new Set(prev); next.delete(taskId); return next })
  }

  const addNote = () => {
    if (!noteText.trim()) return
    setNotes(prev => [{ id: crypto.randomUUID(), text: noteText.trim(), color: noteColor, timestamp: Date.now() }, ...prev])
    setNoteText("")
    setShowNoteInput(false)
  }

  const generatePlan = async () => {
    if (!generatorInput.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    const words = generatorInput.split(" ")
    const newPhases: Phase[] = [
      {
        id: crypto.randomUUID(),
        title: "Planning & Research",
        description: `Research and plan: ${generatorInput}`,
        durationMinutes: 20,
        tasks: [
          { id: crypto.randomUUID(), text: `Define requirements for ${words.slice(0, 3).join(" ")}`, completed: false, priority: "high", duration: 10 },
          { id: crypto.randomUUID(), text: "Research existing solutions", completed: false, priority: "medium", duration: 10 },
        ],
      },
      {
        id: crypto.randomUUID(),
        title: "Implementation",
        description: `Build the core of: ${generatorInput}`,
        durationMinutes: 45,
        tasks: [
          { id: crypto.randomUUID(), text: "Set up project structure", completed: false, priority: "high", duration: 10 },
          { id: crypto.randomUUID(), text: "Implement core logic", completed: false, priority: "high", duration: 20 },
          { id: crypto.randomUUID(), text: "Add error handling", completed: false, priority: "medium", duration: 15 },
        ],
      },
      {
        id: crypto.randomUUID(),
        title: "Testing & Polish",
        description: "Test, fix, and finalize",
        durationMinutes: 30,
        tasks: [
          { id: crypto.randomUUID(), text: "Write tests", completed: false, priority: "high", duration: 15 },
          { id: crypto.randomUUID(), text: "Fix edge cases", completed: false, priority: "medium", duration: 10 },
          { id: crypto.randomUUID(), text: "Documentation", completed: false, priority: "low", duration: 5 },
        ],
      },
    ]
    setPhases(newPhases)
    setCurrentPhaseIdx(0)
    setCompletedIds(new Set())
    setGenerating(false)
    setShowGenerator(false)
    setGeneratorInput("")
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  return (
    <div className="min-h-screen">
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-0.5 bg-border z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-neon to-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green/15">
              <ListTodo size={28} className="text-green" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Focus Flow</h1>
              <p className="text-sm text-text-dim">
                {progress}% complete — {completedTasks}/{totalTasks} tasks
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("focus")} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", view === "focus" ? "bg-green/15 text-green" : "glass-card text-text-dim")}>
              <ListTodo size={12} className="inline mr-1" /> Focus
            </button>
            <button onClick={() => setView("notes")} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", view === "notes" ? "bg-green/15 text-green" : "glass-card text-text-dim")}>
              <StickyNote size={12} className="inline mr-1" /> Notes
            </button>
            <button onClick={() => setShowGenerator(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon to-cyan text-bg text-xs font-bold hover:shadow-lg transition-all">
              <Sparkles size={12} /> New Flow
            </button>
          </div>
        </div>

        {view === "focus" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main focus area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Phase header */}
              {currentPhase && (
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green/15 text-green">
                        Phase {currentPhaseIdx + 1}/{phases.length}
                      </span>
                      <Clock size={12} className="text-text-muted" />
                      <span className="text-xs text-text-muted">{currentPhase.durationMinutes}m</span>
                    </div>
                    {phaseComplete && currentPhaseIdx < phases.length - 1 && (
                      <button
                        onClick={() => setCurrentPhaseIdx(prev => prev + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon/15 text-neon text-xs font-bold hover:bg-neon/25 transition-all"
                      >
                        Next Phase <ChevronDown size={10} className="-rotate-90" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-xl font-black mb-1">{currentPhase.title}</h2>
                  <p className="text-xs text-text-dim">{currentPhase.description}</p>
                </div>
              )}

              {/* Task list */}
              {currentPhase && (
                <div className="space-y-1.5">
                  {currentPhase.tasks.map((task, i) => {
                    const done = completedIds.has(task.id)
                    const isActive = activeTask?.id === task.id
                    const style = PRIORITY_COLORS[task.priority]

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          "glass-card rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-500 group",
                          isActive && "ring-1 ring-green/30 scale-[1.01] border-l-2 border-green",
                          done && "opacity-50"
                        )}
                      >
                        <button onClick={() => toggleTask(task.id)} className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                          done ? "bg-neon border-neon" : "border-border hover:border-green"
                        )}>
                          {done && <Check size={10} className="text-bg" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <span className={cn("text-sm", done && "line-through text-text-muted", isActive && "font-bold")}>
                            {task.text}
                          </span>
                        </div>

                        {task.duration && (
                          <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                            <Clock size={8} /> {task.duration}m
                          </span>
                        )}

                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", style.bg, style.text)}>
                          {style.label}
                        </span>

                        <button
                          onClick={() => deleteTask(currentPhase.id, task.id)}
                          className="text-text-muted hover:text-red opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    )
                  })}

                  {/* Add task */}
                  <div className="flex gap-2 mt-2">
                    <input
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTask()}
                      placeholder="Add a task..."
                      className="flex-1 bg-surface border border-dashed border-border rounded-xl px-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-green/40 transition-all"
                    />
                    <button onClick={addTask} disabled={!newTaskText.trim()} className="px-3 py-2 rounded-xl glass-card text-text-dim disabled:opacity-30 hover:bg-white/[0.06] transition-all">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* All done */}
              {phases.length > 0 && currentPhaseIdx >= phases.length && (
                <div className="glass-card rounded-xl p-12 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h2 className="text-2xl font-black mb-2 gradient-text">All Phases Complete!</h2>
                  <p className="text-sm text-text-dim">You crushed it. {completedTasks} tasks across {phases.length} phases.</p>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Timer */}
              <div className="glass-card rounded-xl p-5 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Focus Timer</p>
                <div className="text-4xl font-black font-mono mb-4 tabular-nums">{formatTime(timerSeconds)}</div>
                <div className="flex justify-center gap-2 mb-3">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="w-10 h-10 rounded-full bg-green/15 text-green flex items-center justify-center hover:bg-green/25 transition-all"
                  >
                    {timerActive ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => { setTimerActive(false); setTimerSeconds(25 * 60) }}
                    className="w-10 h-10 rounded-full glass-card text-text-dim flex items-center justify-center hover:bg-white/[0.06] transition-all"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
                <div className="flex justify-center gap-1">
                  {[5, 15, 25, 45].map(m => (
                    <button
                      key={m}
                      onClick={() => { setTimerSeconds(m * 60); setTimerActive(false) }}
                      className="text-[10px] px-2 py-0.5 rounded glass-card text-text-dim hover:text-text transition-all"
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase navigator */}
              <div className="glass-card rounded-xl p-5">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">Phases</p>
                <div className="space-y-1.5">
                  {phases.map((phase, i) => {
                    const phaseDone = phase.tasks.every(t => completedIds.has(t.id))
                    const phaseTasks = phase.tasks.length
                    const phaseCompleted = phase.tasks.filter(t => completedIds.has(t.id)).length
                    return (
                      <button
                        key={phase.id}
                        onClick={() => setCurrentPhaseIdx(i)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-xs",
                          i === currentPhaseIdx ? "bg-green/10 text-green font-bold" : "text-text-dim hover:bg-white/[0.04]"
                        )}
                      >
                        {phaseDone ? <Check size={12} className="text-neon" /> : <span className="w-3 text-center text-[10px]">{i + 1}</span>}
                        <span className="flex-1 truncate">{phase.title}</span>
                        <span className="text-[10px] text-text-muted">{phaseCompleted}/{phaseTasks}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quick note */}
              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-card text-text-dim text-xs font-bold hover:bg-white/[0.06] transition-all"
              >
                <StickyNote size={12} /> Quick Note
              </button>
            </div>
          </div>
        )}

        {/* Notes view */}
        {view === "notes" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-text-muted">{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
              <button onClick={() => setShowNoteInput(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass-card text-text-dim text-xs font-bold hover:bg-white/[0.06] transition-all">
                <Plus size={12} /> Add Note
              </button>
            </div>
            {notes.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center text-text-dim">
                <StickyNote size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notes yet. Click "Quick Note" to add one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {notes.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl p-4 group relative"
                    style={{ background: note.color }}
                  >
                    <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    <p className="text-[10px] text-text-muted mt-2">{new Date(note.timestamp).toLocaleString()}</p>
                    <button
                      onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                      className="absolute top-2 right-2 text-text-muted hover:text-red opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Note input modal */}
        <AnimatePresence>
          {showNoteInput && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text">Quick Note</h3>
                  <button onClick={() => setShowNoteInput(false)} className="text-text-muted hover:text-text"><X size={16} /></button>
                </div>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write your note..."
                  rows={4}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-green/40 transition-all resize-none mb-3"
                  autoFocus
                />
                <div className="flex gap-2 mb-4">
                  {NOTE_COLORS.map(c => (
                    <button key={c} onClick={() => setNoteColor(c)} className={cn("w-6 h-6 rounded-full transition-all", noteColor === c && "ring-2 ring-white ring-offset-2 ring-offset-bg")} style={{ background: c }} />
                  ))}
                </div>
                <button onClick={addNote} disabled={!noteText.trim()} className="w-full px-4 py-2.5 rounded-xl bg-green/15 text-green text-sm font-bold disabled:opacity-30 hover:bg-green/25 transition-all">
                  Save Note
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan generator modal */}
        <AnimatePresence>
          {showGenerator && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-neon" />
                    <h3 className="font-bold text-text">AI Plan Generator</h3>
                  </div>
                  <button onClick={() => setShowGenerator(false)} className="text-text-muted hover:text-text"><X size={16} /></button>
                </div>
                <p className="text-xs text-text-dim mb-3">Describe your project and AI will break it into phases and tasks.</p>
                <textarea
                  value={generatorInput}
                  onChange={e => setGeneratorInput(e.target.value)}
                  placeholder="Build a real-time chat app with authentication..."
                  rows={4}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-neon/40 transition-all resize-none mb-3"
                  autoFocus
                />
                <button
                  onClick={generatePlan}
                  disabled={!generatorInput.trim() || generating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg text-sm font-bold disabled:opacity-30 hover:shadow-lg transition-all"
                >
                  {generating ? <><Loader2 size={14} className="animate-spin" /> Generating Plan...</> : <><Zap size={14} /> Generate Plan</>}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

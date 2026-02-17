"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, BookOpen, Plus, Trash2, ChevronDown, ChevronUp,
  Sparkles, Loader2, Copy, Check, Download, Eye, Edit3,
  GraduationCap, PlayCircle, FileText, HelpCircle, Clock,
  Star, Zap, ChevronRight, RotateCcw, MessageSquare
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────
interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Lesson {
  id: string
  title: string
  duration: string
  content: string
  type: "video" | "text" | "interactive" | "quiz"
  generated: boolean
}

interface CourseModule {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  quiz: QuizQuestion[]
  expanded: boolean
}

interface Course {
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  estimatedHours: number
  modules: CourseModule[]
  tags: string[]
}

// ─── PRESET TEMPLATES ─────────────────────────────────────
const TEMPLATES = [
  { label: "SaaS Growth", topic: "Building and scaling a SaaS business from $0 to $10K MRR", level: "intermediate" as const },
  { label: "AI Automation", topic: "AI-powered business automation with MCP and natural language orchestration", level: "beginner" as const },
  { label: "SEO Mastery", topic: "Complete SEO strategy from technical audit to ranking #1 on Google", level: "intermediate" as const },
  { label: "API Development", topic: "Building production-ready REST and GraphQL APIs with Node.js", level: "advanced" as const },
  { label: "Email Marketing", topic: "Email marketing mastery: sequences, segmentation, and conversion optimization", level: "beginner" as const },
  { label: "No-Code Apps", topic: "Building full-stack applications without writing code", level: "beginner" as const },
]

type Tab = "generate" | "editor" | "preview"

let idCounter = 0
function genId() { return `id-${Date.now()}-${idCounter++}` }

// ─── AI COURSE GENERATION (simulated) ─────────────────────
function generateCourseOutline(topic: string, level: string): Course {
  const topicWords = topic.split(" ").slice(0, 4).join(" ")
  const moduleCount = level === "beginner" ? 5 : level === "intermediate" ? 7 : 9

  const moduleTemplates = [
    { title: "Foundations & Core Concepts", desc: "Understand the fundamentals before diving deep" },
    { title: "Setting Up Your Environment", desc: "Tools, platforms, and initial configuration" },
    { title: "Building Your First Project", desc: "Hands-on walkthrough from zero to working prototype" },
    { title: "Strategy & Planning", desc: "Framework for making informed decisions" },
    { title: "Advanced Techniques", desc: "Level up with power-user methods" },
    { title: "Optimization & Performance", desc: "Squeeze maximum results from your work" },
    { title: "Scaling & Growth", desc: "Take what works and multiply it" },
    { title: "Analytics & Measurement", desc: "Track, measure, and improve with data" },
    { title: "Real-World Case Studies", desc: "Learn from actual success stories" },
  ]

  const modules: CourseModule[] = moduleTemplates.slice(0, moduleCount).map((tmpl, i) => {
    const lessonCount = 3 + Math.floor(Math.random() * 3)
    const lessons: Lesson[] = Array.from({ length: lessonCount }, (_, j) => ({
      id: genId(),
      title: `${tmpl.title} — Part ${j + 1}`,
      duration: `${5 + Math.floor(Math.random() * 20)} min`,
      content: "",
      type: (["text", "video", "interactive", "quiz"] as const)[Math.floor(Math.random() * 3)],
      generated: false,
    }))

    // Give first lesson of each module actual names
    const lessonNames = [
      [`What is ${topicWords}?`, "Why This Matters Now", "Key Terms & Definitions"],
      ["Choosing Your Tools", "Account Setup", "Configuration Walkthrough"],
      ["Project Blueprint", "Step-by-Step Build", "Testing & Validation"],
      ["Goal Setting Framework", "Market Research Methods", "Competitive Analysis"],
      ["Power Moves", "Automation Shortcuts", "Integration Patterns"],
      ["Performance Audit", "A/B Testing", "Conversion Optimization"],
      ["Growth Levers", "Scaling Playbook", "Team Building"],
      ["KPI Dashboard", "Tracking Setup", "Data-Driven Decisions"],
      ["Case Study: Startup to Scale", "Case Study: Enterprise Pivot", "Lessons Learned"],
    ]

    lessons.forEach((l, j) => {
      if (lessonNames[i] && lessonNames[i][j]) {
        l.title = lessonNames[i][j]
      }
    })

    const quiz: QuizQuestion[] = [
      {
        question: `What is the primary benefit of ${tmpl.title.toLowerCase()}?`,
        options: [
          "Faster development cycles",
          "Reduced operational costs",
          "Better user experience",
          "All of the above",
        ],
        correctIndex: 3,
        explanation: `Understanding ${tmpl.title.toLowerCase()} helps achieve all three benefits through systematic approaches.`,
      },
    ]

    return {
      id: genId(),
      title: `Module ${i + 1}: ${tmpl.title}`,
      description: tmpl.desc,
      lessons,
      quiz,
      expanded: i === 0,
    }
  })

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)

  return {
    title: `Complete Guide to ${topic.length > 60 ? topic.slice(0, 60) + "..." : topic}`,
    description: `A comprehensive ${level}-level course covering everything you need to know about ${topic.toLowerCase()}. Includes hands-on projects, quizzes, and real-world case studies.`,
    level: level as Course["level"],
    estimatedHours: Math.round(totalLessons * 0.3),
    modules,
    tags: topic.toLowerCase().split(" ").filter(w => w.length > 3).slice(0, 6),
  }
}

function generateLessonContent(lesson: Lesson, moduleTitle: string): string {
  return `# ${lesson.title}

## Overview
In this ${lesson.type === "video" ? "video lesson" : "lesson"}, we'll explore the key concepts behind **${lesson.title.toLowerCase()}** as part of the ${moduleTitle.replace(/Module \d+: /, "")} module.

## Key Concepts

### 1. Understanding the Fundamentals
Before diving into practical application, it's critical to understand *why* this matters. The core principle here is that effective execution depends on solid foundational knowledge.

> "The best way to learn is by doing — but you need to know what you're doing first."

### 2. Step-by-Step Process
Here's the proven framework:

1. **Assess** your current situation — where are you now?
2. **Plan** your approach — what's the fastest path to results?
3. **Execute** methodically — follow the system, not your gut
4. **Measure** everything — data tells you what's working
5. **Iterate** rapidly — double down on winners, cut losers

### 3. Common Mistakes to Avoid
- Trying to do everything at once (focus on ONE thing)
- Skipping the research phase (10 minutes of research saves 10 hours of mistakes)
- Not tracking results (you can't improve what you don't measure)

## Practical Exercise
Take 15 minutes to apply what you've learned. Create a simple plan for implementing this concept in your own project.

## Key Takeaways
- Start with fundamentals before advanced techniques
- Follow the 5-step framework: Assess → Plan → Execute → Measure → Iterate
- Track everything from day one

---
*Estimated time: ${lesson.duration}*`
}

// ─── COMPONENT ────────────────────────────────────────────
export default function CoursesPage() {
  const [tab, setTab] = useState<Tab>("generate")
  const [topic, setTopic] = useState("")
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [generating, setGenerating] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<{ moduleIdx: number; lessonIdx: number } | null>(null)
  const [generatingLesson, setGeneratingLesson] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [showQuiz, setShowQuiz] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})

  const handleGenerate = async () => {
    if (!topic) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    const c = generateCourseOutline(topic, level)
    setCourse(c)
    setGenerating(false)
    setTab("editor")
  }

  const handleGenerateLesson = async (moduleIdx: number, lessonIdx: number) => {
    if (!course) return
    setGeneratingLesson(true)
    setSelectedLesson({ moduleIdx, lessonIdx })
    await new Promise(r => setTimeout(r, 1500))
    const updated = { ...course }
    const lesson = updated.modules[moduleIdx].lessons[lessonIdx]
    lesson.content = generateLessonContent(lesson, updated.modules[moduleIdx].title)
    lesson.generated = true
    setCourse({ ...updated })
    setGeneratingLesson(false)
  }

  const handleGenerateAllLessons = async () => {
    if (!course) return
    setGeneratingLesson(true)
    const updated = { ...course }
    for (const mod of updated.modules) {
      for (const lesson of mod.lessons) {
        if (!lesson.generated) {
          lesson.content = generateLessonContent(lesson, mod.title)
          lesson.generated = true
        }
      }
    }
    await new Promise(r => setTimeout(r, 2000))
    setCourse({ ...updated })
    setGeneratingLesson(false)
  }

  const toggleModule = (moduleIdx: number) => {
    if (!course) return
    const updated = { ...course }
    updated.modules[moduleIdx].expanded = !updated.modules[moduleIdx].expanded
    setCourse({ ...updated })
  }

  const addLesson = (moduleIdx: number) => {
    if (!course) return
    const updated = { ...course }
    updated.modules[moduleIdx].lessons.push({
      id: genId(),
      title: "New Lesson",
      duration: "10 min",
      content: "",
      type: "text",
      generated: false,
    })
    setCourse({ ...updated })
  }

  const removeLesson = (moduleIdx: number, lessonIdx: number) => {
    if (!course) return
    const updated = { ...course }
    updated.modules[moduleIdx].lessons.splice(lessonIdx, 1)
    if (selectedLesson?.moduleIdx === moduleIdx && selectedLesson?.lessonIdx === lessonIdx) {
      setSelectedLesson(null)
    }
    setCourse({ ...updated })
  }

  const addModule = () => {
    if (!course) return
    const updated = { ...course }
    const num = updated.modules.length + 1
    updated.modules.push({
      id: genId(),
      title: `Module ${num}: New Module`,
      description: "Add a description for this module",
      lessons: [{
        id: genId(),
        title: "Introduction",
        duration: "10 min",
        content: "",
        type: "text",
        generated: false,
      }],
      quiz: [],
      expanded: true,
    })
    setCourse({ ...updated })
  }

  const exportCourse = () => {
    if (!course) return
    const blob = new Blob([JSON.stringify(course, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${course.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.course.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyJson = () => {
    if (!course) return
    navigator.clipboard.writeText(JSON.stringify(course, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  const totalLessons = course?.modules.reduce((s, m) => s + m.lessons.length, 0) || 0
  const generatedLessons = course?.modules.reduce((s, m) => s + m.lessons.filter(l => l.generated).length, 0) || 0
  const totalQuizzes = course?.modules.reduce((s, m) => s + m.quiz.length, 0) || 0

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple/15">
              <GraduationCap size={28} className="text-purple" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">AI Course Builder</h1>
              <p className="text-sm text-text-dim">Generate complete courses with AI — modules, lessons, quizzes, and content</p>
            </div>
          </div>
          {course && (
            <div className="flex gap-2">
              <button onClick={copyJson} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-xs font-bold text-text-dim hover:text-text transition-colors">
                {copiedJson ? <Check size={12} /> : <Copy size={12} />}
                {copiedJson ? "Copied" : "Copy JSON"}
              </button>
              <button onClick={exportCourse} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-xs font-bold text-text-dim hover:text-text transition-colors">
                <Download size={12} /> Export .json
              </button>
            </div>
          )}
        </div>

        {/* Stats (show when course exists) */}
        {course && (
          <div className="grid grid-cols-5 gap-3 mb-8">
            {[
              { label: "Modules", value: course.modules.length, color: "text-purple" },
              { label: "Lessons", value: totalLessons, color: "text-cyan" },
              { label: "Generated", value: `${generatedLessons}/${totalLessons}`, color: "text-neon" },
              { label: "Quizzes", value: totalQuizzes, color: "text-orange" },
              { label: "Hours", value: `~${course.estimatedHours}`, color: "text-pink" },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl p-3 text-center">
                <div className={cn("text-xl font-black", s.color)}>{s.value}</div>
                <div className="text-[9px] text-text-muted uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "generate" as const, label: "Generate", icon: Sparkles },
            { id: "editor" as const, label: "Course Editor", icon: Edit3, disabled: !course },
            { id: "preview" as const, label: "Preview", icon: Eye, disabled: !course },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => !t.disabled && setTab(t.id)}
              disabled={t.disabled}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                tab === t.id ? "bg-purple/15 text-purple border border-purple/30" : "glass-card text-text-dim hover:text-text",
                t.disabled && "opacity-30 cursor-not-allowed"
              )}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── GENERATE TAB ─────────────────────────── */}
        {tab === "generate" && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-1">What do you want to teach?</h3>
              <p className="text-xs text-text-dim mb-4">Describe the course topic and our AI will generate a complete curriculum with modules, lessons, and quizzes.</p>

              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g., Building and scaling a SaaS business from idea to $10K MRR using AI automation tools..."
                rows={4}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple/40 transition-all resize-none mb-4"
              />

              {/* Level selector */}
              <div className="mb-4">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Difficulty Level</label>
                <div className="flex gap-2">
                  {(["beginner", "intermediate", "advanced"] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all capitalize",
                        level === l
                          ? l === "beginner" ? "bg-neon/15 text-neon border border-neon/30"
                            : l === "intermediate" ? "bg-cyan/15 text-cyan border border-cyan/30"
                            : "bg-purple/15 text-purple border border-purple/30"
                          : "glass-card text-text-dim hover:text-text"
                      )}
                    >
                      {l === "beginner" ? "Beginner (5 modules)" : l === "intermediate" ? "Intermediate (7 modules)" : "Advanced (9 modules)"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic || generating}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-bg disabled:opacity-30 transition-all bg-gradient-to-r from-purple to-pink"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {generating ? "Generating Course Outline..." : "Generate Course with AI"}
              </button>
            </div>

            {/* Quick templates */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Quick Templates</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.label}
                    onClick={() => { setTopic(tmpl.topic); setLevel(tmpl.level) }}
                    className="glass-card rounded-xl px-4 py-3 text-left hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-text">{tmpl.label}</span>
                      <ChevronRight size={10} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] text-text-muted line-clamp-2">{tmpl.topic}</p>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full mt-1.5 inline-block capitalize",
                      tmpl.level === "beginner" ? "bg-neon/10 text-neon" : tmpl.level === "intermediate" ? "bg-cyan/10 text-cyan" : "bg-purple/10 text-purple"
                    )}>
                      {tmpl.level}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── EDITOR TAB ───────────────────────────── */}
        {tab === "editor" && course && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-6">
            {/* Left: Module tree */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Course Structure</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateAllLessons}
                    disabled={generatingLesson}
                    className="flex items-center gap-1 text-[10px] font-bold text-purple hover:text-text transition-colors"
                  >
                    {generatingLesson ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    Generate All Content
                  </button>
                  <button onClick={addModule} className="flex items-center gap-1 text-[10px] font-bold text-neon hover:text-text transition-colors">
                    <Plus size={10} /> Module
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {course.modules.map((mod, mi) => (
                  <div key={mod.id} className="glass-card rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleModule(mi)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple/15 flex items-center justify-center text-[10px] font-black text-purple shrink-0">
                        {mi + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text truncate">{mod.title}</p>
                        <p className="text-[10px] text-text-muted">{mod.lessons.length} lessons</p>
                      </div>
                      {mod.expanded ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
                    </button>

                    <AnimatePresence>
                      {mod.expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-1">
                            {mod.lessons.map((lesson, li) => (
                              <div
                                key={lesson.id}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group",
                                  selectedLesson?.moduleIdx === mi && selectedLesson?.lessonIdx === li
                                    ? "bg-purple/10 border border-purple/20"
                                    : "hover:bg-white/[0.04]"
                                )}
                                onClick={() => setSelectedLesson({ moduleIdx: mi, lessonIdx: li })}
                              >
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  lesson.generated ? "bg-neon" : "bg-border"
                                )} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] text-text truncate">{lesson.title}</p>
                                  <div className="flex items-center gap-2 text-[9px] text-text-muted">
                                    <span className="flex items-center gap-0.5">
                                      {lesson.type === "video" ? <PlayCircle size={8} /> : lesson.type === "quiz" ? <HelpCircle size={8} /> : <FileText size={8} />}
                                      {lesson.type}
                                    </span>
                                    <span className="flex items-center gap-0.5"><Clock size={8} /> {lesson.duration}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!lesson.generated && (
                                    <button
                                      onClick={e => { e.stopPropagation(); handleGenerateLesson(mi, li) }}
                                      className="p-1 rounded hover:bg-purple/20 text-purple"
                                      title="Generate content"
                                    >
                                      <Sparkles size={10} />
                                    </button>
                                  )}
                                  <button
                                    onClick={e => { e.stopPropagation(); removeLesson(mi, li) }}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                    title="Remove lesson"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              onClick={() => addLesson(mi)}
                              className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-text-muted hover:text-neon transition-colors rounded-lg hover:bg-white/[0.04]"
                            >
                              <Plus size={10} /> Add Lesson
                            </button>

                            {/* Quiz toggle */}
                            {mod.quiz.length > 0 && (
                              <button
                                onClick={() => setShowQuiz(showQuiz === mod.id ? null : mod.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-orange font-bold rounded-lg hover:bg-orange/5 transition-colors"
                              >
                                <HelpCircle size={10} />
                                Module Quiz ({mod.quiz.length} question{mod.quiz.length > 1 ? "s" : ""})
                                {showQuiz === mod.id ? <ChevronUp size={10} className="ml-auto" /> : <ChevronDown size={10} className="ml-auto" />}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lesson content / quiz */}
            <div>
              {showQuiz && (() => {
                const mod = course.modules.find(m => m.id === showQuiz)
                if (!mod || mod.quiz.length === 0) return null
                return (
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <HelpCircle size={14} className="text-orange" />
                        {mod.title} — Quiz
                      </h3>
                      <button onClick={() => { setShowQuiz(null); setQuizAnswers({}) }} className="text-xs text-text-muted hover:text-text">Close</button>
                    </div>
                    {mod.quiz.map((q, qi) => {
                      const answerKey = `${mod.id}-${qi}`
                      const answered = answerKey in quizAnswers
                      const correct = quizAnswers[answerKey] === q.correctIndex
                      return (
                        <div key={qi} className="p-4 bg-surface rounded-xl">
                          <p className="text-sm font-bold text-text mb-3">{qi + 1}. {q.question}</p>
                          <div className="space-y-1.5">
                            {q.options.map((opt, oi) => (
                              <button
                                key={oi}
                                onClick={() => { if (!answered) setQuizAnswers(prev => ({ ...prev, [answerKey]: oi })) }}
                                disabled={answered}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-xs transition-all",
                                  answered && oi === q.correctIndex ? "bg-neon/15 text-neon border border-neon/30" :
                                  answered && oi === quizAnswers[answerKey] && oi !== q.correctIndex ? "bg-red-500/15 text-red-400 border border-red-500/30" :
                                  !answered ? "hover:bg-white/[0.06] text-text-dim" :
                                  "text-text-muted"
                                )}
                              >
                                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                                {opt}
                              </button>
                            ))}
                          </div>
                          {answered && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn("mt-3 px-3 py-2 rounded-lg text-xs", correct ? "bg-neon/10 text-neon" : "bg-orange/10 text-orange")}
                            >
                              {correct ? "Correct!" : "Not quite."} {q.explanation}
                            </motion.div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {!showQuiz && selectedLesson ? (() => {
                const lesson = course.modules[selectedLesson.moduleIdx]?.lessons[selectedLesson.lessonIdx]
                if (!lesson) return null
                return (
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-text">{lesson.title}</h3>
                        <div className="flex items-center gap-3 text-[10px] text-text-muted mt-1">
                          <span className="capitalize flex items-center gap-1">
                            {lesson.type === "video" ? <PlayCircle size={10} /> : <FileText size={10} />}
                            {lesson.type}
                          </span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {lesson.duration}</span>
                          <span className={lesson.generated ? "text-neon" : "text-text-muted"}>
                            {lesson.generated ? "Content generated" : "Not generated yet"}
                          </span>
                        </div>
                      </div>
                      {!lesson.generated && (
                        <button
                          onClick={() => handleGenerateLesson(selectedLesson.moduleIdx, selectedLesson.lessonIdx)}
                          disabled={generatingLesson}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-bg bg-gradient-to-r from-purple to-pink disabled:opacity-50"
                        >
                          {generatingLesson ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          Generate Content
                        </button>
                      )}
                    </div>

                    {lesson.content ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <div className="bg-surface rounded-xl p-5 text-sm text-text-dim leading-relaxed whitespace-pre-wrap">
                          {lesson.content}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-surface rounded-xl p-12 text-center text-text-muted">
                        <FileText size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Click &quot;Generate Content&quot; to create AI-powered lesson material</p>
                      </div>
                    )}
                  </div>
                )
              })() : !showQuiz && (
                <div className="glass-card rounded-2xl p-12 text-center text-text-muted">
                  <BookOpen size={36} className="mx-auto mb-3 opacity-20" />
                  <h3 className="text-sm font-bold mb-1">Select a Lesson</h3>
                  <p className="text-xs">Click on any lesson in the course structure to view or generate its content.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── PREVIEW TAB ──────────────────────────── */}
        {tab === "preview" && course && (
          <div className="max-w-4xl mx-auto">
            {/* Course header */}
            <div className="glass-card rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                  course.level === "beginner" ? "bg-neon/10 text-neon" :
                  course.level === "intermediate" ? "bg-cyan/10 text-cyan" :
                  "bg-purple/10 text-purple"
                )}>
                  {course.level}
                </span>
                <span className="text-[10px] text-text-muted">{course.modules.length} modules</span>
                <span className="text-[10px] text-text-muted">{totalLessons} lessons</span>
                <span className="text-[10px] text-text-muted">~{course.estimatedHours} hours</span>
              </div>
              <h1 className="text-2xl font-black text-text mb-2">{course.title}</h1>
              <p className="text-sm text-text-dim leading-relaxed mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted">{t}</span>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
                  <span>Content Progress</span>
                  <span>{generatedLessons}/{totalLessons} lessons generated</span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple to-pink"
                    initial={{ width: 0 }}
                    animate={{ width: `${totalLessons > 0 ? (generatedLessons / totalLessons) * 100 : 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Module list */}
            <div className="space-y-4">
              {course.modules.map((mod, mi) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.05 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple/20 to-pink/20 flex items-center justify-center text-sm font-black text-purple">
                        {mi + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-text">{mod.title}</h3>
                        <p className="text-xs text-text-dim">{mod.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {mod.lessons.map((lesson, li) => (
                      <div key={lesson.id} className="px-6 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                          lesson.generated ? "bg-neon/15" : "bg-surface"
                        )}>
                          {lesson.generated
                            ? <Check size={10} className="text-neon" />
                            : <span className="text-[9px] text-text-muted">{li + 1}</span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text">{lesson.title}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                          <span className="capitalize flex items-center gap-0.5">
                            {lesson.type === "video" ? <PlayCircle size={9} /> : <FileText size={9} />}
                            {lesson.type}
                          </span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                    {mod.quiz.length > 0 && (
                      <div className="px-6 py-3 flex items-center gap-3 bg-orange/[0.03]">
                        <div className="w-6 h-6 rounded-full bg-orange/15 flex items-center justify-center">
                          <HelpCircle size={10} className="text-orange" />
                        </div>
                        <span className="text-sm text-orange font-medium">Module Quiz</span>
                        <span className="text-[10px] text-text-muted">{mod.quiz.length} question{mod.quiz.length > 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reset */}
            <div className="mt-8 text-center">
              <button
                onClick={() => { setCourse(null); setTab("generate"); setSelectedLesson(null); setShowQuiz(null); setQuizAnswers({}) }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass-card text-xs font-bold text-text-dim hover:text-text transition-colors mx-auto"
              >
                <RotateCcw size={12} /> Start New Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

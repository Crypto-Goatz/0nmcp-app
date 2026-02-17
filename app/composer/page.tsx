"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Combine, Upload, FileJson, Trash2, Download, Save, Plus,
  Check, Copy, FolderOpen, Link2, Workflow, Settings2,
  Zap, Server, ChevronDown, X, Search, Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase-browser"
import { SERVICES } from "@/lib/catalog"
import { parseOnFile, generateSwitchFile, type ParsedFile } from "@/lib/composer"

type Tab = 'files' | 'compose' | 'saved'

const TYPE_META: Record<string, { label: string; color: string; icon: typeof FileJson }> = {
  connection: { label: 'Connection', color: '#00ff88', icon: Link2 },
  workflow: { label: 'Workflow', color: '#9945ff', icon: Workflow },
  run: { label: 'RUN', color: '#ff6b35', icon: Zap },
  switch: { label: 'SWITCH', color: '#00d4ff', icon: Combine },
  config: { label: 'Config', color: '#484e78', icon: Settings2 },
  unknown: { label: 'File', color: '#484e78', icon: FileJson },
}

interface SavedFile {
  id: string
  filename: string
  name: string
  type: string
  version: string
  services: string[]
  data: Record<string, unknown>
  description: string | null
  is_master: boolean
  created_at: string
  updated_at: string
}

export default function ComposerPage() {
  const supabase = createClient()
  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<Tab>('files')
  const [files, setFiles] = useState<ParsedFile[]>([])
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([])
  const [switchName, setSwitchName] = useState('My SWITCH')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [pasteMode, setPasteMode] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [previewFile, setPreviewFile] = useState<ParsedFile | null>(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  // Load saved files on mount
  useEffect(() => {
    loadSavedFiles()
  }, [])

  async function loadSavedFiles() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_files')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (data) setSavedFiles(data)
    if (error) showMsg('error', error.message)
  }

  function showMsg(type: 'success' | 'error', text: string) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // File drop handling
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const items = e.dataTransfer.files
    processFiles(items)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }, [])

  function processFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      if (!file.name.endsWith('.0n') && !file.name.endsWith('.json')) {
        showMsg('error', `Skipped ${file.name} — only .0n and .json files`)
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const parsed = parseOnFile(file.name, ev.target?.result as string)
          setFiles(prev => [...prev, parsed])
        } catch {
          showMsg('error', `Failed to parse ${file.name}`)
        }
      }
      reader.readAsText(file)
    })
  }

  function handlePasteImport() {
    if (!pasteText.trim()) return
    try {
      const parsed = parseOnFile('pasted-file.0n', pasteText)
      setFiles(prev => [...prev, parsed])
      setPasteText('')
      setPasteMode(false)
      showMsg('success', 'File imported from paste')
    } catch {
      showMsg('error', 'Invalid JSON — could not parse')
    }
  }

  function removeFile(id: string) {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  // Save file to Supabase
  async function saveFile(file: ParsedFile) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { error } = await supabase.from('user_files').insert({
      user_id: user.id,
      filename: file.filename,
      name: file.name,
      type: file.type,
      version: file.version,
      services: file.services,
      data: file.data,
      description: file.description,
      is_master: false,
    })

    setLoading(false)
    if (error) showMsg('error', error.message)
    else {
      showMsg('success', `Saved "${file.name}"`)
      loadSavedFiles()
    }
  }

  // Save composed SWITCH
  async function saveSwitch() {
    if (files.length === 0) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const switchData = generateSwitchFile(switchName, files, user.email || undefined)

    const { error } = await supabase.from('user_files').insert({
      user_id: user.id,
      filename: `${switchName.toLowerCase().replace(/\s+/g, '-')}.0n`,
      name: switchName,
      type: 'switch',
      version: '1.0.0',
      services: [...new Set(files.flatMap(f => f.services))],
      data: switchData,
      description: `Master SWITCH composing ${files.length} files`,
      is_master: true,
    })

    setLoading(false)
    if (error) showMsg('error', error.message)
    else {
      showMsg('success', `SWITCH "${switchName}" saved!`)
      loadSavedFiles()
    }
  }

  // Export as download
  function exportSwitch() {
    const switchData = generateSwitchFile(switchName, files)
    const blob = new Blob([JSON.stringify(switchData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${switchName.toLowerCase().replace(/\s+/g, '-')}.0n`
    a.click()
    URL.revokeObjectURL(url)
    showMsg('success', 'SWITCH exported')
  }

  function exportFile(data: Record<string, unknown>, name: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.0n`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Load a saved file into the workspace
  function loadSavedFile(saved: SavedFile) {
    const parsed: ParsedFile = {
      id: crypto.randomUUID(),
      filename: saved.filename,
      name: saved.name,
      type: saved.type as ParsedFile['type'],
      version: saved.version,
      services: saved.services || [],
      data: saved.data,
      description: saved.description || '',
    }
    setFiles(prev => [...prev, parsed])
    setTab('files')
    showMsg('success', `Loaded "${saved.name}" into workspace`)
  }

  // Delete a saved file
  async function deleteSavedFile(id: string, name: string) {
    if (!confirm(`Delete "${name}" permanently?`)) return
    const { error } = await supabase.from('user_files').delete().eq('id', id)
    if (error) showMsg('error', error.message)
    else {
      setSavedFiles(prev => prev.filter(f => f.id !== id))
      showMsg('success', `Deleted "${name}"`)
    }
  }

  const allServices = [...new Set(files.flatMap(f => f.services))]
  const typeCounts = files.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const filteredSaved = savedFiles.filter(f => {
    if (typeFilter && f.type !== typeFilter) return false
    if (searchFilter && !f.name.toLowerCase().includes(searchFilter.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Combine size={24} className="text-orange" />
            <h1 className="text-3xl font-black tracking-tight">Composer</h1>
          </div>
          <div className="flex items-center gap-2">
            {files.length > 0 && (
              <span className="text-xs text-text-muted">
                {files.length} file{files.length !== 1 ? 's' : ''} &middot; {allServices.length} service{allServices.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={cn(
                "mb-4 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between",
                message.type === 'success'
                  ? "bg-neon/10 text-neon border border-neon/20"
                  : "bg-red/10 text-red border border-red/20"
              )}
            >
              {message.text}
              <button onClick={() => setMessage(null)} className="ml-3 opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-surface rounded-xl w-fit">
          {([
            { key: 'files' as Tab, label: 'Workspace', count: files.length },
            { key: 'compose' as Tab, label: 'Compose', count: null },
            { key: 'saved' as Tab, label: 'Saved Files', count: savedFiles.length },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                tab === t.key ? "bg-white/10 text-text" : "text-text-muted hover:text-text"
              )}
            >
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Workspace */}
        {tab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Drop Zone */}
              <div
                ref={dropRef}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
                  dragOver
                    ? "border-orange bg-orange/5"
                    : "border-border hover:border-orange/40"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".0n,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload size={32} className={cn("mx-auto mb-3", dragOver ? "text-orange" : "text-text-muted")} />
                <p className="text-sm font-bold text-text mb-1">Drop .0n files here</p>
                <p className="text-xs text-text-muted">or click to browse &middot; .0n and .json supported</p>
              </div>

              {/* Paste import */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPasteMode(!pasteMode)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-text-muted hover:text-text text-xs font-bold transition-all"
                >
                  <Copy size={12} />
                  Paste JSON
                </button>
                <button
                  onClick={() => setTab('saved')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-text-muted hover:text-text text-xs font-bold transition-all"
                >
                  <FolderOpen size={12} />
                  Load from Saved
                </button>
              </div>

              <AnimatePresence>
                {pasteMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card rounded-xl p-4 space-y-3">
                      <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder='Paste .0n JSON here...'
                        rows={6}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-xs font-mono text-text placeholder:text-text-muted focus:outline-none focus:border-orange/40 transition-all resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={handlePasteImport} className="px-3 py-1.5 rounded-lg bg-orange/20 text-orange text-xs font-bold hover:bg-orange/30 transition-all">
                          Import
                        </button>
                        <button onClick={() => { setPasteMode(false); setPasteText('') }} className="px-3 py-1.5 rounded-lg glass-card text-text-muted text-xs font-bold hover:text-text transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* File cards */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map(file => {
                    const meta = TYPE_META[file.type] || TYPE_META.unknown
                    const Icon = meta.icon
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 group"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: meta.color + '18', color: meta.color }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text truncate">{file.name}</span>
                            <span
                              className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                              style={{ background: meta.color + '18', color: meta.color }}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-text-muted font-mono">{file.filename}</span>
                            {file.services.length > 0 && (
                              <span className="text-[10px] text-text-dim">&middot; {file.services.join(', ')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setPreviewFile(file)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text transition-all">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => saveFile(file)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-neon transition-all">
                            <Save size={14} />
                          </button>
                          <button onClick={() => removeFile(file.id)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-red transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {files.length === 0 && (
                <div className="text-center py-12 text-text-dim">
                  <FileJson size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold mb-1">No files in workspace</p>
                  <p className="text-xs">Drop .0n files, paste JSON, or load from saved files</p>
                </div>
              )}
            </div>

            {/* Right sidebar — summary */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Workspace Summary</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-dim">Total files</span>
                    <span className="font-bold text-text">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-dim">Services</span>
                    <span className="font-bold text-text">{allServices.length}</span>
                  </div>
                  {Object.entries(typeCounts).map(([type, count]) => {
                    const m = TYPE_META[type] || TYPE_META.unknown
                    return (
                      <div key={type} className="flex justify-between">
                        <span className="text-text-dim">{m.label}s</span>
                        <span className="font-bold" style={{ color: m.color }}>{count}</span>
                      </div>
                    )
                  })}
                </div>

                {allServices.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {allServices.map(sid => {
                        const svc = SERVICES.find(s => s.id === sid)
                        return (
                          <span
                            key={sid}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: (svc?.color || '#fff') + '12', color: svc?.color || '#fff' }}
                          >
                            {svc?.name || sid}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <button
                  onClick={() => setTab('compose')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange to-pink text-bg font-bold text-sm hover:shadow-lg transition-all"
                >
                  <Combine size={16} />
                  Compose SWITCH
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab: Compose */}
        {tab === 'compose' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {files.length === 0 ? (
              <div className="text-center py-16 text-text-dim">
                <Combine size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold mb-2">No files to compose</p>
                <p className="text-sm mb-4">Add .0n files to your workspace first</p>
                <button onClick={() => setTab('files')} className="px-4 py-2 rounded-xl glass-card text-text text-sm font-bold hover:bg-white/[0.06] transition-all">
                  Go to Workspace
                </button>
              </div>
            ) : (
              <>
                <div className="glass-card rounded-xl p-6">
                  <h2 className="text-sm font-bold text-text mb-4">SWITCH Configuration</h2>
                  <input
                    value={switchName}
                    onChange={(e) => setSwitchName(e.target.value)}
                    placeholder="SWITCH name..."
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-orange/40 transition-all"
                  />
                </div>

                {/* Composition visual */}
                <div className="glass-card rounded-xl p-6">
                  <h2 className="text-sm font-bold text-text mb-4">Composition</h2>
                  <div className="space-y-2">
                    {files.map((file, i) => {
                      const meta = TYPE_META[file.type] || TYPE_META.unknown
                      const Icon = meta.icon
                      return (
                        <div key={file.id} className="flex items-center gap-3">
                          {i > 0 && (
                            <div className="w-5 flex justify-center">
                              <div className="w-px h-4 bg-border" />
                            </div>
                          )}
                          {i === 0 && <div className="w-5" />}
                          <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
                            style={{ background: meta.color + '08', border: `1px solid ${meta.color}20` }}
                          >
                            <Icon size={14} style={{ color: meta.color }} />
                            <span className="text-xs font-bold text-text">{file.name}</span>
                            <span className="text-[10px] text-text-dim ml-auto">{meta.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-5 flex justify-center">
                      <div className="w-px h-4 bg-orange/30" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange/10 border border-orange/20 flex-1">
                      <Combine size={14} className="text-orange" />
                      <span className="text-xs font-bold text-orange">{switchName}</span>
                      <span className="text-[10px] text-orange/60 ml-auto">Master SWITCH</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-text">{files.length}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Files</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-neon">{allServices.length}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Services</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-orange">{Object.keys(typeCounts).length}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Types</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={saveSwitch}
                    disabled={loading || !switchName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg font-bold text-sm disabled:opacity-30 hover:shadow-lg transition-all"
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save SWITCH'}
                  </button>
                  <button
                    onClick={exportSwitch}
                    disabled={!switchName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-card text-text font-bold text-sm disabled:opacity-30 hover:bg-white/[0.06] transition-all"
                  >
                    <Download size={16} />
                    Export .0n
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab: Saved Files */}
        {tab === 'saved' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search files..."
                  className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-orange/40 transition-all"
                />
              </div>
              {['connection', 'workflow', 'run', 'switch', 'config'].map(type => {
                const m = TYPE_META[type]
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                      typeFilter === type
                        ? "bg-white/10 text-text"
                        : "glass-card text-text-dim hover:text-text"
                    )}
                    style={typeFilter === type ? { color: m.color } : undefined}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>

            {filteredSaved.length === 0 ? (
              <div className="text-center py-12 text-text-dim">
                <FolderOpen size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold mb-1">
                  {savedFiles.length === 0 ? 'No saved files yet' : 'No files match filter'}
                </p>
                <p className="text-xs">
                  {savedFiles.length === 0
                    ? 'Import .0n files in the workspace and save them here'
                    : 'Try a different search or filter'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSaved.map(file => {
                  const meta = TYPE_META[file.type] || TYPE_META.unknown
                  const Icon = meta.icon
                  return (
                    <div key={file.id} className="glass-card rounded-xl p-4 group">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: meta.color + '18', color: meta.color }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text truncate">{file.name}</span>
                            {file.is_master && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange/15 text-orange">
                                master
                              </span>
                            )}
                          </div>
                          <span
                            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded inline-block mt-1"
                            style={{ background: meta.color + '18', color: meta.color }}
                          >
                            {meta.label}
                          </span>
                          {file.description && (
                            <p className="text-[10px] text-text-dim mt-1 line-clamp-2">{file.description}</p>
                          )}
                          {file.services && file.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {file.services.slice(0, 5).map(sid => {
                                const svc = SERVICES.find(s => s.id === sid)
                                return (
                                  <span key={sid} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-text-dim">
                                    {svc?.name || sid}
                                  </span>
                                )
                              })}
                              {file.services.length > 5 && (
                                <span className="text-[9px] text-text-muted">+{file.services.length - 5}</span>
                              )}
                            </div>
                          )}
                          <div className="text-[10px] text-text-muted mt-1">
                            v{file.version} &middot; {new Date(file.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                        <button
                          onClick={() => loadSavedFile(file)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-text-muted hover:text-text glass-card hover:bg-white/[0.06] transition-all"
                        >
                          <Plus size={10} />
                          Add to Workspace
                        </button>
                        <button
                          onClick={() => exportFile(file.data, file.name)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-text-muted hover:text-text glass-card hover:bg-white/[0.06] transition-all"
                        >
                          <Download size={10} />
                        </button>
                        <button
                          onClick={() => deleteSavedFile(file.id, file.name)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-text-muted hover:text-red glass-card hover:bg-red/5 transition-all"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* File Preview Modal */}
        <AnimatePresence>
          {previewFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setPreviewFile(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-bg border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <div>
                    <span className="text-sm font-bold text-text">{previewFile.name}</span>
                    <span className="text-xs text-text-muted ml-2">{previewFile.filename}</span>
                  </div>
                  <button onClick={() => setPreviewFile(null)} className="text-text-muted hover:text-text">
                    <X size={18} />
                  </button>
                </div>
                <pre className="p-5 text-xs font-mono text-text-dim overflow-auto max-h-[65vh] leading-relaxed">
                  {JSON.stringify(previewFile.data, null, 2)}
                </pre>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

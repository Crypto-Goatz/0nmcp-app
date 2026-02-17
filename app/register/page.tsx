"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, Mail, Lock, User, Github, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      setLoading(false)
      return
    }

    // Check username availability
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .single()

    if (existing) {
      setError("Username is already taken")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          display_name: username,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  async function handleGithub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?redirect=/community`,
      },
    })
    if (error) setError(error.message)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon to-cyan flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-bg" />
          </div>
          <h1 className="text-2xl font-black">Check your email</h1>
          <p className="text-text-dim mt-2">
            We sent a confirmation link to <span className="text-neon">{email}</span>.<br />
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 px-6 py-2 rounded-xl bg-neon/10 text-neon font-medium hover:bg-neon/20 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon to-cyan flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="text-bg" />
          </div>
          <h1 className="text-2xl font-black">Join 0nMCP</h1>
          <p className="text-text-dim mt-1">Create your account and join the community</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border">
          <button
            onClick={handleGithub}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-text font-medium transition-colors mb-4"
          >
            <Github size={18} />
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-neon/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-neon/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-neon/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red text-sm px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-neon text-bg font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-dim mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-neon hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

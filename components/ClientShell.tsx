"use client"

import AuthProvider from "./auth/AuthProvider"
import CommandCenter from "./CommandCenter"

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <CommandCenter />
    </AuthProvider>
  )
}

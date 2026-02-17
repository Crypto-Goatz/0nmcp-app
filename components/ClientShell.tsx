"use client"

import AuthProvider from "./auth/AuthProvider"
import DashboardShell from "./DashboardShell"

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </AuthProvider>
  )
}

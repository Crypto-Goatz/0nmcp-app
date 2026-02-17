"use client"

import NavRail from "./NavRail"
import Sidebar from "./Sidebar"

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Left nav rail */}
      <NavRail />

      {/* Main content — offset for nav rail and sidebar */}
      <main className="ml-[64px] mr-[320px] min-h-screen transition-all duration-300">
        {children}
      </main>

      {/* Right sidebar */}
      <Sidebar />
    </div>
  )
}

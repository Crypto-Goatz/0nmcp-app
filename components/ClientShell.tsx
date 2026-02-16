"use client"

import CommandCenter from "./CommandCenter"

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CommandCenter />
    </>
  )
}

import type React from "react"

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-950">{children}</div>
}

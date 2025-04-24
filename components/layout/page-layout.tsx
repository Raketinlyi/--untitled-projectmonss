import type { ReactNode } from "react"
import { Header } from "./header"
import { Footer } from "./footer"

interface PageLayoutProps {
  children: ReactNode
  showNavigation?: boolean
}

export function PageLayout({ children, showNavigation = true }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showNavigation={showNavigation} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

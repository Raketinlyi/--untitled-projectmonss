import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { PawPrints } from "@/components/paw-prints"
import { I18nProvider } from "@/lib/i18n-context"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingLogos } from "@/components/floating-logos"
import { MonsterBackground } from "@/components/monster-background"
import { SocialSidebar } from "@/components/social-sidebar"
import type { Metadata } from "next"
import { BnbBackgroundEffect } from "@/components/bnb-background-effect"
import { cn } from "@/lib/utils"

// Use a simpler font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Fix metadata for better SEO
export const metadata: Metadata = {
  title: "BNB Monster NFT - Collect, Breed, Trade",
  description: "Collect, breed and trade unique BNB Monster NFTs on the BNB blockchain",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
    generator: 'v0.dev'
}

// Fix the RootLayout component to include proper lang attribute
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#F7931A" />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", inter.className)}>
        <div className="bnb-background relative min-h-screen overflow-x-hidden">
          <BnbBackgroundEffect />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <I18nProvider>
              <AnimatedBackground />
              <FloatingLogos />
              <MonsterBackground />
              <SocialSidebar />
              {children}
              <PawPrints />
            </I18nProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}

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

// Use a simpler font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Fix metadata for better SEO
export const metadata: Metadata = {
  title: "MonadMonster",
  description: "MonadMonster NFT Collection",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [{ url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" }],
  },
  // Add more detailed metadata:
  keywords: "NFT, MonadMonster, blockchain, crypto, collection, game, breed, trade, Monad",
  authors: [{ name: "MonadMonster Team" }],
  openGraph: {
    title: "MonadMonster NFT Collection",
    description: "Collect, Breed & Trade Crazy MonadMonster NFTs on the Monad blockchain",
    images: [
      {
        url: "/images/momon-logo.png",
        width: 1200,
        height: 630,
        alt: "MonadMonster NFT Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonadMonster NFT Collection",
    description: "Collect, Breed & Trade Crazy MonadMonster NFTs on the Monad blockchain",
    images: ["/images/momon-logo.png"],
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
        <meta name="theme-color" content="#4a1d96" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 text-white font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <I18nProvider>
            <AnimatedBackground />
            <FloatingLogos />
            <MonsterBackground />
            <SocialSidebar />
            {children}
            <PawPrints />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

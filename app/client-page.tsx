"use client"

import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/error-boundary"

// Динамический импорт HomeContent с отключенным SSR
const HomeContent = dynamic(() => import("@/components/home-content"), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
})

function LoadingPlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 flex items-center justify-center">
      <div className="text-white text-2xl animate-pulse">Загрузка MonadMonster NFT...</div>
    </div>
  )
}

export default function ClientPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <LoadingPlaceholder />
  }

  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <ErrorBoundary>
        <HomeContent />
      </ErrorBoundary>
    </Suspense>
  )
}

"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { I18nProvider } from "@/lib/i18n-context"

// Динамический импорт HomeContent для оптимизации загрузки
const HomeContent = dynamic(() => import("@/components/home-content"), {
  loading: () => <LoadingFallback />,
  ssr: true,
})

// Компонент для отображения во время загрузки
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-pink-500 border-r-purple-500 border-b-blue-500 border-l-cyan-500 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-white text-lg">Loading amazing monsters...</p>
      </div>
    </div>
  )
}

export default function HomeWrapper() {
  return (
    <I18nProvider>
      <Suspense fallback={<LoadingFallback />}>
        <HomeContent />
      </Suspense>
    </I18nProvider>
  )
}

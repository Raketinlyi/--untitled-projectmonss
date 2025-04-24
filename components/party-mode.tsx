"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function PartyMode() {
  const [isPartyMode, setIsPartyMode] = useState(false)
  const { locale } = useI18n()

  const togglePartyMode = () => {
    setIsPartyMode(!isPartyMode)

    if (typeof document !== "undefined") {
      if (!isPartyMode) {
        document.body.classList.add("party-mode")
      } else {
        document.body.classList.remove("party-mode")
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePartyMode}
      className={`rounded-full ${isPartyMode ? "bg-pink-500/20 text-pink-400 animate-pulse" : "text-gray-400"}`}
      aria-label={locale === "ru" ? "Переключить режим вечеринки" : "Toggle party mode"}
    >
      <Sparkles className="w-4 h-4" />
    </Button>
  )
}

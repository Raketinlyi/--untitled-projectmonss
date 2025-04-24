"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface ErrorDisplayProps {
  error?: Error | string
  resetErrorBoundary?: () => void
  message?: string
}

export function ErrorDisplay({ error, resetErrorBoundary, message }: ErrorDisplayProps) {
  const { locale } = useI18n()

  // Локализованные тексты
  const errorTitle = locale === "ru" ? "Произошла ошибка" : "An error occurred"
  const tryAgainText = locale === "ru" ? "Попробовать снова" : "Try Again"
  const defaultMessage =
    locale === "ru" ? "Что-то пошло не так. Пожалуйста, попробуйте снова." : "Something went wrong. Please try again."

  const displayMessage = message || defaultMessage
  const errorMessage = typeof error === "string" ? error : error?.message

  return (
    <div className="rounded-lg bg-red-500/10 border border-red-500 p-4 my-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-500">{errorTitle}</h3>
          <p className="text-sm text-gray-200 mt-1">{displayMessage}</p>
          {errorMessage && <p className="text-xs text-gray-400 mt-2 font-mono">{errorMessage}</p>}
          {resetErrorBoundary && (
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              size="sm"
              className="mt-3 border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              {tryAgainText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

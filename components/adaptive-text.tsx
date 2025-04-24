"use client"

import { type ReactNode, useState, useEffect, useMemo } from "react"
import { useI18n } from "@/lib/i18n-context"

interface AdaptiveTextProps {
  children: ReactNode
  className?: string
  maxLength?: number
}

export function AdaptiveText({ children, className = "", maxLength = 20 }: AdaptiveTextProps) {
  const { locale } = useI18n()
  const [fontSize, setFontSize] = useState<string>("inherit")

  // Мемоизируем текст для предотвращения ненужных вычислений
  const text = useMemo(() => {
    if (children === null || children === undefined) return ""
    return String(children)
  }, [children])

  // Эффект для адаптации размера шрифта
  useEffect(() => {
    try {
      // Проверяем длину текста
      if (text.length > maxLength) {
        // Для длинных текстов уменьшаем размер шрифта
        const ratio = maxLength / text.length
        const newSize = Math.max(0.7, ratio) * 100
        setFontSize(`${newSize}%`)
      } else {
        setFontSize("inherit")
      }
    } catch (error) {
      console.error("Error in AdaptiveText:", error)
      setFontSize("inherit") // В случае ошибки используем стандартный размер
    }
  }, [text, locale, maxLength])

  return (
    <span className={className} style={{ fontSize }}>
      {children}
    </span>
  )
}

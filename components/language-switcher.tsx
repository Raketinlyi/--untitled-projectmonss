"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import type { Locale } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"

interface Language {
  code: string
  name: string
  flag: string
}

export function LanguageSwitcher() {
  const { locale, changeLocale } = useI18n()
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const [isAutoDetected, setIsAutoDetected] = useState(false)

  // Список поддерживаемых языков - мемоизируем для предотвращения ненужных ререндеров
  const languages: Language[] = useMemo(
    () => [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
      { code: "fr", name: "Français", flag: "🇫🇷" },
      { code: "de", name: "Deutsch", flag: "🇩🇪" },
      { code: "it", name: "Italiano", flag: "🇮🇹" },
      { code: "zh", name: "中文", flag: "🇨🇳" },
      { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
      { code: "uk", name: "Українська", flag: "🇺🇦" },
      { code: "ar", name: "العربية", flag: "🇸🇦" },
      { code: "ru", name: "Русский", flag: "🇷🇺" },
    ],
    [],
  )

  // Эффект для пульсации при первой загрузке
  useEffect(() => {
    // Проверяем, был ли уже показан индикатор
    const hasSeenLanguageSwitcher = localStorage.getItem("hasSeenLanguageSwitcher")

    if (hasSeenLanguageSwitcher) {
      setHasBeenSeen(true)
    } else {
      // Останавливаем эффект пульсации через 5 секунд
      const timer = setTimeout(() => {
        setHasBeenSeen(true)
        localStorage.setItem("hasSeenLanguageSwitcher", "true")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Проверяем, был ли язык определен автоматически
  useEffect(() => {
    // Если в localStorage нет сохраненного языка, значит язык был определен автоматически
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("preferred-locale")
      if (!savedLocale) {
        setIsAutoDetected(true)

        // Через 5 секунд скрываем уведомление
        const timer = setTimeout(() => {
          setIsAutoDetected(false)
        }, 5000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  // Обработчик смены языка
  const handleLanguageChange = (langCode: string) => {
    changeLocale(langCode as Locale)
    setIsOpen(false)
  }

  // Обработчики событий мыши
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleOpenChange = (open: boolean) => setIsOpen(open)

  // Текущий язык
  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  // Анимации
  const notificationVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { x: 5, transition: { duration: 0.2 } },
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isAutoDetected && (
          <motion.div
            className="absolute -top-10 left-0 right-0 bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white text-xs p-1.5 rounded-md text-center shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
          >
            {locale === "ru"
              ? "Язык определен автоматически"
              : locale === "es"
                ? "Idioma detectado automáticamente"
                : locale === "fr"
                  ? "Langue détectée automatiquement"
                  : locale === "de"
                    ? "Sprache automatisch erkannt"
                    : locale === "it"
                      ? "Lingua rilevata automaticamente"
                      : locale === "zh"
                        ? "语言已自动检测"
                        : locale === "uk"
                          ? "Мова визначена автоматично"
                          : locale === "ar"
                            ? "تم الكشف عن اللغة تلقائيًا"
                            : locale === "hi"
                              ? "भाषा स्वचालित रूप से पहचानी गई"
                              : "Language detected automatically"}
          </motion.div>
        )}
      </AnimatePresence>

      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`
              text-white/80 hover:text-white hover:bg-white/10 
              transition-all duration-300 relative
              ${!hasBeenSeen ? "animate-pulse" : ""}
              ${isHovered || isOpen ? "bg-white/10" : ""}
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={`Сменить язык. Текущий язык: ${currentLanguage.name}`}
          >
            <Globe className="w-4 h-4 mr-1" aria-hidden="true" />
            <span className="text-sm">{currentLanguage.flag}</span>
            <span aria-hidden="true">{currentLanguage.code.toUpperCase()}</span>

            {/* Индикатор новой функции */}
            {!hasBeenSeen && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-md border border-white/10 text-white p-1 min-w-[180px] shadow-xl"
        >
          <AnimatePresence>
            {languages.map((lang) => (
              <motion.div
                key={lang.code}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={menuItemVariants}
              >
                <DropdownMenuItem
                  className={`
                    flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer rounded-md
                    ${locale === lang.code ? "bg-white/10 text-pink-400 font-medium" : "hover:bg-white/5 hover:text-pink-400"}
                    transition-colors duration-150
                  `}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="text-base" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span>{lang.name}</span>
                  {locale === lang.code && (
                    <span className="ml-auto text-xs text-green-400" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </DropdownMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

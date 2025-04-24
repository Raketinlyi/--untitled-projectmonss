"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { getTranslations } from "@/lib/i18n"
import type { Translations } from "@/lib/i18n"

// Update the supported locales to be a constant
const SUPPORTED_LOCALES: Locale[] = ["en", "ru", "es", "zh", "uk", "ar", "hi"]

// Обновим функцию detectBrowserLanguage для поддержки Telegram WebApp
function detectBrowserLanguage(): Locale {
  if (typeof window === "undefined") return "en" // Для SSR

  // Проверяем, находимся ли мы в Telegram WebApp
  const isTelegramWebApp =
    typeof window !== "undefined" &&
    window.navigator.userAgent.includes("Telegram") &&
    (window as any).Telegram &&
    (window as any).Telegram.WebApp

  let langCode = "en"

  if (
    isTelegramWebApp &&
    (window as any).Telegram.WebApp.initDataUnsafe &&
    (window as any).Telegram.WebApp.initDataUnsafe.user
  ) {
    // Получаем язык из Telegram WebApp
    langCode = (window as any).Telegram.WebApp.initDataUnsafe.user.language_code || "en"
  } else {
    // Получаем язык из navigator
    const browserLang = navigator.language || (navigator as any).userLanguage
    langCode = browserLang.split("-")[0].toLowerCase()
  }

  // Check if language is supported
  return SUPPORTED_LOCALES.includes(langCode as Locale) ? (langCode as Locale) : "en"
}

// Create context with proper typing
interface I18nContextType {
  locale: Locale
  translations: Translations
  changeLocale: (newLocale: Locale) => void
  isChanging: boolean
}

const defaultLocale: Locale = "en"

// Default context value
const defaultContext: I18nContextType = {
  locale: defaultLocale,
  translations: getTranslations(defaultLocale),
  changeLocale: () => {},
  isChanging: false,
}

// Create context
const I18nContext = createContext<I18nContextType>(defaultContext)

// Hook to use the i18n context
export const useI18n = () => useContext(I18nContext)

interface I18nProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

// Изменим Provider component для использования определения языка браузера
export const I18nProvider: React.FC<I18nProviderProps> = ({ children, initialLocale }) => {
  // Определяем начальную локаль
  const getInitialLocale = (): Locale => {
    if (initialLocale) return initialLocale

    // Проверяем сохраненную локаль в localStorage
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("preferred-locale") as Locale | null
      if (savedLocale) return savedLocale
    }

    // Определяем локаль браузера
    if (typeof navigator !== "undefined") {
      const browserLocale = navigator.language.split("-")[0]
      if (browserLocale === "ru") return "ru"
      if (browserLocale === "es") return "es"
      if (browserLocale === "fr") return "fr"
      if (browserLocale === "de") return "de"
      if (browserLocale === "it") return "it"
      if (browserLocale === "zh") return "zh"
      if (browserLocale === "uk") return "uk"
      if (browserLocale === "ar") return "ar"
      if (browserLocale === "hi") return "hi"
    }

    return defaultLocale
  }

  const [locale, setLocale] = useState<Locale>(getInitialLocale())
  const [translations, setTranslations] = useState<Translations>(getTranslations(getInitialLocale()))
  const [isChanging, setIsChanging] = useState(false)

  // Функция для изменения локали
  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale) return

    setIsChanging(true)

    // Добавляем небольшую задержку для анимации
    setTimeout(() => {
      setLocale(newLocale)
      localStorage.setItem("preferred-locale", newLocale)

      // Обновляем переводы
      setTranslations(getTranslations(newLocale))

      // Сбрасываем флаг анимации
      setTimeout(() => {
        setIsChanging(false)
      }, 300)
    }, 100)
  }

  // Обновляем переводы при изменении локали
  useEffect(() => {
    setTranslations(getTranslations(locale))
  }, [locale])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale

      // Добавляем атрибут direction для RTL языков
      if (locale === "ar") {
        document.documentElement.dir = "rtl"
      } else {
        document.documentElement.dir = "ltr"
      }
    }
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, translations, changeLocale, isChanging }}>
      <div className={`app-content ${isChanging ? "language-transition" : ""}`}>{children}</div>
    </I18nContext.Provider>
  )
}

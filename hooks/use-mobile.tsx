"use client"

import { useState, useEffect } from "react"

interface MobileState {
  isMobile: boolean
  isLandscape: boolean
  isTouch: boolean
}

export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isLandscape: false,
    isTouch: false,
  })

  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const checkMobile = () => {
      if (typeof window === "undefined") return false
      const userAgent = navigator.userAgent.toLowerCase()
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    }

    // Определяем, поддерживает ли устройство сенсорный ввод
    const checkTouch = () => {
      if (typeof window === "undefined") return false
      return "ontouchstart" in window || navigator.maxTouchPoints > 0
    }

    // Определяем ориентацию экрана
    const checkOrientation = () => {
      if (typeof window === "undefined") return false
      return window.innerWidth > window.innerHeight
    }

    // Обработчик изменения размера окна
    const handleResize = () => {
      setState({
        isMobile: checkMobile(),
        isLandscape: checkOrientation(),
        isTouch: checkTouch(),
      })
    }

    // Инициализация
    handleResize()

    // Добавляем слушатели событий
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [])

  return state
}

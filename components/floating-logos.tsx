"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

interface FloatingLogoProps {
  position: { x: number; y: number }
  size: number
  delay: number
  duration: number
  opacity: number
  rotation: number
  blur: number
}

// Компонент отдельного плавающего логотипа
function FloatingLogo({ position, size, delay, duration, opacity, rotation, blur }: FloatingLogoProps) {
  return (
    <div
      className="absolute logo-float"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity,
        transform: `rotate(${rotation}deg)`,
        filter: `blur(${blur}px)`,
        zIndex: -1,
      }}
    >
      <Image
        src="/images/momon-logo.png"
        alt="Floating Momon Logo"
        width={size}
        height={size}
        className="select-none pointer-events-none"
        style={{ width: size, height: size }}
        priority={false}
      />
    </div>
  )
}

export function FloatingLogos() {
  const { isMobile } = useMobile()
  const [logos, setLogos] = useState<FloatingLogoProps[]>([])

  useEffect(() => {
    // Создаем несколько плавающих логотипов
    const logoCount = isMobile ? 4 : 6

    // Размер логотипа
    const minSize = 20
    const maxSize = 60

    // Равномерно распределяем логотипы по экрану
    const newLogos: FloatingLogoProps[] = []
    for (let i = 0; i < logoCount; i++) {
      // Разделяем экран на секции для более равномерного распределения
      const sectionWidth = 100 / Math.ceil(Math.sqrt(logoCount))
      const sectionHeight = 100 / Math.ceil(Math.sqrt(logoCount))

      const sectionX = i % Math.ceil(Math.sqrt(logoCount))
      const sectionY = Math.floor(i / Math.ceil(Math.sqrt(logoCount)))

      const x = sectionX * sectionWidth + Math.random() * sectionWidth
      const y = sectionY * sectionHeight + Math.random() * sectionHeight

      newLogos.push({
        position: {
          x: x, // Позиция по X с учетом секции
          y: y, // Позиция по Y с учетом секции
        },
        size: Math.floor(Math.random() * (maxSize - minSize)) + minSize, // Размер от minSize до maxSize
        delay: Math.random() * 15, // Задержка анимации от 0 до 15 секунд
        duration: Math.random() * 40 + 40, // Длительность анимации от 40 до 80 секунд
        opacity: Math.random() * 0.15 + 0.05, // Прозрачность от 0.05 до 0.2
        rotation: Math.random() * 360, // Случайный поворот от 0 до 360 градусов
        blur: Math.random() * 2 + 1, // Размытие от 1 до 3 пикселей
      })
    }

    setLogos(newLogos)
  }, [isMobile])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {logos.map((logo, index) => (
        <FloatingLogo key={`logo-${index}`} {...logo} />
      ))}
    </div>
  )
}

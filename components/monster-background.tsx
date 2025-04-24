"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

// Массив путей к изображениям монстриков
const monsterImages = [
  "/images/monsters/monster1.png",
  "/images/monsters/monster2.png",
  "/images/monsters/monster3.png",
  "/images/monsters/monster4.png",
  "/images/monsters/monster5.png",
  "/images/monsters/monster6.png",
  "/images/monsters/monster7.png",
]

interface MonsterProps {
  src: string
  size: number
  position: { x: number; y: number }
  delay: number
  duration: number
  opacity: number
  rotation: number
  scale: number
}

// Компонент отдельного монстрика
function Monster({ src, size, position, delay, duration, opacity, rotation, scale }: MonsterProps) {
  return (
    <div
      className="absolute monster-float"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        filter: "drop-shadow(0 0 8px rgba(255, 105, 180, 0.3))",
        zIndex: Math.floor(opacity * 10), // Устанавливаем z-index на основе прозрачности
      }}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt="Monster"
        width={size}
        height={size}
        className="select-none pointer-events-none"
        style={{ width: size, height: size }}
        priority={false}
      />
    </div>
  )
}

export function MonsterBackground() {
  const { isMobile } = useMobile()
  const [monsters, setMonsters] = useState<MonsterProps[]>([])

  useEffect(() => {
    // Адаптивное количество монстриков
    const monsterCount = isMobile ? 12 : 20

    // Создаем массив монстриков с улучшенными случайными параметрами
    const newMonsters: MonsterProps[] = []
    for (let i = 0; i < monsterCount; i++) {
      // Более равномерное распределение по экрану
      const sectionWidth = 100 / Math.ceil(Math.sqrt(monsterCount))
      const sectionHeight = 100 / Math.ceil(Math.sqrt(monsterCount))

      const sectionX = i % Math.ceil(Math.sqrt(monsterCount))
      const sectionY = Math.floor(i / Math.ceil(Math.sqrt(monsterCount)))

      const x = sectionX * sectionWidth + Math.random() * sectionWidth
      const y = sectionY * sectionHeight + Math.random() * sectionHeight

      newMonsters.push({
        src: monsterImages[Math.floor(Math.random() * monsterImages.length)],
        size: Math.floor(Math.random() * 25) + 15, // Размер от 15 до 40px
        position: {
          x: x, // Позиция по X с учетом секции
          y: y, // Позиция по Y с учетом секции
        },
        delay: Math.random() * 10, // Задержка анимации от 0 до 10 секунд
        duration: Math.random() * 30 + 30, // Длительность анимации от 30 до 60 секунд
        opacity: Math.random() * 0.25 + 0.05, // Прозрачность от 0.05 до 0.3
        rotation: Math.random() * 360, // Случайный поворот от 0 до 360 градусов
        scale: Math.random() * 0.3 + 0.7, // Масштаб от 0.7 до 1.0
      })
    }

    setMonsters(newMonsters)
  }, [isMobile])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {monsters.map((monster, index) => (
        <Monster key={index} {...monster} />
      ))}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function BnbBackgroundEffect() {
  const { isMobile } = useMobile()
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      opacity: number
      speed: number
      delay: number
    }>
  >([])

  const [glows, setGlows] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      opacity: number
      delay: number
    }>
  >([])

  useEffect(() => {
    // Создаем частицы
    const particleCount = isMobile ? 10 : 20 // Уменьшаем количество для лучшей производительности
    const newParticles = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })
    }

    setParticles(newParticles)

    // Создаем свечения
    const glowCount = isMobile ? 2 : 4 // Уменьшаем количество для лучшей производительности
    const newGlows = []

    for (let i = 0; i < glowCount; i++) {
      newGlows.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 200 + 100,
        opacity: Math.random() * 0.15 + 0.05,
        delay: Math.random() * 5,
      })
    }

    setGlows(newGlows)
  }, [isMobile])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Свечения */}
      {glows.map((glow) => (
        <div
          key={`glow-${glow.id}`}
          className="absolute rounded-full bnb-float"
          style={{
            left: `${glow.x}%`,
            top: `${glow.y}%`,
            width: `${glow.size}px`,
            height: `${glow.size}px`,
            opacity: glow.opacity,
            background: "radial-gradient(circle, rgba(255, 204, 0, 0.3) 0%, rgba(255, 204, 0, 0) 70%)",
            animationDelay: `${glow.delay}s`,
            filter: "blur(30px)",
          }}
        />
      ))}

      {/* Частицы */}
      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bnb-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: "rgba(255, 204, 0, 0.8)",
            animationDuration: `${particle.speed}s`,
            animationDelay: `${particle.delay}s`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  )
}

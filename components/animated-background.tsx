"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Устанавливаем размер canvas на полный экран
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Создаем массив частиц
    const particles: Particle[] = []
    const particleCount = Math.min(Math.max(window.innerWidth / 20, 20), 80) // Адаптивное количество частиц

    // Цвета для частиц
    const colors = [
      "rgba(50, 50, 255, 0.5)", // Синий
      "rgba(100, 50, 200, 0.5)", // Фиолетовый
      "rgba(200, 50, 100, 0.5)", // Розовый
      "rgba(255, 50, 50, 0.5)", // Красный
      "rgba(50, 200, 50, 0.5)", // Зеленый
    ]

    // Инициализируем частицы
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1, // Маленькие частицы
        speedX: (Math.random() - 0.5) * 0.2, // Медленное движение
        speedY: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1, // Низкая непрозрачность
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002, // Медленное вращение
      })
    }

    // Функция анимации
    const animate = () => {
      // Черный фон
      ctx.fillStyle = "rgba(0, 0, 0, 0.98)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Рисуем и обновляем частицы
      particles.forEach((particle) => {
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.globalAlpha = particle.opacity

        // Рисуем светящуюся частицу
        ctx.beginPath()
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Добавляем свечение
        ctx.shadowBlur = 5
        ctx.shadowColor = particle.color
        ctx.fill()

        ctx.restore()

        // Обновляем позицию и вращение
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        // Отражаем частицы от краев
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }
      })

      // Добавляем эффект "созвездий" - соединяем близкие частицы линиями
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 100 // Максимальное расстояние для соединения

          if (distance < maxDistance) {
            // Градиентная прозрачность линий в зависимости от расстояния
            const opacity = 0.1 * (1 - distance / maxDistance)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(100, 100, 255, ${opacity})`
            ctx.lineWidth = 0.2 // Тонкие линии
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [theme])

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true" />
  )
}

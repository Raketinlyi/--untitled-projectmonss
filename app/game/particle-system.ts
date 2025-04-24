// Интерфейс частицы
interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX?: number
  speedY?: number
  life: number
  decay?: number
  vx?: number
  vy?: number
  maxLife?: number
  type?: string
  gravity?: number
  rotation?: number
  rotationSpeed?: number
  opacity?: number
  blendMode?: GlobalCompositeOperation
  text?: string
  trail?: boolean
  trailColor?: string
  scale?: number
  scaleSpeed?: number
}

// Система частиц для визуальных эффектов
export class ParticleSystem {
  private particles: Particle[] = []
  private ctx: CanvasRenderingContext2D
  private maxParticles = 300 // Увеличиваем максимальное количество частиц для более богатых эффектов
  private trailParticles: Particle[] = [] // Отдельный массив для частиц следа

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  // Создание эффекта взрыва при уничтожении монстра
  createExplosion(x: number, y: number, color: string, particleCount: number, enhanced = false): void {
    // Проверяем, не превышаем ли лимит частиц
    if (this.particles.length > this.maxParticles) {
      // Если превышаем, удаляем старые частицы
      this.particles = this.particles.slice(-this.maxParticles / 2)
    }

    try {
      // Ограничиваем количество создаваемых частиц на слабых устройствах
      const actualCount = window.innerWidth < 768 ? Math.min(particleCount, 15) : particleCount

      for (let i = 0; i < actualCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = enhanced ? 1 + Math.random() * 4 : 0.5 + Math.random() * 3
        const size = enhanced ? 2 + Math.random() * 5 : 1 + Math.random() * 4
        const life = enhanced ? 30 + Math.random() * 30 : 20 + Math.random() * 20
        const particleType = Math.random() > 0.7 ? "star" : Math.random() > 0.5 ? "square" : "circle"
        const gravity = Math.random() * 0.05
        const rotation = Math.random() * Math.PI * 2
        const rotationSpeed = (Math.random() - 0.5) * 0.2
        const opacity = 0.7 + Math.random() * 0.3
        const blendMode = Math.random() > 0.7 ? "lighter" : "source-over"
        const trail = Math.random() > 0.8
        const scale = 1.0
        const scaleSpeed = -0.01 - Math.random() * 0.02

        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: particleType === "star" ? size * 1.5 : size,
          color,
          life,
          maxLife: life,
          type: particleType,
          gravity,
          rotation,
          rotationSpeed,
          opacity,
          blendMode: blendMode as GlobalCompositeOperation,
          trail,
          trailColor: this.adjustColor(color, -30),
          scale,
          scaleSpeed,
        })
      }

      // Add a flash effect for enhanced explosions
      if (enhanced) {
        this.particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          size: 40,
          color: "white",
          life: 8,
          maxLife: 8,
          type: "flash",
          opacity: 0.8,
          blendMode: "lighter",
        })
      }
    } catch (error) {
      console.error("Error creating explosion:", error)
    }
  }

  // Создание следа за снарядом - делаем более быстро исчезающим и менее заметным
  createProjectileTrail(x: number, y: number, color: string, fromBoss: boolean): void {
    try {
      // Уменьшаем размер следа
      const trailSize = fromBoss ? 12 : 8 // Уменьшаем с 15/10 до 12/8

      // Уменьшаем время жизни частиц
      const life = 5 + Math.random() * 5 // Уменьшаем с 10-20 до 5-10

      // Увеличиваем скорость исчезновения
      const scaleSpeed = -0.15 // Увеличиваем с -0.08 до -0.15

      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4, // Немного увеличиваем разброс движения
        vy: (Math.random() - 0.5) * 0.4,
        size: trailSize * (0.4 + Math.random() * 0.4), // Уменьшаем размер частиц
        color,
        life,
        maxLife: life,
        type: "circle",
        opacity: 0.2 + Math.random() * 0.15, // Уменьшаем непрозрачность
        blendMode: "lighter",
        scale: 1.0,
        scaleSpeed: scaleSpeed,
      })
    } catch (error) {
      console.error("Error creating projectile trail:", error)
    }
  }

  // Создание эффекта появления монстра
  createMonsterSpawnEffect(x: number, y: number, size: number, isBoss: boolean): void {
    try {
      const particleCount = isBoss ? 30 : 15
      const color = isBoss ? "#FF5500" : "#00FF00"

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = size * 0.6 * Math.random()
        const particleX = x + Math.cos(angle) * distance
        const particleY = y + Math.sin(angle) * distance
        const particleSize = 2 + Math.random() * 4
        const life = 20 + Math.random() * 20

        this.particles.push({
          x: particleX,
          y: particleY,
          vx: Math.cos(angle) * 0.5,
          vy: Math.sin(angle) * 0.5,
          size: particleSize,
          color,
          life,
          maxLife: life,
          type: "circle",
          opacity: 0.7,
          blendMode: "lighter",
          scale: 1.0,
          scaleSpeed: -0.02,
        })
      }

      // Добавляем круговую волну
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: size * 0.8,
        color: isBoss ? "#FF0000" : "#00FF00",
        life: 15,
        maxLife: 15,
        type: "ring",
        opacity: 0.7,
        scale: 0.5,
        scaleSpeed: 0.05,
      })
    } catch (error) {
      console.error("Error creating monster spawn effect:", error)
    }
  }

  // Создание эффекта сбора бонуса
  createBonusCollectEffect(x: number, y: number, bonusType: string): void {
    try {
      let color: string
      let text: string

      switch (bonusType) {
        case "points":
          color = "#FFFF00"
          text = "+2x"
          break
        case "life":
          color = "#FF0000"
          text = "❤️"
          break
        case "slowdown":
          color = "#00FFFF"
          text = "⏱️"
          break
        case "shield":
          color = "#0000FF"
          text = "🛡️"
          break
        case "energy":
          color = "#FF00FF"
          text = "⚡"
          break
        default:
          color = "#FFFFFF"
          text = "🎁"
      }

      // Создаем частицы разлетающиеся от центра
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 2
        const size = 2 + Math.random() * 3
        const life = 20 + Math.random() * 10

        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size,
          color,
          life,
          maxLife: life,
          type: "circle",
          opacity: 0.8,
          blendMode: "lighter",
        })
      }

      // Создаем текстовую частицу, которая поднимается вверх
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: -1.5,
        size: 20,
        color: "white",
        life: 40,
        maxLife: 40,
        type: "text",
        text,
        opacity: 1.0,
      })

      // Создаем кольцевую волну
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 30,
        color,
        life: 20,
        maxLife: 20,
        type: "ring",
        opacity: 0.7,
        scale: 0.5,
        scaleSpeed: 0.1,
      })
    } catch (error) {
      console.error("Error creating bonus collect effect:", error)
    }
  }

  // Создание эффекта щита
  createShieldEffect(x: number, y: number, radius: number): void {
    try {
      // Создаем частицы, движущиеся по окружности щита
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const particleX = x + Math.cos(angle) * radius
        const particleY = y + Math.sin(angle) * radius
        const life = 20 + Math.random() * 10

        this.particles.push({
          x: particleX,
          y: particleY,
          vx: Math.cos(angle + Math.PI / 2) * 2,
          vy: Math.sin(angle + Math.PI / 2) * 2,
          size: 3 + Math.random() * 2,
          color: "#00FFFF",
          life,
          maxLife: life,
          type: "circle",
          opacity: 0.7,
          blendMode: "lighter",
        })
      }
    } catch (error) {
      console.error("Error creating shield effect:", error)
    }
  }

  // Вспомогательный метод для изменения яркости цвета
  private adjustColor(color: string, amount: number): string {
    // Преобразуем hex в rgb
    let r = Number.parseInt(color.substring(1, 3), 16)
    let g = Number.parseInt(color.substring(3, 5), 16)
    let b = Number.parseInt(color.substring(5, 7), 16)

    // Изменяем яркость
    r = Math.max(0, Math.min(255, r + amount))
    g = Math.max(0, Math.min(255, g + amount))
    b = Math.max(0, Math.min(255, b + amount))

    // Преобразуем обратно в hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  // Обновление и отрисовка всех частиц
  update(): void {
    try {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]

        // Обновляем позицию
        if (p.vx !== undefined && p.vy !== undefined) {
          p.x += p.vx
          p.y += p.vy

          // Применяем гравитацию, если она задана
          if (p.gravity) {
            p.vy += p.gravity
          }
        } else if (p.speedX !== undefined && p.speedY !== undefined) {
          p.x += p.speedX
          p.y += p.speedY
        }

        // Обновляем масштаб, если задан
        if (p.scale !== undefined && p.scaleSpeed !== undefined) {
          p.scale += p.scaleSpeed
          if (p.scale <= 0) p.scale = 0.01
        }

        // Обновляем вращение, если задано
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed
        }

        // Создаем след, если нужно
        if (p.trail && p.life > 5) {
          this.createTrailParticle(p)
        }

        // Уменьшаем жизнь
        p.life--

        // Удаляем мертвые частицы
        if (p.life <= 0) {
          this.particles.splice(i, 1)
          continue
        }

        // Вычисляем прозрачность на основе оставшейся жизни
        const alpha = p.opacity !== undefined ? p.opacity * (p.life / (p.maxLife || 1)) : p.life / (p.maxLife || 1)

        // Устанавливаем режим наложения, если задан
        if (p.blendMode) {
          this.ctx.globalCompositeOperation = p.blendMode
        }

        this.ctx.globalAlpha = alpha

        // Отрисовываем частицу в зависимости от типа
        this.drawParticle(p, alpha)

        // Возвращаем режим наложения в исходное состояние
        this.ctx.globalCompositeOperation = "source-over"
      }

      this.ctx.globalAlpha = 1
    } catch (error) {
      console.error("Error updating particles:", error)
      // В случае ошибки очищаем все частицы
      this.particles = []
    }
  }

  // Метод для отрисовки частицы в зависимости от типа
  private drawParticle(p: Particle, alpha: number): void {
    const size = p.size * (p.scale || 1)

    switch (p.type) {
      case "square":
        // Отрисовка квадрата с возможным вращением
        this.ctx.save()
        this.ctx.translate(p.x, p.y)
        if (p.rotation) {
          this.ctx.rotate(p.rotation)
        }
        this.ctx.fillStyle = p.color
        this.ctx.fillRect(-size / 2, -size / 2, size, size)
        this.ctx.restore()
        break

      case "star":
        // Отрисовка звезды
        this.ctx.save()
        this.ctx.translate(p.x, p.y)
        if (p.rotation) {
          this.ctx.rotate(p.rotation)
        }
        this.ctx.fillStyle = p.color
        this.drawStar(0, 0, 5, size / 2, size / 4)
        this.ctx.restore()
        break

      case "ring":
        // Отрисовка кольца
        this.ctx.strokeStyle = p.color
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        this.ctx.stroke()
        break

      case "flash":
        // Отрисовка вспышки
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size)
        gradient.addColorStop(0, `${p.color}`)
        gradient.addColorStop(1, "transparent")
        this.ctx.fillStyle = gradient
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        this.ctx.fill()
        break

      case "text":
        // Отрисовка текста
        if (p.text) {
          this.ctx.fillStyle = p.color
          this.ctx.font = `${size}px Arial`
          this.ctx.textAlign = "center"
          this.ctx.textBaseline = "middle"
          this.ctx.fillText(p.text, p.x, p.y)
        }
        break

      default:
        // Отрисовка круга (по умолчанию)
        this.ctx.fillStyle = p.color
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        this.ctx.fill()
    }
  }

  // Метод для создания частицы следа
  private createTrailParticle(p: Particle): void {
    if (!p.trailColor) return

    this.particles.push({
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      size: p.size * 0.7,
      color: p.trailColor,
      life: 5,
      maxLife: 5,
      type: p.type,
      opacity: 0.3,
      scale: p.scale ? p.scale * 0.9 : 0.9,
    })
  }

  // Метод для отрисовки звезды
  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    this.ctx.beginPath()
    this.ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      this.ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      this.ctx.lineTo(x, y)
      rot += step
    }

    this.ctx.lineTo(cx, cy - outerRadius)
    this.ctx.closePath()
    this.ctx.fill()
  }

  // Очистка всех частиц
  clear(): void {
    this.particles = []
  }

  // Получение количества активных частиц
  getParticleCount(): number {
    return this.particles.length
  }
}

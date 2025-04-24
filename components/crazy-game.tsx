"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface Monster {
  x: number
  y: number
  speed: number
  health: number
  size: number
  color: string
  type: "normal" | "boss"
  isDead: boolean
}

interface Projectile {
  x: number
  y: number
  speed: number
  damage: number
  size: number
  color: string
  angle: number
}

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  alpha: number
  rotation: number
}

interface Explosion {
  x: number
  y: number
  size: number
  particles: Particle[]
  duration: number
  currentTime: number
}

export function CrazyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [explosions, setExplosions] = useState<Explosion[]>([])
  const [lastMonsterSpawn, setLastMonsterSpawn] = useState(0)
  const [lastShot, setLastShot] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [backgroundOffset, setBackgroundOffset] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Звуковые эффекты (16-бит)
  const shootSound = useRef<HTMLAudioElement | null>(null)
  const hitSound = useRef<HTMLAudioElement | null>(null)
  const explosionSound = useRef<HTMLAudioElement | null>(null)
  const gameOverSound = useRef<HTMLAudioElement | null>(null)
  const levelUpSound = useRef<HTMLAudioElement | null>(null)
  const monsterSound = useRef<HTMLAudioElement | null>(null)

  // Загрузка изображений
  const [images, setImages] = useState<{
    defender: HTMLImageElement | null
    monster1: HTMLImageElement | null
    monster2: HTMLImageElement | null
    boss: HTMLImageElement | null
    background: HTMLImageElement | null
    projectile: HTMLImageElement | null
  }>({
    defender: null,
    monster1: null,
    monster2: null,
    boss: null,
    background: null,
    projectile: null,
  })

  // Инициализация звуков и изображений
  useEffect(() => {
    // Инициализация звуков
    shootSound.current = new Audio("/sounds/16bit-shoot.mp3")
    hitSound.current = new Audio("/sounds/16bit-hit.mp3")
    explosionSound.current = new Audio("/sounds/16bit-explosion.mp3")
    gameOverSound.current = new Audio("/sounds/16bit-gameover.mp3")
    levelUpSound.current = new Audio("/sounds/16bit-levelup.mp3")
    monsterSound.current = new Audio("/sounds/monster-click-16bit.mp3") // Используем существующий звук

    // Загрузка изображений с использованием placeholder.svg
    const defenderImg = new Image()
    defenderImg.src = "/placeholder.svg?height=60&width=60&text=Defender"
    defenderImg.crossOrigin = "anonymous"

    const monster1Img = new Image()
    monster1Img.src = "/placeholder.svg?height=80&width=80&text=Monster1"
    monster1Img.crossOrigin = "anonymous"

    const monster2Img = new Image()
    monster2Img.src = "/placeholder.svg?height=80&width=80&text=Monster2"
    monster2Img.crossOrigin = "anonymous"

    const bossImg = new Image()
    bossImg.src = "/placeholder.svg?height=120&width=120&text=Boss"
    bossImg.crossOrigin = "anonymous"

    const bgImg = new Image()
    bgImg.src = "/placeholder.svg?height=600&width=800&text=GameBG"
    bgImg.crossOrigin = "anonymous"

    const projectileImg = new Image()
    projectileImg.src = "/placeholder.svg?height=20&width=40&text=Laser"
    projectileImg.crossOrigin = "anonymous"

    // Установка изображений после загрузки
    defenderImg.onload = () => setImages((prev) => ({ ...prev, defender: defenderImg }))
    monster1Img.onload = () => setImages((prev) => ({ ...prev, monster1: monster1Img }))
    monster2Img.onload = () => setImages((prev) => ({ ...prev, monster2: monster2Img }))
    bossImg.onload = () => setImages((prev) => ({ ...prev, boss: bossImg }))
    bgImg.onload = () => setImages((prev) => ({ ...prev, background: bgImg }))
    projectileImg.onload = () => setImages((prev) => ({ ...prev, projectile: projectileImg }))

    console.log("Загрузка изображений и звуков инициализирована")

    return () => {
      // Очистка ресурсов при размонтировании
    }
  }, [])

  // Функция для воспроизведения звука
  const playSound = (sound: HTMLAudioElement | null) => {
    if (sound && soundEnabled) {
      sound.currentTime = 0
      sound.play().catch((e) => console.error("Ошибка воспроизведения звука:", e))
    }
  }

  // Обработчик движения мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Обработчик клика мыши (стрельба)
  useEffect(() => {
    const handleClick = () => {
      if (!gameStarted || gameOver) return

      const now = Date.now()
      // Ограничение скорострельности (200мс между выстрелами)
      if (now - lastShot < 200) return

      setLastShot(now)

      const canvas = canvasRef.current
      if (!canvas) return

      const centerX = canvas.width / 2
      const centerY = canvas.height - 100

      // Вычисление угла выстрела
      const angle = Math.atan2(mousePosition.y - centerY, mousePosition.x - centerX)

      // Создание нового снаряда
      const newProjectile: Projectile = {
        x: centerX,
        y: centerY,
        speed: 10,
        damage: 10 + Math.floor(level / 3),
        size: 8,
        color: "#00ffff",
        angle,
      }

      setProjectiles((prev) => [...prev, newProjectile])
      playSound(shootSound.current)
    }

    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, [gameStarted, gameOver, lastShot, mousePosition, level])

  // Основной игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const gameLoop = () => {
      // Отладочная информация
      console.log("Игровой цикл работает, изображения:", {
        defender: images.defender ? "загружено" : "не загружено",
        monster1: images.monster1 ? "загружено" : "не загружено",
        monster2: images.monster2 ? "загружено" : "не загружено",
        boss: images.boss ? "загружено" : "не загружено",
        background: images.background ? "загружено" : "не загружено",
        projectile: images.projectile ? "загружено" : "не загружено",
      })

      // Очистка холста
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Отрисовка фона с параллакс-эффектом
      if (images.background) {
        const bgWidth = images.background.width
        const bgHeight = images.background.height

        // Смещение фона для эффекта параллакса
        setBackgroundOffset((prev) => (prev + 0.5) % bgWidth)

        // Отрисовка фона с повторением
        for (let i = -1; i < canvas.width / bgWidth + 1; i++) {
          ctx.drawImage(images.background, i * bgWidth - backgroundOffset, 0, bgWidth, canvas.height)
        }
      } else {
        // Запасной вариант, если изображение не загружено
        ctx.fillStyle = "#111122"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Звезды на фоне
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const size = Math.random() * 2 + 1
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Спавн монстров
      const now = Date.now()
      if (now - lastMonsterSpawn > 2000 - level * 100) {
        setLastMonsterSpawn(now)

        // Определение типа монстра (обычный или босс)
        const isBoss = Math.random() < 0.1 && level > 3

        // Создание нового монстра
        const newMonster: Monster = {
          x: Math.random() * (canvas.width - 100) + 50,
          y: -50,
          speed: 1 + Math.random() * (level * 0.2),
          health: isBoss ? 100 + level * 20 : 20 + level * 5,
          size: isBoss ? 80 : 40 + Math.random() * 20,
          color: isBoss ? "#ff0000" : `hsl(${Math.random() * 360}, 70%, 50%)`,
          type: isBoss ? "boss" : "normal",
          isDead: false,
        }

        setMonsters((prev) => [...prev, newMonster])
        playSound(monsterSound.current)
      }

      // Обновление и отрисовка защитника (игрока)
      const centerX = canvas.width / 2
      const centerY = canvas.height - 100

      if (images.defender) {
        ctx.save()
        // Вычисление угла поворота к курсору
        const angle = Math.atan2(mousePosition.y - centerY, mousePosition.x - centerX)
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)
        ctx.drawImage(images.defender, -30, -30, 60, 60)
        ctx.restore()
      } else {
        // Запасной вариант, если изображение не загружено
        ctx.fillStyle = "#00ff00"
        ctx.beginPath()
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
        ctx.fill()

        // Пушка, направленная к курсору
        const angle = Math.atan2(mousePosition.y - centerY, mousePosition.x - centerX)
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)
        ctx.fillStyle = "#cccccc"
        ctx.fillRect(0, -5, 30, 10)
        ctx.restore()
      }

      // Обновление и отрисовка снарядов
      setProjectiles((prev) => {
        return prev
          .map((projectile) => {
            // Обновление позиции снаряда
            const updatedProjectile = {
              ...projectile,
              x: projectile.x + Math.cos(projectile.angle) * projectile.speed,
              y: projectile.y + Math.sin(projectile.angle) * projectile.speed,
            }

            // Отрисовка снаряда
            if (images.projectile) {
              ctx.save()
              ctx.translate(updatedProjectile.x, updatedProjectile.y)
              ctx.rotate(updatedProjectile.angle)
              ctx.drawImage(
                images.projectile,
                -updatedProjectile.size,
                -updatedProjectile.size / 2,
                updatedProjectile.size * 2,
                updatedProjectile.size,
              )
              ctx.restore()
            } else {
              // Запасной вариант
              ctx.fillStyle = updatedProjectile.color
              ctx.beginPath()
              ctx.arc(updatedProjectile.x, updatedProjectile.y, updatedProjectile.size, 0, Math.PI * 2)
              ctx.fill()

              // Свечение
              ctx.fillStyle = `rgba(0, 255, 255, 0.3)`
              ctx.beginPath()
              ctx.arc(updatedProjectile.x, updatedProjectile.y, updatedProjectile.size * 2, 0, Math.PI * 2)
              ctx.fill()
            }

            // Проверка выхода за границы
            if (
              updatedProjectile.x < -50 ||
              updatedProjectile.x > canvas.width + 50 ||
              updatedProjectile.y < -50 ||
              updatedProjectile.y > canvas.height + 50
            ) {
              return null // Удаление снаряда, вышедшего за границы
            }

            return updatedProjectile
          })
          .filter(Boolean) as Projectile[] // Фильтрация null значений
      })

      // Обновление и отрисовка монстров
      setMonsters((prev) => {
        return prev
          .map((monster) => {
            if (monster.isDead) return null

            // Обновление позиции монстра
            const updatedMonster = {
              ...monster,
              y: monster.y + monster.speed,
            }

            // Отрисовка монстра
            const monsterImage =
              monster.type === "boss" ? images.boss : Math.random() > 0.5 ? images.monster1 : images.monster2

            if (monsterImage) {
              ctx.drawImage(
                monsterImage,
                updatedMonster.x - updatedMonster.size / 2,
                updatedMonster.y - updatedMonster.size / 2,
                updatedMonster.size,
                updatedMonster.size,
              )
            } else {
              // Отрисовка монстра (запасной вариант)
              ctx.fillStyle = updatedMonster.color
              ctx.beginPath()
              ctx.arc(updatedMonster.x, updatedMonster.y, updatedMonster.size / 2, 0, Math.PI * 2)
              ctx.fill()

              // Добавляем свечение
              ctx.beginPath()
              const glowRadius = (updatedMonster.size / 2) * 1.3
              const gradient = ctx.createRadialGradient(
                updatedMonster.x,
                updatedMonster.y,
                0,
                updatedMonster.x,
                updatedMonster.y,
                glowRadius,
              )
              gradient.addColorStop(0, updatedMonster.color)
              gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
              ctx.fillStyle = gradient
              ctx.arc(updatedMonster.x, updatedMonster.y, glowRadius, 0, Math.PI * 2)
              ctx.fill()

              // Глаза
              ctx.fillStyle = "#ffffff"
              ctx.beginPath()
              ctx.arc(
                updatedMonster.x - updatedMonster.size / 5,
                updatedMonster.y - updatedMonster.size / 6,
                updatedMonster.size / 10,
                0,
                Math.PI * 2,
              )
              ctx.fill()
              ctx.beginPath()
              ctx.arc(
                updatedMonster.x + updatedMonster.size / 5,
                updatedMonster.y - updatedMonster.size / 6,
                updatedMonster.size / 10,
                0,
                Math.PI * 2,
              )
              ctx.fill()

              // Зрачки
              ctx.fillStyle = updatedMonster.type === "boss" ? "#ff0000" : "#000000"
              ctx.beginPath()
              ctx.arc(
                updatedMonster.x - updatedMonster.size / 5,
                updatedMonster.y - updatedMonster.size / 6,
                updatedMonster.size / 20,
                0,
                Math.PI * 2,
              )
              ctx.fill()
              ctx.beginPath()
              ctx.arc(
                updatedMonster.x + updatedMonster.size / 5,
                updatedMonster.y - updatedMonster.size / 6,
                updatedMonster.size / 20,
                0,
                Math.PI * 2,
              )
              ctx.fill()

              // Рот
              if (updatedMonster.type === "boss") {
                // Злой рот для босса
                ctx.fillStyle = "#000000"
                ctx.beginPath()
                ctx.arc(
                  updatedMonster.x,
                  updatedMonster.y + updatedMonster.size / 6,
                  updatedMonster.size / 6,
                  0,
                  Math.PI,
                )
                ctx.fill()

                // Зубы
                ctx.fillStyle = "#ffffff"
                const teethCount = 3
                const teethWidth = updatedMonster.size / 10
                for (let i = 0; i < teethCount; i++) {
                  ctx.beginPath()
                  ctx.moveTo(
                    updatedMonster.x - updatedMonster.size / 8 + i * teethWidth,
                    updatedMonster.y + updatedMonster.size / 6,
                  )
                  ctx.lineTo(
                    updatedMonster.x - updatedMonster.size / 8 + (i + 0.5) * teethWidth,
                    updatedMonster.y + updatedMonster.size / 4,
                  )
                  ctx.lineTo(
                    updatedMonster.x - updatedMonster.size / 8 + (i + 1) * teethWidth,
                    updatedMonster.y + updatedMonster.size / 6,
                  )
                  ctx.fill()
                }
              } else {
                // Обычный рот
                ctx.fillStyle = "#000000"
                ctx.beginPath()
                ctx.arc(
                  updatedMonster.x,
                  updatedMonster.y + updatedMonster.size / 6,
                  updatedMonster.size / 8,
                  0,
                  Math.PI,
                )
                ctx.fill()
              }
            }

            // Полоска здоровья
            const healthBarWidth = updatedMonster.size
            const healthBarHeight = 5
            const healthPercentage =
              updatedMonster.health / (updatedMonster.type === "boss" ? 100 + level * 20 : 20 + level * 5)

            ctx.fillStyle = "#333333"
            ctx.fillRect(
              updatedMonster.x - healthBarWidth / 2,
              updatedMonster.y - updatedMonster.size / 2 - 15,
              healthBarWidth,
              healthBarHeight,
            )

            ctx.fillStyle = healthPercentage > 0.6 ? "#00ff00" : healthPercentage > 0.3 ? "#ffff00" : "#ff0000"
            ctx.fillRect(
              updatedMonster.x - healthBarWidth / 2,
              updatedMonster.y - updatedMonster.size / 2 - 15,
              healthBarWidth * healthPercentage,
              healthBarHeight,
            )

            // Проверка достижения нижней границы
            if (updatedMonster.y > canvas.height + 50) {
              // Монстр достиг нижней границы - урон игроку
              setPlayerHealth((prev) => {
                const damage = updatedMonster.type === "boss" ? 20 : 10
                const newHealth = Math.max(0, prev - damage)

                if (newHealth <= 0) {
                  setGameOver(true)
                  playSound(gameOverSound.current)
                }

                return newHealth
              })

              return null // Удаление монстра
            }

            return updatedMonster
          })
          .filter(Boolean) as Monster[] // Фильтрация null значений
      })

      // Обновление и отрисовка взрывов
      setExplosions((prev) => {
        return prev
          .map((explosion) => {
            // Обновление времени взрыва
            const updatedExplosion = {
              ...explosion,
              currentTime: explosion.currentTime + 16, // Примерно 16мс на кадр при 60fps
            }

            // Проверка окончания взрыва
            if (updatedExplosion.currentTime >= updatedExplosion.duration) {
              return null // Удаление завершенного взрыва
            }

            // Отрисовка частиц взрыва
            const progress = updatedExplosion.currentTime / updatedExplosion.duration

            updatedExplosion.particles.forEach((particle) => {
              const alpha = 1 - progress
              ctx.save()
              ctx.translate(
                explosion.x + particle.speedX * progress * explosion.size,
                explosion.y + particle.speedY * progress * explosion.size,
              )
              ctx.rotate(particle.rotation * progress)
              ctx.globalAlpha = alpha * particle.alpha
              ctx.fillStyle = particle.color
              ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
              ctx.restore()
            })

            return updatedExplosion
          })
          .filter(Boolean) as Explosion[] // Фильтрация null значений
      })

      // Проверка столкновений снарядов с монстрами
      let scoreIncrease = 0

      setProjectiles((prev) => {
        const remainingProjectiles: Projectile[] = []

        for (const projectile of prev) {
          let hitMonster = false

          setMonsters((prevMonsters) => {
            return prevMonsters.map((monster) => {
              // Проверка столкновения
              const dx = projectile.x - monster.x
              const dy = projectile.y - monster.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < monster.size / 2 + projectile.size) {
                // Столкновение произошло
                hitMonster = true

                // Уменьшение здоровья монстра
                const updatedMonster = {
                  ...monster,
                  health: monster.health - projectile.damage,
                }

                // Проверка смерти монстра
                if (updatedMonster.health <= 0) {
                  // Монстр уничтожен
                  playSound(explosionSound.current)

                  // Создание взрыва
                  const particleCount = monster.type === "boss" ? 30 : 15
                  const particles: Particle[] = []

                  for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * Math.PI * 2
                    const speed = Math.random() * 2 + 1

                    particles.push({
                      x: 0,
                      y: 0,
                      size: Math.random() * 10 + 5,
                      color: monster.color,
                      speedX: Math.cos(angle) * speed,
                      speedY: Math.sin(angle) * speed,
                      alpha: Math.random() * 0.5 + 0.5,
                      rotation: Math.random() * Math.PI * 4,
                    })
                  }

                  setExplosions((prev) => [
                    ...prev,
                    {
                      x: monster.x,
                      y: monster.y,
                      size: monster.size,
                      particles,
                      duration: 1000,
                      currentTime: 0,
                    },
                  ])

                  // Увеличение счета
                  const points = monster.type === "boss" ? 100 : 10
                  scoreIncrease += points

                  // Пометка монстра как мертвого
                  return {
                    ...updatedMonster,
                    isDead: true,
                  }
                } else {
                  // Монстр получил урон, но жив
                  playSound(hitSound.current)
                  return updatedMonster
                }
              }

              return monster
            })
          })

          if (!hitMonster) {
            remainingProjectiles.push(projectile)
          }
        }

        return remainingProjectiles
      })

      // Обновление счета
      if (scoreIncrease > 0) {
        setScore((prev) => {
          const newScore = prev + scoreIncrease

          // Проверка повышения уровня (каждые 500 очков)
          if (Math.floor(newScore / 500) > Math.floor(prev / 500)) {
            setLevel((prevLevel) => {
              const newLevel = prevLevel + 1
              playSound(levelUpSound.current)
              return newLevel
            })
          }

          return newScore
        })
      }

      // Отрисовка интерфейса
      // Полоска здоровья игрока
      const healthBarWidth = 200
      const healthBarHeight = 20
      const healthPercentage = playerHealth / 100

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(20, 20, healthBarWidth, healthBarHeight)

      ctx.fillStyle = healthPercentage > 0.6 ? "#00ff00" : healthPercentage > 0.3 ? "#ffff00" : "#ff0000"
      ctx.fillRect(20, 20, healthBarWidth * healthPercentage, healthBarHeight)

      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.fillText(`Здоровье: ${playerHealth}%`, 25, 35)

      // Счет и уровень
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(canvas.width - 150, 20, 130, 60)

      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial"
      ctx.fillText(`Счет: ${score}`, canvas.width - 140, 40)
      ctx.fillText(`Уровень: ${level}`, canvas.width - 140, 65)

      // Запуск следующего кадра
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, gameOver, lastMonsterSpawn, level, mousePosition, backgroundOffset, images, soundEnabled])

  // Отрисовка экрана "Игра окончена"
  useEffect(() => {
    if (!gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Затемнение экрана
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Текст "Игра окончена"
    ctx.fillStyle = "#ff0000"
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2 - 50)

    // Счет
    ctx.fillStyle = "#ffffff"
    ctx.font = "24px Arial"
    ctx.fillText(`Ваш счет: ${score}`, canvas.width / 2, canvas.height / 2)
    ctx.fillText(`Уровень: ${level}`, canvas.width / 2, canvas.height / 2 + 40)

    // Инструкция для перезапуска
    ctx.fillStyle = "#00ff00"
    ctx.font = "20px Arial"
    ctx.fillText('Нажмите кнопку "Начать заново" для новой игры', canvas.width / 2, canvas.height / 2 + 100)
  }, [gameOver, score, level])

  // Функция начала игры
  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLevel(1)
    setPlayerHealth(100)
    setMonsters([])
    setProjectiles([])
    setExplosions([])
    setLastMonsterSpawn(Date.now())
  }

  // Функция перезапуска игры
  const restartGame = () => {
    startGame()
  }

  // Функция переключения звука
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  // Настройка размера холста при монтировании
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = 800
    canvas.height = 600

    // Отрисовка начального экрана
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Фон
    ctx.fillStyle = "#111122"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Звезды
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2 + 1
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Заголовок
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Monster Defender", canvas.width / 2, canvas.height / 2 - 50)

    // Инструкция
    ctx.fillStyle = "#aaaaff"
    ctx.font = "20px Arial"
    ctx.fillText('Нажмите "Начать игру" для старта', canvas.width / 2, canvas.height / 2 + 50)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative">
        <canvas ref={canvasRef} className="border-4 border-gray-800 rounded-lg shadow-lg" />

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <h2 className="text-4xl font-bold text-white mb-8">Защитник от Монстров</h2>
            <p className="text-xl text-white mb-8 max-w-md text-center">
              Защитите свою базу от наступающих монстров! Используйте мышь для прицеливания и клик для стрельбы.
            </p>
            <Button onClick={startGame} className="px-8 py-4 text-xl bg-green-600 hover:bg-green-700">
              Начать игру
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {gameOver && (
          <Button onClick={restartGame} className="px-6 py-2 bg-green-600 hover:bg-green-700">
            Начать заново
          </Button>
        )}

        <Button onClick={toggleSound} className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
          {soundEnabled ? "Выключить звук" : "Включить звук"}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold">Инструкция:</h3>
        <ul className="list-disc list-inside text-left">
          <li>Используйте мышь для прицеливания</li>
          <li>Кликайте для стрельбы по монстрам</li>
          <li>Не позволяйте монстрам достичь нижней части экрана</li>
          <li>Босс-монстры (красные) имеют больше здоровья и наносят больше урона</li>
        </ul>
      </div>
    </div>
  )
}

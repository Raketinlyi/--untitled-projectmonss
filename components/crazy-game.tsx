"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { BnbMonsterLogo } from "@/components/bnb-monster-logo"

interface Monster {
  x: number
  y: number
  speed: number
  health: number
  size: number
  color: string
  type: "normal" | "boss"
  isDead: boolean
  monsterType?: string // Добавляем тип монстра из коллекции BNBMonster
  scale?: number // Для эффекта дыхания
  rotation?: number // Для эффекта вращения
}

interface Projectile {
  x: number
  y: number
  speed: number
  damage: number
  size: number
  color: string
  angle: number
  isBNB?: boolean // Новый флаг для BNB-монет в качестве снарядов
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

interface PowerUp {
  x: number
  y: number
  type: "health" | "speed" | "damage" | "shield" | "coin"
  size: number
  duration: number
  collected: boolean
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
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [lastMonsterSpawn, setLastMonsterSpawn] = useState(0)
  const [lastShot, setLastShot] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [backgroundOffset, setBackgroundOffset] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [combo, setCombo] = useState(0)
  const [comboTimer, setComboTimer] = useState<NodeJS.Timeout | null>(null)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [bnbCollected, setBnbCollected] = useState(0)
  const [activeShield, setActiveShield] = useState(false)
  const [shieldTimer, setShieldTimer] = useState<NodeJS.Timeout | null>(null)
  const [gameTime, setGameTime] = useState(0)
  const [gameTimeInterval, setGameTimeInterval] = useState<NodeJS.Timeout | null>(null)
  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [monsterTypes] = useState(["Greeny", "Aqua", "Purply", "Pinky", "Chompy"])

  // Звуковые эффекты (16-бит)
  const shootSound = useRef<HTMLAudioElement | null>(null)
  const hitSound = useRef<HTMLAudioElement | null>(null)
  const explosionSound = useRef<HTMLAudioElement | null>(null)
  const gameOverSound = useRef<HTMLAudioElement | null>(null)
  const levelUpSound = useRef<HTMLAudioElement | null>(null)
  const monsterSound = useRef<HTMLAudioElement | null>(null)
  const powerUpSound = useRef<HTMLAudioElement | null>(null)
  const coinSound = useRef<HTMLAudioElement | null>(null)
  const backgroundMusic = useRef<HTMLAudioElement | null>(null)

  // Загрузка изображений
  const [images, setImages] = useState<{
    defender: HTMLImageElement | null
    monster1: HTMLImageElement | null
    monster2: HTMLImageElement | null
    boss: HTMLImageElement | null
    background: HTMLImageElement | null
    projectile: HTMLImageElement | null
    bnbCoin: HTMLImageElement | null
    shield: HTMLImageElement | null
    powerUps: Record<string, HTMLImageElement | null>
  }>({
    defender: null,
    monster1: null,
    monster2: null,
    boss: null,
    background: null,
    projectile: null,
    bnbCoin: null,
    shield: null,
    powerUps: {
      health: null,
      speed: null,
      damage: null,
      shield: null,
      coin: null,
    },
  })

  // Инициализация звуков и изображений
  useEffect(() => {
    // Инициализация звуков
    shootSound.current = new Audio("/sounds/16bit-shoot.mp3")
    hitSound.current = new Audio("/sounds/16bit-hit.mp3")
    explosionSound.current = new Audio("/sounds/16bit-explosion.mp3")
    gameOverSound.current = new Audio("/sounds/16bit-gameover.mp3")
    levelUpSound.current = new Audio("/sounds/16bit-levelup.mp3")
    monsterSound.current = new Audio("/sounds/monster-click-16bit.mp3")
    powerUpSound.current = new Audio("/sounds/16bit-powerup.mp3")
    coinSound.current = new Audio("/sounds/16bit-coin.mp3")
    backgroundMusic.current = new Audio("/sounds/16bit-background.mp3")

    if (backgroundMusic.current) {
      backgroundMusic.current.loop = true
      backgroundMusic.current.volume = 0.3
    }

    // Загрузка изображений
    const defenderImg = new Image()
    defenderImg.src = "/images/defender.png"
    defenderImg.crossOrigin = "anonymous"

    const monster1Img = new Image()
    monster1Img.src = "/images/monster1.png"
    monster1Img.crossOrigin = "anonymous"

    const monster2Img = new Image()
    monster2Img.src = "/images/monster2.png"
    monster2Img.crossOrigin = "anonymous"

    const bossImg = new Image()
    bossImg.src = "/images/boss.png"
    bossImg.crossOrigin = "anonymous"

    const bgImg = new Image()
    bgImg.src = "/images/game-background.png"
    bgImg.crossOrigin = "anonymous"

    const projectileImg = new Image()
    projectileImg.src = "/images/projectile.png"
    projectileImg.crossOrigin = "anonymous"

    const bnbCoinImg = new Image()
    bnbCoinImg.src = "/placeholder.svg?height=40&width=40&text=BNB"
    bnbCoinImg.crossOrigin = "anonymous"

    const shieldImg = new Image()
    shieldImg.src = "/placeholder.svg?height=100&width=100&text=Shield"
    shieldImg.crossOrigin = "anonymous"

    // Загрузка изображений для бонусов
    const healthImg = new Image()
    healthImg.src = "/placeholder.svg?height=30&width=30&text=Health"
    healthImg.crossOrigin = "anonymous"

    const speedImg = new Image()
    speedImg.src = "/placeholder.svg?height=30&width=30&text=Speed"
    speedImg.crossOrigin = "anonymous"

    const damageImg = new Image()
    damageImg.src = "/placeholder.svg?height=30&width=30&text=Damage"
    damageImg.crossOrigin = "anonymous"

    const shieldPowerUpImg = new Image()
    shieldPowerUpImg.src = "/placeholder.svg?height=30&width=30&text=Shield"
    shieldPowerUpImg.crossOrigin = "anonymous"

    const coinImg = new Image()
    coinImg.src = "/placeholder.svg?height=30&width=30&text=BNB"
    coinImg.crossOrigin = "anonymous"

    // Установка изображений после загрузки
    defenderImg.onload = () => setImages((prev) => ({ ...prev, defender: defenderImg }))
    monster1Img.onload = () => setImages((prev) => ({ ...prev, monster1: monster1Img }))
    monster2Img.onload = () => setImages((prev) => ({ ...prev, monster2: monster2Img }))
    bossImg.onload = () => setImages((prev) => ({ ...prev, boss: bossImg }))
    bgImg.onload = () => setImages((prev) => ({ ...prev, background: bgImg }))
    projectileImg.onload = () => setImages((prev) => ({ ...prev, projectile: projectileImg }))
    bnbCoinImg.onload = () => setImages((prev) => ({ ...prev, bnbCoin: bnbCoinImg }))
    shieldImg.onload = () => setImages((prev) => ({ ...prev, shield: shieldImg }))

    healthImg.onload = () =>
      setImages((prev) => ({
        ...prev,
        powerUps: { ...prev.powerUps, health: healthImg },
      }))
    speedImg.onload = () =>
      setImages((prev) => ({
        ...prev,
        powerUps: { ...prev.powerUps, speed: speedImg },
      }))
    damageImg.onload = () =>
      setImages((prev) => ({
        ...prev,
        powerUps: { ...prev.powerUps, damage: damageImg },
      }))
    shieldPowerUpImg.onload = () =>
      setImages((prev) => ({
        ...prev,
        powerUps: { ...prev.powerUps, shield: shieldPowerUpImg },
      }))
    coinImg.onload = () =>
      setImages((prev) => ({
        ...prev,
        powerUps: { ...prev.powerUps, coin: coinImg },
      }))

    console.log("Загрузка изображений и звуков инициализирована")

    return () => {
      // Очистка ресурсов при размонтировании
      if (backgroundMusic.current) {
        backgroundMusic.current.pause()
        backgroundMusic.current.currentTime = 0
      }

      if (comboTimer) {
        clearTimeout(comboTimer)
      }

      if (shieldTimer) {
        clearTimeout(shieldTimer)
      }

      if (gameTimeInterval) {
        clearInterval(gameTimeInterval)
      }
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

      // Если показывается обучение, переходим к следующему шагу
      if (showTutorial) {
        setTutorialStep((prev) => {
          if (prev >= 3) {
            setShowTutorial(false)
            return 0
          }
          return prev + 1
        })
        return
      }

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
        color: "#FFD700", // Изменено на золотой цвет
        angle,
        isBNB: Math.random() < 0.1, // 10% шанс выстрелить BNB-монетой
      }

      setProjectiles((prev) => [...prev, newProjectile])
      playSound(shootSound.current)
    }

    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, [gameStarted, gameOver, lastShot, mousePosition, level, showTutorial, tutorialStep])

  // Основной игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    // Запускаем фоновую музыку
    if (backgroundMusic.current && soundEnabled) {
      backgroundMusic.current.play().catch((err) => {
        console.warn("Не удалось воспроизвести фоновую музыку:", err)
      })
    }

    // Запускаем таймер игры
    const interval = setInterval(() => {
      setGameTime((prev) => prev + 1)
    }, 1000)
    setGameTimeInterval(interval)

    const gameLoop = () => {
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

        // Выбор случайного типа монстра из коллекции BNBMonster
        const monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)]

        // Создание нового монстра
        const newMonster: Monster = {
          x: Math.random() * (canvas.width - 100) + 50,
          y: -50,
          speed: 1 + Math.random() * (level * 0.2),
          health: isBoss ? 100 + level * 20 : 20 + level * 5,
          size: isBoss ? 80 : 40 + Math.random() * 20,
          color: isBoss ? "#FFD700" : `hsl(${Math.random() * 60}, 70%, 50%)`, // Изменено на золотистые оттенки
          type: isBoss ? "boss" : "normal",
          isDead: false,
          monsterType,
          scale: 1,
          rotation: 0,
        }

        setMonsters((prev) => [...prev, newMonster])
        playSound(monsterSound.current)

        // Шанс создать бонус
        if (Math.random() < 0.2) {
          // 20% шанс
          const powerUpType = ["health", "speed", "damage", "shield", "coin"][Math.floor(Math.random() * 5)] as
            | "health"
            | "speed"
            | "damage"
            | "shield"
            | "coin"

          const newPowerUp: PowerUp = {
            x: Math.random() * (canvas.width - 60) + 30,
            y: -30,
            type: powerUpType,
            size: 30,
            duration: powerUpType === "shield" ? 10000 : 0, // Щит длится 10 секунд
            collected: false,
          }

          setPowerUps((prev) => [...prev, newPowerUp])
        }
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
        ctx.fillStyle = "#FFD700" // Изменено на золотой цвет
        ctx.beginPath()
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
        ctx.fill()

        // Пушка, направленная к курсору
        const angle = Math.atan2(mousePosition.y - centerY, mousePosition.x - centerX)
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)
        ctx.fillStyle = "#FFD700" // Изменено на золотой цвет
        ctx.fillRect(0, -5, 30, 10)
        ctx.restore()
      }

      // Отрисовка щита, если он активен
      if (activeShield && images.shield) {
        ctx.save()
        ctx.globalAlpha = 0.5
        ctx.drawImage(images.shield, centerX - 50, centerY - 50, 100, 100)
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
            if (projectile.isBNB && images.bnbCoin) {
              ctx.save()
              ctx.translate(updatedProjectile.x, updatedProjectile.y)
              ctx.rotate(updatedProjectile.angle)
              ctx.drawImage(
                images.bnbCoin,
                -updatedProjectile.size * 2,
                -updatedProjectile.size * 2,
                updatedProjectile.size * 4,
                updatedProjectile.size * 4,
              )
              ctx.restore()
            } else if (images.projectile) {
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
              ctx.fillStyle = `rgba(255, 215, 0, 0.3)` // Золотистое свечение
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
              // Добавляем эффект "дыхания" и вращения
              scale: 1 + Math.sin(now / 500) * 0.05,
              rotation: monster.rotation + (monster.type === "boss" ? 0.01 : 0.005),
            }

            // Отрисовка монстра
            const monsterImage =
              monster.type === "boss" ? images.boss : Math.random() > 0.5 ? images.monster1 : images.monster2

            if (monsterImage) {
              ctx.save()
              ctx.translate(updatedMonster.x, updatedMonster.y)
              ctx.rotate(updatedMonster.rotation || 0)
              ctx.scale(updatedMonster.scale || 1, updatedMonster.scale || 1)
              ctx.drawImage(
                monsterImage,
                -updatedMonster.size / 2,
                -updatedMonster.size / 2,
                updatedMonster.size,
                updatedMonster.size,
              )
              ctx.restore()

              // Отображаем тип монстра над ним
              if (updatedMonster.monsterType) {
                ctx.save()
                ctx.font = "12px Arial"
                ctx.fillStyle = "#FFD700" // Золотой цвет
                ctx.textAlign = "center"
                ctx.fillText(
                  updatedMonster.monsterType,
                  updatedMonster.x,
                  updatedMonster.y - updatedMonster.size / 2 - 10,
                )
                ctx.restore()
              }
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

                  // Останавливаем фоновую музыку
                  if (backgroundMusic.current) {
                    backgroundMusic.current.pause()
                    backgroundMusic.current.currentTime = 0
                  }

                  // Очищаем интервал игрового времени
                  if (gameTimeInterval) {
                    clearInterval(gameTimeInterval)
                    setGameTimeInterval(null)
                  }
                }

                return newHealth
              })

              return null // Удаление монстра
            }

            return updatedMonster
          })
          .filter(Boolean) as Monster[] // Фильтрация null значений
      })

      // Обновление и отрисовка бонусов
      setPowerUps((prev) => {
        return prev
          .map((powerUp) => {
            if (powerUp.collected) return null

            // Обновляем позицию бонуса (медленно падает вниз)
            const updatedPowerUp = {
              ...powerUp,
              y: powerUp.y + 1,
            }

            // Отрисовка бонуса
            const powerUpImage = images.powerUps[powerUp.type]

            if (powerUpImage) {
              ctx.drawImage(
                powerUpImage,
                updatedPowerUp.x - updatedPowerUp.size / 2,
                updatedPowerUp.y - updatedPowerUp.size / 2,
                updatedPowerUp.size,
                updatedPowerUp.size,
              )
            } else {
              // Запасной вариант
              ctx.save()

              // Разные цвета для разных типов бонусов
              let color
              switch (updatedPowerUp.type) {
                case "health":
                  color = "#ff0000"
                  break
                case "speed":
                  color = "#00ffff"
                  break
                case "damage":
                  color = "#ff00ff"
                  break
                case "shield":
                  color = "#0000ff"
                  break
                case "coin":
                  color = "#ffd700"
                  break
                default:
                  color = "#ffffff"
              }

              ctx.fillStyle = color
              ctx.beginPath()
              ctx.arc(updatedPowerUp.x, updatedPowerUp.y, updatedPowerUp.size / 2, 0, Math.PI * 2)
              ctx.fill()

              // Добавляем свечение
              ctx.globalAlpha = 0.5
              ctx.beginPath()
              ctx.arc(updatedPowerUp.x, updatedPowerUp.y, updatedPowerUp.size, 0, Math.PI * 2)
              ctx.fill()

              // Добавляем текст
              ctx.globalAlpha = 1
              ctx.fillStyle = "#ffffff"
              ctx.font = "12px Arial"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"

              let text
              switch (updatedPowerUp.type) {
                case "health":
                  text = "❤️"
                  break
                case "speed":
                  text = "⚡"
                  break
                case "damage":
                  text = "💥"
                  break
                case "shield":
                  text = "🛡️"
                  break
                case "coin":
                  text = "💰"
                  break
                default:
                  text = "?"
              }

              ctx.fillText(text, updatedPowerUp.x, updatedPowerUp.y)

              ctx.restore()
            }

            // Проверка выхода за границы
            if (updatedPowerUp.y > canvas.height + 50) {
              return null // Удаление бонуса, вышедшего за границы
            }

            return updatedPowerUp
          })
          .filter(Boolean) as PowerUp[]
      })

      // Проверка столкновений снарядов с монстрами
      let scoreIncrease = 0
      let bnbIncrease = 0

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

                  // Увеличиваем комбо
                  setCombo((prev) => {
                    const newCombo = prev + 1

                    // Обновляем множитель комбо
                    if (newCombo >= 10) {
                      setComboMultiplier(3)
                    } else if (newCombo >= 5) {
                      setComboMultiplier(2)
                    } else {
                      setComboMultiplier(1)
                    }

                    return newCombo
                  })

                  // Сбрасываем таймер комбо
                  if (comboTimer) {
                    clearTimeout(comboTimer)
                  }

                  // Устанавливаем новый таймер комбо (5 секунд)
                  const timer = setTimeout(() => {
                    setCombo(0)
                    setComboMultiplier(1)
                  }, 5000)
                  setComboTimer(timer)

                  // Применяем множитель комбо к очкам
                  scoreIncrease += points * comboMultiplier

                  // Если снаряд был BNB-монетой, увеличиваем счетчик BNB
                  if (projectile.isBNB) {
                    bnbIncrease += monster.type === "boss" ? 0.01 : 0.001
                    playSound(coinSound.current)
                  }

                  // Шанс создать бонус при уничтожении монстра
                  if (Math.random() < 0.3) {
                    // 30% шанс
                    const powerUpType = ["health", "speed", "damage", "shield", "coin"][
                      Math.floor(Math.random() * 5)
                    ] as "health" | "speed" | "damage" | "shield" | "coin"

                    const newPowerUp: PowerUp = {
                      x: monster.x,
                      y: monster.y,
                      type: powerUpType,
                      size: 30,
                      duration: powerUpType === "shield" ? 10000 : 0, // Щит длится 10 секунд
                      collected: false,
                    }

                    setPowerUps((prev) => [...prev, newPowerUp])
                  }

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

          // Проверка столкновений снарядов с бонусами
          setPowerUps((prevPowerUps) => {
            return prevPowerUps.map((powerUp) => {
              if (powerUp.collected) return powerUp

              // Проверка столкновения
              const dx = projectile.x - powerUp.x
              const dy = projectile.y - powerUp.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < powerUp.size / 2 + projectile.size) {
                // Столкновение произошло
                hitMonster = true

                // Применяем эффект бонуса
                switch (powerUp.type) {
                  case "health":
                    setPlayerHealth((prev) => Math.min(100, prev + 20))
                    break
                  case "speed":
                    // Увеличиваем скорость снарядов на 20% на 10 секунд
                    // (Эффект будет реализован в другом месте)
                    break
                  case "damage":
                    // Увеличиваем урон снарядов на 50% на 10 секунд
                    // (Эффект будет реализован в другом месте)
                    break
                  case "shield":
                    // Активируем щит на 10 секунд
                    setActiveShield(true)

                    // Сбрасываем предыдущий таймер щита, если он есть
                    if (shieldTimer) {
                      clearTimeout(shieldTimer)
                    }

                    // Устанавливаем новый таймер щита
                    const timer = setTimeout(() => {
                      setActiveShield(false)
                    }, powerUp.duration)
                    setShieldTimer(timer)
                    break
                  case "coin":
                    // Увеличиваем счетчик BNB
                    bnbIncrease += 0.01
                    break
                }

                // Воспроизводим звук сбора бонуса
                playSound(powerUpSound.current)

                // Помечаем бонус как собранный
                return {
                  ...powerUp,
                  collected: true,
                }
              }

              return powerUp
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

      // Обновление счетчика BNB
      if (bnbIncrease > 0) {
        setBnbCollected((prev) => prev + bnbIncrease)
      }

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

      // Отображение комбо
      if (combo > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(canvas.width - 150, 90, 130, 30)

        ctx.fillStyle = "#FFD700" // Золотой цвет
        ctx.font = "16px Arial"
        ctx.fillText(`Комбо: x${comboMultiplier} (${combo})`, canvas.width - 140, 110)
      }

      // Отображение собранных BNB
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(20, 50, 150, 30)

      ctx.fillStyle = "#FFD700" // Золотой цвет
      ctx.font = "16px Arial"
      ctx.fillText(`BNB: ${bnbCollected.toFixed(3)}`, 25, 70)

      // Отображение игрового времени
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(canvas.width / 2 - 50, 20, 100, 30)

      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"

      // Форматирование времени в минуты:секунды
      const minutes = Math.floor(gameTime / 60)
      const seconds = gameTime % 60
      ctx.fillText(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, canvas.width / 2, 40)
      ctx.textAlign = "left"

      // Отображение статуса щита
      if (activeShield) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(20, 90, 150, 30)

        ctx.fillStyle = "#00FFFF" // Голубой цвет
        ctx.font = "16px Arial"
        ctx.fillText(`Щит активен`, 25, 110)
      }

      // Отображение обучения
      if (showTutorial) {
        // Затемнение экрана
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Заголовок обучения
        ctx.fillStyle = "#FFD700" // Золотой цвет
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Обучение", canvas.width / 2, canvas.height / 2 - 100)

        // Текст обучения в зависимости от шага
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "18px Arial"

        let tutorialText = ""
        switch (tutorialStep) {
          case 0:
            tutorialText = "Добро пожаловать в игру Monster Defender!"
            break
          case 1:
            tutorialText = "Используйте мышь для прицеливания и клик для стрельбы."
            break
          case 2:
            tutorialText = "Уничтожайте монстров, чтобы получать очки и BNB."
            break
          case 3:
            tutorialText = "Собирайте бонусы для получения преимуществ."
            break
        }

        ctx.fillText(tutorialText, canvas.width / 2, canvas.height / 2 - 50)

        // Инструкция для продолжения
        ctx.fillStyle = "#FFD700" // Золотой цвет
        ctx.font = "16px Arial"
        ctx.fillText("Нажмите в любом месте для продолжения", canvas.width / 2, canvas.height / 2)
      }

      // Запуск следующего кадра
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)

      // Останавливаем фоновую музыку
      if (backgroundMusic.current) {
        backgroundMusic.current.pause()
        backgroundMusic.current.currentTime = 0
      }

      // Очищаем таймеры
      if (comboTimer) {
        clearTimeout(comboTimer)
      }

      if (shieldTimer) {
        clearTimeout(shieldTimer)
      }

      if (gameTimeInterval) {
        clearInterval(gameTimeInterval)
      }
    }
  }, [
    gameStarted,
    gameOver,
    lastMonsterSpawn,
    level,
    mousePosition,
    backgroundOffset,
    images,
    soundEnabled,
    comboMultiplier,
    combo,
    comboTimer,
    activeShield,
    shieldTimer,
    gameTime,
    gameTimeInterval,
    showTutorial,
    tutorialStep,
    monsterTypes,
  ])

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
    ctx.fillStyle = "#FFD700" // Золотой цвет
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2 - 50)

    // Счет
    ctx.fillStyle = "#ffffff"
    ctx.font = "24px Arial"
    ctx.fillText(`Ваш счет: ${score}`, canvas.width / 2, canvas.height / 2)
    ctx.fillText(`Уровень: ${level}`, canvas.width / 2, canvas.height / 2 + 40)

    // Собранные BNB
    ctx.fillStyle = "#FFD700" // Золотой цвет
    ctx.font = "28px Arial"
    ctx.fillText(`Собрано BNB: ${bnbCollected.toFixed(3)}`, canvas.width / 2, canvas.height / 2 + 80)

    // Инструкция для перезапуска
    ctx.fillStyle = "#00ff00"
    ctx.font = "20px Arial"
    ctx.fillText('Нажмите кнопку "Начать заново" для новой игры', canvas.width / 2, canvas.height / 2 + 140)
  }, [gameOver, score, level, bnbCollected])

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
    setPowerUps([])
    setLastMonsterSpawn(Date.now())
    setCombo(0)
    setComboMultiplier(1)
    setBnbCollected(0)
    setActiveShield(false)
    setGameTime(0)
    setShowTutorial(true)
    setTutorialStep(0)

    // Воспроизводим фоновую музыку
    if (backgroundMusic.current && soundEnabled) {
      backgroundMusic.current.currentTime = 0
      backgroundMusic.current.play().catch((err) => {
        console.warn("Не удалось воспроизвести фоновую музыку:", err)
      })
    }
  }

  // Функция перезапуска игры
  const restartGame = () => {
    startGame()
  }

  // Функция переключения звука
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev

      // Включаем/выключаем фоновую музыку
      if (backgroundMusic.current) {
        if (newState) {
          backgroundMusic.current.play().catch((err) => {
            console.warn("Не удалось воспроизвести фоновую музыку:", err)
          })
        } else {
          backgroundMusic.current.pause()
        }
      }

      return newState
    })
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
    ctx.fillStyle = "#FFD700" // Золотой цвет
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Monster Defender", canvas.width / 2, canvas.height / 2 - 50)

    // Инструкция
    ctx.fillStyle = "#FFCC00" // Светло-золотой цвет
    ctx.font = "20px Arial"
    ctx.fillText('Нажмите "Начать игру" для старта', canvas.width / 2, canvas.height / 2 + 50)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gradient-to-b from-yellow-900 to-amber-900 rounded-lg">
      <div className="flex items-center justify-center mb-2">
        <BnbMonsterLogo className="h-12 w-auto" />
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="border-4 border-yellow-600 rounded-lg shadow-lg" />

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <h2 className="text-4xl font-bold text-yellow-400 mb-8">Защитник от Монстров</h2>
            <p className="text-xl text-yellow-200 mb-8 max-w-md text-center">
              Защитите свою базу от наступающих монстров! Используйте мышь для прицеливания и клик для стрельбы.
            </p>
            <Button onClick={startGame} className="px-8 py-4 text-xl bg-yellow-600 hover:bg-yellow-700 text-white">
              Начать игру
            </Button>

            <div className="mt-8 text-yellow-300 text-sm">
              <p>Собирайте BNB-монеты и зарабатывайте токены!</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {gameOver && (
          <Button onClick={restartGame} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white">
            Начать заново
          </Button>
        )}

        <Button onClick={toggleSound} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white">
          {soundEnabled ? "Выключить звук" : "Включить звук"}
        </Button>
      </div>

      <div className="mt-4 text-center text-yellow-200">
        <h3 className="text-xl font-bold text-yellow-300">Инструкция:</h3>
        <ul className="list-disc list-inside text-left">
          <li>Используйте мышь для прицеливания</li>
          <li>Кликайте для стрельбы по монстрам</li>
          <li>Не позволяйте монстрам достичь нижней части экрана</li>
          <li>Собирайте бонусы для получения преимуществ</li>
          <li>Зарабатывайте BNB, уничтожая монстров золотыми снарядами</li>
          <li>Создавайте комбо для увеличения множителя очков</li>
        </ul>
      </div>
    </div>
  )
}

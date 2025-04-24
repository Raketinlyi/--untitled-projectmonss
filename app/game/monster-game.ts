import { ParticleSystem } from "./particle-system"
import { RetroAudioSystem } from "./audio-system"

// Типы боссов
enum BossType {
  NORMAL = "normal",
  CHOMPER = "chomper",
  SPIKY = "spiky",
  DEMON = "demon",
}

// В начале файла, после объявления BossType и AttackPattern, добавим новые типы монстров
enum MonsterType {
  REGULAR = "regular",
  SHIELDED = "shielded",
  SPLITTER = "splitter",
}

// Типы атак боссов
enum AttackPattern {
  SINGLE = "single",
  TRIPLE = "triple",
  CIRCLE = "circle",
  WAVE = "wave",
}

// Интерфейс для атак боссов
interface BossAttack {
  name: string
  cooldown: number
  lastUsed: number
  execute: (boss: Monster, game: MonsterGame) => void
}

// Class for handling all game logic
export class MonsterGame {
  // Добавьте эту функцию в начало класса MonsterGame:
  private safeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    // Убедимся, что радиус положительный
    const safeRadius = Math.max(0.1, Math.abs(radius))
    this.ctx.arc(x, y, safeRadius, startAngle, endAngle)
  }
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private monsters: Monster[] = []
  private projectiles: Projectile[] = []
  private particles: ParticleSystem
  private audioSystem: RetroAudioSystem
  private lastMonsterSpawn = 0
  private lastBossSpawn = 0
  private animationFrameId = 0
  private gameActive = false
  private poopEmoji = "💩"
  private monsterImages: HTMLImageElement[] = []
  private bossImages: Map<BossType, HTMLImageElement> = new Map()
  private imagesLoaded = false
  private muted = false
  private clickMarker = { x: 0, y: 0, active: false, time: 0 }
  private debugMode = false // Disable debug mode
  private resizeObserver: ResizeObserver | null = null
  private lastFrameTime = 0
  private lowPerformanceMode = false // Будет включаться автоматически на слабых устройствах
  private readonly hitboxSize = 1.3 // Размер зоны нажатия (множитель)
  private vibrationEnabled = true // Включена ли вибрация
  private lastScore = 0 // Для отслеживания изменения счета
  private scoreThresholds = [100, 250, 500, 1000, 2000] // Пороги для звуков достижений
  private lastBossHealth = 0 // Для отслеживания победы над боссом
  private gameStartTime = 0 // Время начала игры
  private projectileInterval = 4 // Начальный интервал метания снарядов (4 секунды)
  private difficultyLevel = 0 // Уровень сложности (0, 1, 2)
  private bossSequence = [BossType.NORMAL, BossType.CHOMPER, BossType.SPIKY, BossType.DEMON] // Последовательность боссов
  private currentBossIndex = 0 // Индекс текущего босса в последовательности
  private specialAttackActive = false // Флаг активной специальной атаки
  private specialAttackTimeout: number | null = null // Таймаут специальной атаки
  private gameTime = 0 // Общее время игры в миллисекундах
  private lastSpecialAttackTime = 0 // Время последней специальной атаки
  private monstersPerWave = 1 // Количество монстров, появляющихся одновременно
  private lastDifficultyIncrease = 0 // Время последнего увеличения сложности

  // Новые свойства для комбо-системы
  private comboCount = 0
  private comboMultiplier = 1
  private lastKillTime = 0
  private comboTimeout = 1500 // 1.5 секунды для поддержания комбо

  // Свойства для специальных способностей
  private energy = 0
  private maxEnergy = 100
  private energyPerKill = 5
  private timeFreezeDuration = 5000 // 5 секунд
  private isFrozen = false
  private shieldActive = false
  private shieldDuration = 5000 // 5 секунд

  // Свойства для бонусов
  private bonusSpawnChance = 0.2 // 20% шанс выпадения бонуса
  private bonusTypes: string[] = ["points", "life", "slowdown", "shield", "energy"]
  private pointsMultiplierActive = false
  private pointsMultiplierValue = 2
  private pointsMultiplierDuration = 10000 // 10 секунд
  private slowdownActive = false
  private slowdownFactor = 0.5
  private slowdownDuration = 5000 // 5 секунд

  // Fixed sizes for monsters, independent of canvas size
  private readonly MONSTER_SIZE = 70
  private readonly BOSS_SIZE = 110

  // Game state
  public score = 0
  public lives = 3

  // Callbacks
  public onScoreChange: (score: number) => void = () => {}
  public onLivesChange: (lives: number) => void = () => {}
  public onGameOver: () => void = () => {}
  public onBossAppear: (bossType: BossType) => void = () => {} // Новый колбэк для появления босса
  public onDifficultyIncrease: (level: number, monstersPerWave: number) => void = () => {} // Колбэк для увеличения сложности

  // Новые колбэки
  public onComboChange: (combo: number, multiplier: number) => void = () => {}
  public onEnergyChange: (energy: number, maxEnergy: number) => void = () => {}
  public onSpecialAbilityActivated: (abilityType: string, duration: number) => void = () => {}
  public onBonusCollected: (bonusType: string) => void = () => {}

  private bossTimer = 0 // Таймер для отслеживания времени до появления босса
  private bossSpawnInterval = 30000 // Интервал появления босса (30 секунд)

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get canvas context")
    this.ctx = ctx

    // Initialize particle system
    this.particles = new ParticleSystem(ctx)

    // Initialize audio system
    this.audioSystem = new RetroAudioSystem()

    // Set canvas size
    this.resizeCanvas()

    // Load images
    this.loadImages()

    // Add event listeners
    this.setupEventListeners()

    // Запускаем фоновую музыку
    setTimeout(() => {
      this.audioSystem.startBackgroundMusic()
    }, 1000)

    // Добавим колбэки для новых механик
    this.onComboChange = () => {}
    this.onEnergyChange = () => {}
    this.onSpecialAbilityActivated = () => {}
    this.onBonusCollected = () => {}
  }

  // Load monster images
  private loadImages() {
    const monsterUrls = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68d56a43-41e6-4efd-bc1a-92a8d6985612-QoXIJH3cGbNcKhVk6V9E8UnuJAkG5S.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68522fbc-f35b-4416-8ac3-d0e783ba5714-elFuXplIykv79gn5XXNdxcqHFfGhOY.png",
    ]

    // Загрузка изображений боссов
    const bossUrls = [
      {
        type: BossType.NORMAL,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e63a0f33-b60a-4366-832d-f6e3442b9ad9-LCRlrOfUwlaT2IYxlRQE313572hMya.png",
      },
      {
        type: BossType.CHOMPER,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-wwXKN7jQcIa73JwtxAIb5nD1bsaNmp.png",
      },
      {
        type: BossType.SPIKY,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-Msge6j87opM0rnlCpGmWLKCsGPCpQg.png",
      },
      {
        type: BossType.DEMON,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/33-FOabEln7swwI7fJAciCRliXQaW3lZb.png",
      },
    ]

    let loadedCount = 0
    const totalImages = monsterUrls.length + bossUrls.length // Общее количество изображений
    let hasErrors = false

    // Создаем запасное изображение для случаев ошибок загрузки
    const createFallbackImage = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#FF00FF"
        ctx.beginPath()
        ctx.arc(50, 50, 40, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("?", 50, 55)
      }
      const img = new Image()
      img.src = canvas.toDataURL()
      return img
    }

    // Функция для завершения загрузки
    const finishLoading = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        this.imagesLoaded = true
        if (hasErrors) {
          console.warn("Some images failed to load, using fallbacks")
        }
      }
    }

    // Load regular monster images
    monsterUrls.forEach((url) => {
      const img = new Image()
      img.crossOrigin = "anonymous" // Important to avoid CORS errors
      img.onload = finishLoading
      img.onerror = (err) => {
        console.error("Error loading image:", url, err)
        // Add fallback image
        this.monsterImages.push(createFallbackImage())
        hasErrors = true
        finishLoading()
      }
      img.src = url
      this.monsterImages.push(img)
    })

    // Load boss images
    bossUrls.forEach(({ type, url }) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = finishLoading
      img.onerror = (err) => {
        console.error("Error loading boss image:", url, err)
        // Add fallback image
        this.bossImages.set(type, createFallbackImage())
        hasErrors = true
        finishLoading()
      }
      img.src = url
      this.bossImages.set(type, img)
    })

    // Устанавливаем таймаут для случаев, когда изображения не загружаются
    setTimeout(() => {
      if (!this.imagesLoaded) {
        console.warn("Image loading timeout, continuing with available images")
        this.imagesLoaded = true
      }
    }, 5000) // 5 секунд таймаут
  }

  // Set up event listeners
  private setupEventListeners() {
    this.canvas.addEventListener("click", this.handleClick)
    this.canvas.addEventListener("touchstart", this.handleTouch)

    // Use ResizeObserver for better performance
    this.resizeObserver = new ResizeObserver(this.resizeCanvas)
    this.resizeObserver.observe(this.canvas)
  }

  // Resize canvas
  private resizeCanvas = () => {
    try {
      // Set canvas size in pixels equal to its display size
      const rect = this.canvas.getBoundingClientRect()
      this.canvas.width = rect.width
      this.canvas.height = rect.height
    } catch (error) {
      console.error("Error resizing canvas:", error)
    }
  }

  // Handle mouse clicks
  private handleClick = (e: MouseEvent) => {
    if (!this.gameActive) return

    try {
      // Get click coordinates relative to canvas
      const rect = this.canvas.getBoundingClientRect()
      const scaleX = this.canvas.width / rect.width
      const scaleY = this.canvas.height / rect.height

      // Calculate exact click coordinates with scale
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      // Show click marker
      this.showClickMarker(x, y)

      // Check for hits on monsters and projectiles
      this.processClick(x, y)
    } catch (error) {
      console.error("Error handling click:", error)
    }
  }

  // Handle touch events
  private handleTouch = (e: TouchEvent) => {
    e.preventDefault()
    if (!this.gameActive) return

    try {
      // Обработка всех касаний для поддержки мультитач
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i]

        // Get touch coordinates relative to canvas
        const rect = this.canvas.getBoundingClientRect()
        const scaleX = this.canvas.width / rect.width
        const scaleY = this.canvas.height / rect.height

        // Calculate exact touch coordinates with scale
        const x = (touch.clientX - rect.left) * scaleX
        const y = (touch.clientY - rect.top) * scaleY

        // Show click marker
        this.showClickMarker(x, y)

        // Check for hits on monsters and projectiles
        this.processClick(x, y)
      }
    } catch (error) {
      console.error("Error handling touch:", error)
    }
  }

  // Show visual click marker
  private showClickMarker(x: number, y: number) {
    this.clickMarker = {
      x,
      y,
      active: true,
      time: performance.now(),
    }
  }

  // Process click/touch for hits
  private processClick(x: number, y: number) {
    // Debug info
    if (this.debugMode) {
      console.log(`Click at coordinates: x=${x.toFixed(2)}, y=${y.toFixed(2)}`)
    }

    // First check for monster hits
    let hit = false

    // Check each monster
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const monster = this.monsters[i]

      // Увеличенная зона нажатия на 30% для мобильных устройств
      const hitboxWidth = monster.width * this.hitboxSize
      const hitboxHeight = monster.height * this.hitboxSize

      if (
        x >= monster.x - hitboxWidth / 2 &&
        x <= monster.x + hitboxWidth / 2 &&
        y >= monster.y - hitboxHeight / 2 &&
        y <= monster.y + hitboxHeight / 2
      ) {
        // Hit a monster!
        hit = true

        if (this.debugMode) {
          console.log(`Hit monster at position: x=${monster.x.toFixed(2)}, y=${monster.y.toFixed(2)}`)
        }

        // Проверяем, есть ли у монстра щит
        if (monster.hasShield && monster.shieldHealth > 0) {
          // Уменьшаем здоровье щита
          monster.shieldHealth--

          // Воспроизводим звук попадания по щиту
          this.audioSystem.play("hit")

          // Создаем эффект попадания по щиту
          this.particles.createExplosion(x, y, "#00FFFF", 10)

          // Если щит уничтожен, убираем его
          if (monster.shieldHealth <= 0) {
            monster.hasShield = false
            // Создаем эффект разрушения щита
            this.particles.createExplosion(monster.x, monster.y, "#00FFFF", 20)
          }

          // Прерываем обработку, так как щит поглотил удар
          break
        }

        // Reduce monster health
        monster.health--

        // Добавляем вибрацию при попадании, если доступно
        if (navigator.vibrate && this.vibrationEnabled) {
          navigator.vibrate(50)
        } else if (this.audioSystem.isIOSDevice && this.vibrationEnabled) {
          // Используем аудио-тактильную обратную связь для iOS
          this.audioSystem.playTactileFeedback("light")
        }

        // Воспроизводим улучшенный 16-битный звук попадания
        this.audioSystem.play("hit")

        // Create enhanced 16-bit style hit effect EXACTLY at click position
        this.particles.createExplosion(x, y, "#FFFF00", 20, true) // Added 'true' parameter for enhanced effect

        // Сохраняем здоровье босса для отслеживания победы
        if (monster.isBoss) {
          this.lastBossHealth = monster.health
        }

        // If monster is defeated
        if (monster.health <= 0) {
          // Обрабатываем комбо
          const now = performance.now()
          if (now - this.lastKillTime < this.comboTimeout) {
            this.comboCount++
            // Увеличиваем множитель комбо (максимум x5)
            this.comboMultiplier = Math.min(5, 1 + Math.floor(this.comboCount / 3))
            // Вызываем колбэк изменения комбо
            this.onComboChange(this.comboCount, this.comboMultiplier)
          } else {
            // Сбрасываем комбо
            this.comboCount = 1
            this.comboMultiplier = 1
            this.onComboChange(this.comboCount, this.comboMultiplier)
          }
          this.lastKillTime = now

          // Добавляем энергию за уничтожение монстра
          this.addEnergy(monster.isBoss ? this.energyPerKill * 5 : this.energyPerKill)

          // Add points with combo multiplier and any active point multipliers
          let pointsToAdd = monster.isBoss ? 20 : 1
          pointsToAdd *= this.comboMultiplier

          // Применяем множитель очков, если он активен
          if (this.pointsMultiplierActive) {
            pointsToAdd *= this.pointsMultiplierValue
          }

          this.score += pointsToAdd
          this.onScoreChange(this.score)

          // Более сильная вибрация при уничтожении монстра
          if (navigator.vibrate && this.vibrationEnabled) {
            navigator.vibrate(100)
          } else if (this.audioSystem.isIOSDevice && this.vibrationEnabled) {
            // Используем аудио-тактильную обратную связь для iOS
            this.audioSystem.playTactileFeedback("medium")
          }

          // Воспроизводим звук уничтожения
          this.audioSystem.play("explosion")

          // Воспроизводим звук получения очков
          this.audioSystem.play("score")

          // Если это был босс, воспроизводим специальный звук победы над боссом
          if (monster.isBoss) {
            this.audioSystem.play("bossDefeat")

            // Для iOS устройств добавляем сильную тактильную обратную связь
            if (this.audioSystem.isIOSDevice && this.vibrationEnabled) {
              this.audioSystem.playTactileFeedback("heavy")
              setTimeout(() => this.audioSystem.playTactileFeedback("success"), 300)
            }

            // Очищаем все снаряды при победе над боссом
            this.projectiles = []

            // Создаем большой взрыв
            for (let j = 0; j < 5; j++) {
              setTimeout(() => {
                const randomX = monster.x + (Math.random() * 100 - 50)
                const randomY = monster.y + (Math.random() * 100 - 50)
                this.particles.createExplosion(randomX, randomY, "#FF0000", 30)
              }, j * 200)
            }
          }

          // Create explosion effect EXACTLY at monster position
          this.particles.createExplosion(
            monster.x,
            monster.y,
            monster.isBoss ? "#FF0000" : "#00FF00",
            monster.isBoss ? 40 : 20,
          )

          // Проверяем, нужно ли создать бонус
          if (!monster.isBoss && Math.random() < this.bonusSpawnChance) {
            this.spawnBonus(monster.x, monster.y)
          }

          // Проверяем, является ли монстр разделителем
          if (monster.isSplitter) {
            this.splitMonster(monster)
          }

          // Remove monster
          this.monsters.splice(i, 1)
        }

        // Break loop since we already hit a monster
        break
      }
    }

    // If no monster hit, check for projectile hits
    if (!hit) {
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const projectile = this.projectiles[i]

        // Distance from click to projectile center
        const distance = Math.sqrt(Math.pow(x - projectile.x, 2) + Math.pow(y - projectile.y, 2))

        // Увеличенная зона нажатия на 30% для мобильных устройств
        if (distance <= projectile.size * this.hitboxSize) {
          // Hit a projectile!
          hit = true

          if (this.debugMode) {
            console.log(`Hit projectile at position: x=${projectile.x.toFixed(2)}, y=${projectile.y.toFixed(2)}`)
          }

          // Проверяем, является ли снаряд бонусом
          if (projectile.isBonus) {
            this.collectBonus(projectile.bonusType || "points")

            // Вибрация при сборе бонуса
            if (navigator.vibrate && this.vibrationEnabled) {
              navigator.vibrate([30, 50, 30])
            } else if (this.audioSystem.isIOSDevice && this.vibrationEnabled) {
              this.audioSystem.playTactileFeedback("success")
            }

            // Воспроизводим звук сбора бонуса
            this.audioSystem.play("score")

            // Создаем эффект сбора бонуса
            this.particles.createExplosion(projectile.x, projectile.y, "#FFFF00", 25)
          } else {
            // Вибрация при уничтожении снаряда
            if (navigator.vibrate && this.vibrationEnabled) {
              navigator.vibrate(30)
            } else if (this.audioSystem.isIOSDevice && this.vibrationEnabled) {
              // Используем аудио-тактильную обратную связь для iOS
              this.audioSystem.playTactileFeedback("light")
            }

            // Воспроизводим звук уничтожения
            this.audioSystem.play("explosion")

            // Create explosion effect EXACTLY at projectile position
            this.particles.createExplosion(projectile.x, projectile.y, "#FF8800", 15)

            // Add points
            this.score += 1
            this.onScoreChange(this.score)

            // Воспроизводим звук получения очков
            this.audioSystem.play("score")
          }

          // Remove projectile
          this.projectiles.splice(i, 1)

          // Break loop since we already hit a projectile
          break
        }
      }
    }

    // If nothing hit, create small miss effect
    if (!hit) {
      if (this.debugMode) {
        console.log(`Miss!`)
      }
      this.particles.createExplosion(x, y, "#FFFFFF", 5)
    }

    // Проверяем, достигли ли мы порогов счета
    this.checkScoreThresholds()
  }

  // Проверка достижения порогов счета
  private checkScoreThresholds() {
    // Проверяем, пересекли ли мы порог счета
    for (const threshold of this.scoreThresholds) {
      if (this.lastScore < threshold && this.score >= threshold) {
        // Воспроизводим звук достижения высокого счета
        this.audioSystem.play("highScore")

        // Воспроизводим звук повышения уровня
        this.audioSystem.play("levelUp")
        break
      }
    }

    // Обновляем последний счет
    this.lastScore = this.score
  }

  // Проверка и обновление уровня сложности
  private updateDifficulty(timestamp: number) {
    // Вычисляем, сколько времени прошло с начала игры
    const gameTimeElapsed = timestamp - this.gameStartTime
    this.gameTime = gameTimeElapsed

    // Каждые 30 секунд увеличиваем сложность
    if (gameTimeElapsed > 30000 && this.difficultyLevel === 0) {
      this.difficultyLevel = 1
      this.projectileInterval = 3 // Уменьшаем интервал до 3 секунд
      this.monstersPerWave = 2 // Увеличиваем количество монстров до 2
      this.lastDifficultyIncrease = gameTimeElapsed
      console.log("Difficulty increased to level 1: Projectile interval = 3s, Monsters per wave = 2")

      // Воспроизводим звук повышения уровня
      this.audioSystem.play("levelUp")

      // Вызываем колбэк увеличения сложности
      this.onDifficultyIncrease(this.difficultyLevel, this.monstersPerWave)
    } else if (gameTimeElapsed > 60000 && this.difficultyLevel === 1) {
      this.difficultyLevel = 2
      this.projectileInterval = 2 // Уменьшаем интервал до 2 секунд
      this.monstersPerWave = 3 // Увеличиваем количество монстров до 3
      this.lastDifficultyIncrease = gameTimeElapsed
      console.log("Difficulty increased to level 2: Projectile interval = 2s, Monsters per wave = 3")

      // Воспроизводим звук повышения уровня
      this.audioSystem.play("levelUp")

      // Вызываем колбэк увеличения сложности
      this.onDifficultyIncrease(this.difficultyLevel, this.monstersPerWave)
    } else if (gameTimeElapsed > 90000 && this.difficultyLevel === 2) {
      this.difficultyLevel = 3
      this.projectileInterval = 1.5 // Уменьшаем интервал до 1.5 секунд
      this.monstersPerWave = 4 // Увеличиваем количество монстров до 4
      this.lastDifficultyIncrease = gameTimeElapsed
      console.log("Difficulty increased to level 3: Projectile interval = 1.5s, Monsters per wave = 4")

      // Воспроизводим звук повышения уровня
      this.audioSystem.play("levelUp")

      // Вызываем колбэк увеличения сложности
      this.onDifficultyIncrease(this.difficultyLevel, this.monstersPerWave)
    } else if (gameTimeElapsed > 120000 && this.difficultyLevel === 3) {
      this.difficultyLevel = 4
      this.projectileInterval = 1 // Уменьшаем интервал до 1 секунды
      this.monstersPerWave = 5 // Увеличиваем количество монстров до 5
      this.lastDifficultyIncrease = gameTimeElapsed
      console.log("Difficulty increased to level 4: Projectile interval = 1s, Monsters per wave = 5")

      // Воспроизводим звук повышения уровня
      this.audioSystem.play("levelUp")

      // Вызываем колбэк увеличения сложности
      this.onDifficultyIncrease(this.difficultyLevel, this.monstersPerWave)
    }
  }

  // Play sound
  private playSound(sound: string) {
    if (this.muted) return

    // Воспроизводим звук через аудиосистему
    this.audioSystem.play(sound)
  }

  // Toggle sound mute
  public toggleMute() {
    this.muted = !this.muted
    this.audioSystem.setMute(this.muted)
    return this.muted
  }

  // Установка громкости
  public setVolume(volume: number) {
    this.audioSystem.setVolume(volume)
  }

  // Получение текущей громкости
  public getVolume(): number {
    return this.audioSystem.getVolume()
  }

  // Установка громкости музыки
  public setMusicVolume(volume: number) {
    this.audioSystem.setMusicVolume(volume)
  }

  // Получение текущей громкости музыки
  public getMusicVolume(): number {
    return this.audioSystem.getMusicVolume()
  }

  // Start game
  public start() {
    this.gameActive = true
    this.score = 0
    this.lives = 3
    this.monsters = []
    this.projectiles = []
    this.particles.clear()
    this.lastMonsterSpawn = 0
    this.lastBossSpawn = 0
    this.lastScore = 0
    this.gameStartTime = performance.now() // Запоминаем время начала игры
    this.difficultyLevel = 0 // Сбрасываем уровень сложности
    this.projectileInterval = 4 // Сбрасываем интервал метания снарядов
    this.currentBossIndex = 0 // Сбрасываем индекс босса
    this.specialAttackActive = false // Сбрасываем флаг специальной атаки
    this.gameTime = 0 // Сбрасываем время игры
    this.lastSpecialAttackTime = 0 // Сбрасываем время последней специальной атаки
    this.monstersPerWave = 1 // Сбрасываем количество монстров в волне
    this.lastDifficultyIncrease = 0 // Сбрасываем время последнего увеличения сложности

    this.onScoreChange(this.score)
    this.onLivesChange(this.lives)

    // Воспроизводим звук старта игры
    this.audioSystem.play("start")

    // Воспроизводим звук кнопки
    this.audioSystem.play("button")

    // Start game loop
    this.gameLoop(0)
  }

  // Restart game
  public restart() {
    this.start()
  }

  // Stop game and clean up
  public destroy() {
    this.gameActive = false

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    // Очищаем таймаут специальной атаки
    if (this.specialAttackTimeout) {
      clearTimeout(this.specialAttackTimeout)
      this.specialAttackTimeout = null
    }

    // Remove event listeners
    this.canvas.removeEventListener("click", this.handleClick)
    this.canvas.removeEventListener("touchstart", this.handleTouch)

    // Disconnect ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    // Останавливаем фоновую музыку и освобождаем ресурсы аудиосистемы
    if (this.audioSystem) {
      this.audioSystem.stopBackgroundMusic()
      this.audioSystem.dispose()
    }
  }

  // Main game loop
  private gameLoop = (timestamp: number) => {
    try {
      if (!this.gameActive) return

      // Оптимизация для мобильных устройств - пропускаем кадры при низкой производительности
      const now = performance.now()
      const elapsed = now - this.lastFrameTime

      // Если прошло менее 16.7 мс (60 FPS), пропускаем кадр на слабых устройствах
      if (this.lowPerformanceMode && elapsed < 16.7) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop)
        return
      }

      this.lastFrameTime = now

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // If images loaded, update game
      if (this.imagesLoaded) {
        // Обновляем уровень сложности
        this.updateDifficulty(timestamp)

        // Draw animated background
        this.drawAnimatedBackground(timestamp)

        // Spawn monsters
        this.spawnMonsters(timestamp)

        // Update and draw monsters
        this.updateMonsters(timestamp)

        // Update and draw projectiles
        this.updateProjectiles()

        // Update and draw particles
        this.particles.update()

        // Draw click marker if active
        this.drawClickMarker(timestamp)

        // Отображаем комбо, если оно активно
        if (this.comboCount > 1) {
          const comboOpacity = Math.min(1, (now - this.lastKillTime) / this.comboTimeout)
          this.ctx.fillStyle = `rgba(255, 255, 0, ${1 - comboOpacity})`
          this.ctx.font = "24px Arial"
          this.ctx.textAlign = "center"
          this.ctx.fillText(`Combo x${this.comboMultiplier} (${this.comboCount})`, this.canvas.width / 2, 30)
        }

        // Отображаем индикатор энергии
        const energyPercentage = this.energy / this.maxEnergy
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        this.ctx.fillRect(10, this.canvas.height - 30, 200, 20)
        this.ctx.fillStyle = `rgb(${255 * (1 - energyPercentage)}, ${255 * energyPercentage}, 0)`
        this.ctx.fillRect(10, this.canvas.height - 30, 200 * energyPercentage, 20)
        this.ctx.strokeStyle = "white"
        this.ctx.strokeRect(10, this.canvas.height - 30, 200, 20)
        this.ctx.fillStyle = "white"
        this.ctx.font = "12px Arial"
        this.ctx.textAlign = "center"
        this.ctx.fillText(`Energy: ${Math.floor(this.energy)}/${this.maxEnergy}`, 110, this.canvas.height - 17)

        // Отображаем текущий уровень сложности (для отладки)
        if (this.debugMode) {
          this.ctx.fillStyle = "white"
          this.ctx.font = "12px Arial"
          this.ctx.textAlign = "left"
          this.ctx.fillText(`Difficulty: ${this.difficultyLevel} (${this.projectileInterval}s)`, 10, 20)
          this.ctx.fillText(`Boss: ${this.currentBossIndex}`, 10, 40)
          this.ctx.fillText(`Game Time: ${Math.floor(this.gameTime / 1000)}s`, 10, 60)
          this.ctx.fillText(`Monsters per wave: ${this.monstersPerWave}`, 10, 80)
        }

        // Отображаем предупреждение о специальной атаке
        if (this.specialAttackActive) {
          this.ctx.fillStyle = "red"
          this.ctx.font = "24px Arial"
          this.ctx.textAlign = "center"
          this.ctx.fillText("BOSS SPECIAL ATTACK!", this.canvas.width / 2, 50)
        }
      } else {
        // Show loading message
        this.ctx.fillStyle = "white"
        this.ctx.font = "20px Arial"
        this.ctx.textAlign = "center"
        this.ctx.fillText("Loading images...", this.canvas.width / 2, this.canvas.height / 2)
      }

      // Continue the game loop
      this.animationFrameId = requestAnimationFrame(this.gameLoop)
    } catch (error) {
      console.error("Error in game loop:", error)

      // Пытаемся восстановить игровой цикл
      this.animationFrameId = requestAnimationFrame(this.gameLoop)
    }
  }

  // Draw animated background
  private drawAnimatedBackground(timestamp: number) {
    // Черный фон
    this.ctx.fillStyle = "#000000"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Параллакс эффект
    const parallaxSpeed = 0.002
    const offsetX = (timestamp * parallaxSpeed) % this.canvas.width

    // Звезды с разными размерами и яркостью
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() * this.canvas.width + offsetX) % this.canvas.width
      const y = Math.random() * this.canvas.height
      const size = Math.random() * 1.5 + 0.5
      const opacity = Math.random() * 0.8 + 0.2

      // Мерцание звезд
      const flicker = 0.7 + Math.sin(timestamp * 0.001 + i) * 0.3

      // Разные цвета для звезд
      const hue = Math.random() * 60 // От синего до фиолетового
      const saturation = Math.random() * 50 + 50
      const lightness = Math.random() * 20 + 80

      this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * flicker})`
      this.ctx.beginPath()
      this.safeArc(x, y, size, 0, Math.PI * 2)
      this.ctx.fill()

      // Добавляем свечение для некоторых звезд
      if (Math.random() > 0.8) {
        this.ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
        this.ctx.shadowBlur = 5
        this.ctx.fill()
        this.ctx.shadowBlur = 0
      }
    }

    // Добавляем несколько туманностей
    for (let i = 0; i < 2; i++) {
      const x = (Math.random() * this.canvas.width + offsetX * 0.5) % this.canvas.width
      const y = Math.random() * this.canvas.height
      const size = Math.random() * 150 + 100
      const opacity = Math.random() * 0.05 + 0.02

      // Разные цвета для туманностей
      const colors = [
        [100, 0, 200], // Фиолетовый
        [0, 50, 200], // Синий
        [200, 0, 100], // Розовый
        [0, 200, 100], // Зеленый
      ]

      const color = colors[Math.floor(Math.random() * colors.length)]

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 2})`)
      gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.safeArc(x, y, size, 0, Math.PI * 2)
      this.ctx.fill()
    }

    // Добавляем тонкие линии, имитирующие космическую сетку
    this.ctx.strokeStyle = "rgba(50, 50, 150, 0.1)"
    this.ctx.lineWidth = 0.5

    // Горизонтальные линии
    for (let i = 0; i < 5; i++) {
      const y = Math.random() * this.canvas.height
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.canvas.width, y)
      this.ctx.stroke()
    }

    // Вертикальные линии
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.canvas.width
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.canvas.height)
      this.ctx.stroke()
    }
  }

  // Draw click marker
  private drawClickMarker(timestamp: number) {
    if (!this.clickMarker.active) return

    // Маркер активен только для 500ms (увеличиваем время отображения)
    const elapsed = timestamp - this.clickMarker.time
    if (elapsed > 500) {
      this.clickMarker.active = false
      return
    }

    // Сохраняем текущее состояние контекста
    this.ctx.save()

    // Используем режим наложения для более яркого эффекта
    this.ctx.globalCompositeOperation = "lighter"

    // Вычисляем параметры анимации
    const progress = elapsed / 500
    const size = 50 * (1 - progress)
    const opacity = 1 - progress
    const pulseEffect = Math.sin(progress * Math.PI * 6) * 8 // Усиленный пульсирующий эффект

    // Внешний круг с градиентом
    const gradient = this.ctx.createRadialGradient(
      this.clickMarker.x,
      this.clickMarker.y,
      0,
      this.clickMarker.x,
      this.clickMarker.y,
      Math.abs(size + pulseEffect),
    )

    // Более яркие и насыщенные цвета
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
    gradient.addColorStop(0.3, `rgba(100, 200, 255, ${opacity * 0.8})`)
    gradient.addColorStop(0.6, `rgba(100, 100, 255, ${opacity * 0.5})`)
    gradient.addColorStop(1, `rgba(50, 50, 255, 0)`)

    this.ctx.beginPath()
    this.safeArc(this.clickMarker.x, this.clickMarker.y, Math.abs(size + pulseEffect), 0, Math.PI * 2)
    this.ctx.fillStyle = gradient
    this.ctx.fill()

    // Внутренний круг с пульсацией
    this.ctx.beginPath()
    this.safeArc(
      this.clickMarker.x,
      this.clickMarker.y,
      size * 0.6 + Math.sin(progress * Math.PI * 8) * 3,
      0,
      Math.PI * 2,
    )
    this.ctx.strokeStyle = `rgba(200, 220, 255, ${opacity * 1.2})`
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    // Крестик в центре с эффектом вращения и пульсации
    const crossSize = 15 * (1 - progress * 0.7)
    const rotation = progress * Math.PI * 2 // Полное вращение крестика

    this.ctx.translate(this.clickMarker.x, this.clickMarker.y)
    this.ctx.rotate(rotation)

    // Пульсирующая толщина линий
    this.ctx.lineWidth = 2 + Math.sin(progress * Math.PI * 10) * 1

    this.ctx.beginPath()
    this.ctx.moveTo(-crossSize, 0)
    this.ctx.lineTo(crossSize, 0)
    this.ctx.moveTo(0, -crossSize)
    this.ctx.lineTo(0, crossSize)
    this.ctx.strokeStyle = `rgba(150, 200, 255, ${opacity * 1.5})`
    this.ctx.stroke()

    // Добавляем дополнительные частицы вокруг точки нажатия
    const particleCount = 3
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.PI * 2 * (i / particleCount) + progress * Math.PI
      const distance = size * 0.8
      const particleX = Math.cos(angle) * distance
      const particleY = Math.sin(angle) * distance
      const particleSize = 3 * (1 - progress)

      this.ctx.beginPath()
      this.safeArc(particleX, particleY, particleSize, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`
      this.ctx.fill()
    }

    // Восстанавливаем состояние контекста
    this.ctx.restore()
  }

  // Spawn monsters periodically
  private spawnMonsters(timestamp: number) {
    // Spawn regular monsters every 1-2 seconds
    if (timestamp - this.lastMonsterSpawn > 1000 + Math.random() * 1000) {
      // Создаем несколько монстров в зависимости от текущего уровня сложности
      for (let i = 0; i < this.monstersPerWave; i++) {
        this.spawnRegularMonster()
      }
      this.lastMonsterSpawn = timestamp
    }

    // Spawn boss every 30 seconds
    if (timestamp - this.lastBossSpawn > 30000) {
      this.spawnBossMonster()
      this.lastBossSpawn = timestamp
    }
  }

  // Spawn boss monster
  public spawnBossMonster() {
    const bossType = this.bossSequence[this.currentBossIndex % this.bossSequence.length]
    const bossImage = this.bossImages.get(bossType)

    if (!bossImage) {
      console.warn(`No image found for boss type: ${bossType}, using default.`)
    }

    const boss = this.createMonster({
      x: this.canvas.width / 2,
      y: this.canvas.height / 4,
      width: this.BOSS_SIZE,
      height: this.BOSS_SIZE,
      health: 10 + this.difficultyLevel * 5,
      isBoss: true,
      bossType: bossType,
      specialAttackCooldown: 10000, // 10 секунд
      lastSpecialAttack: 0,
      moveSpeed: 0.5 + this.difficultyLevel * 0.1,
      moveDirection: { x: Math.random() - 0.5, y: Math.random() - 0.5 },
    })

    // Нормализуем направление движения
    const magnitude = Math.sqrt(boss.moveDirection.x ** 2 + boss.moveDirection.y ** 2)
    if (magnitude > 0) {
      // Add this check to prevent division by zero
      boss.moveDirection.x /= magnitude
      boss.moveDirection.y /= magnitude
    }

    // Добавляем эффект появления босса
    this.particles.createMonsterSpawnEffect(boss.x, boss.y, boss.width, true)

    // Воспроизводим звук появления босса
    this.audioSystem.play("bossAppear")

    this.monsters.push(boss)

    // Вызываем колбэк появления босса
    this.onBossAppear(bossType)

    // Увеличиваем индекс босса
    this.currentBossIndex++
  }

  // Обновим метод spawnRegularMonster, чтобы создавать разные типы монстров
  private spawnRegularMonster() {
    if (this.monsterImages.length === 0) return

    // Определяем тип монстра случайным образом
    const monsterTypeRoll = Math.random()
    let monsterType = MonsterType.REGULAR
    let hasShield = false
    let shieldHealth = 0
    let isSplitter = false
    let splitCount = 0
    let splitSize = 0
    let health = 1

    // 60% обычные, 25% с щитом, 15% разделители
    if (monsterTypeRoll < 0.6) {
      monsterType = MonsterType.REGULAR
    } else if (monsterTypeRoll < 0.85) {
      monsterType = MonsterType.SHIELDED
      hasShield = true
      shieldHealth = 1 + Math.floor(Math.random() * 2) // 1-2 единицы щита
      health = 1
    } else {
      monsterType = MonsterType.SPLITTER
      isSplitter = true
      splitCount = 2 + Math.floor(Math.random() * 2) // 2-3 маленьких монстра
      splitSize = this.MONSTER_SIZE * 0.6 // 60% от размера родителя
      health = 1
    }

    // Создаем монстра с новыми свойствами
    const monster = this.createMonster({
      health,
      monsterType,
      hasShield,
      shieldHealth,
      isSplitter,
      splitCount,
      splitSize,
    })

    // Добавляем эффект появления монстра
    this.particles.createMonsterSpawnEffect(monster.x, monster.y, monster.width, false)

    // Воспроизводим звук появления монстра
    this.audioSystem.play("monster")

    this.monsters.push(monster)
  }

  // Обновим метод createMonster, чтобы учитывать новые свойства
  private createMonster(options: Partial<Monster> = {}): Monster {
    const size = options.isBoss ? this.BOSS_SIZE : this.MONSTER_SIZE
    const margin = size / 2 + 10

    // Default monster properties
    const defaultMonster: Monster = {
      x: margin + Math.random() * (this.canvas.width - margin * 2),
      y: margin + Math.random() * (this.canvas.height / 3),
      width: size,
      height: size,
      health: options.isBoss ? 5 : 1,
      isBoss: false,
      imageIndex: Math.floor(Math.random() * this.monsterImages.length),
      spawnTime: performance.now(),
      hasLaunchedProjectile: false,
      bossType: null,
      specialAttackCooldown: 0,
      lastSpecialAttack: 0,
      moveSpeed: 0,
      moveDirection: { x: 0, y: 0 },
      // Новые свойства с значениями по умолчанию
      monsterType: MonsterType.REGULAR,
      hasShield: false,
      shieldHealth: 0,
      isSplitter: false,
      splitCount: 0,
      splitSize: 0,
    }

    // Merge with provided options
    return { ...defaultMonster, ...options }
  }

  // Метод для создания бонуса
  private spawnBonus(x: number, y: number) {
    // Выбираем случайный тип бонуса
    const bonusType = this.bonusTypes[Math.floor(Math.random() * this.bonusTypes.length)]

    // Определяем цвет бонуса в зависимости от типа
    let color
    switch (bonusType) {
      case "points":
        color = "#FFFF00" // Желтый для очков
        break
      case "life":
        color = "#FF0000" // Красный для жизни
        break
      case "slowdown":
        color = "#00FFFF" // Голубой для замедления
        break
      case "shield":
        color = "#0000FF" // Синий для щита
        break
      case "energy":
        color = "#FF00FF" // Фиолетовый для энергии
        break
      default:
        color = "#FFFFFF"
    }

    // Создаем снаряд-бонус
    this.projectiles.push({
      x,
      y,
      size: 30,
      speedX: (Math.random() - 0.5) * 0.5, // Медленное движение в случайном направлении
      speedY: 0.5, // Медленное падение вниз
      fromBoss: false,
      isBonus: true,
      bonusType,
      color,
    })
  }

  // Метод для сбора бонуса
  private collectBonus(bonusType: string) {
    switch (bonusType) {
      case "points":
        // Активируем временный множитель очков
        this.pointsMultiplierActive = true
        this.pointsMultiplierValue = 2

        // Сбрасываем множитель через определенное время
        setTimeout(() => {
          this.pointsMultiplierActive = false
        }, this.pointsMultiplierDuration)
        break

      case "life":
        // Добавляем жизнь (максимум 5)
        if (this.lives < 5) {
          this.lives++
          this.onLivesChange(this.lives)

          // Воспроизводим звук получения жизни
          this.audioSystem.play("gainLife")
        }
        break

      case "slowdown":
        // Активируем замедление всех монстров
        this.slowdownActive = true

        // Сбрасываем замедление через определенное время
        setTimeout(() => {
          this.slowdownActive = false
        }, this.slowdownDuration)
        break

      case "shield":
        // Активируем щит
        this.activateShield()
        break

      case "energy":
        // Добавляем энергию
        this.addEnergy(25)
        break
    }

    // Создаем улучшенный эффект сбора бонуса
    this.particles.createBonusCollectEffect(this.canvas.width / 2, this.canvas.height / 2, bonusType)

    // Вызываем колбэк сбора бонуса
    this.onBonusCollected(bonusType)
  }

  // Метод для разделения монстра на маленькие части
  private splitMonster(monster: Monster) {
    // Создаем маленьких монстров
    for (let i = 0; i < monster.splitCount; i++) {
      // Вычисляем случайное смещение от позиции родителя
      const offsetX = (Math.random() - 0.5) * monster.width
      const offsetY = (Math.random() - 0.5) * monster.height

      // Создаем маленького монстра
      const smallMonster = this.createMonster({
        x: monster.x + offsetX,
        y: monster.y + offsetY,
        width: monster.splitSize,
        height: monster.splitSize,
        health: 1,
        monsterType: MonsterType.REGULAR,
        hasShield: false,
        isSplitter: false,
      })

      this.monsters.push(smallMonster)
    }
  }

  // Метод для добавления энергии
  private addEnergy(amount: number) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount)
    this.onEnergyChange(this.energy, this.maxEnergy)
  }

  // Методы для активации специальных способностей
  public activateTimeFreeze() {
    if (this.energy >= 50) {
      // Тратим энергию
      this.energy -= 50
      this.onEnergyChange(this.energy, this.maxEnergy)

      // Активируем заморозку времени
      this.isFrozen = true

      // Воспроизводим звук активации способности
      this.audioSystem.play("specialAbility")

      // Вызываем колбэк активации способности
      this.onSpecialAbilityActivated("timeFreeze", this.timeFreezeDuration / 1000)

      // Сбрасываем заморозку через определенное время
      setTimeout(() => {
        this.isFrozen = false
      }, this.timeFreezeDuration)
    }
  }

  public activateExplosiveWave() {
    if (this.energy >= 75) {
      // Тратим энергию
      this.energy -= 75
      this.onEnergyChange(this.energy, this.maxEnergy)

      // Воспроизводим звук взрывной волны
      this.audioSystem.play("explosiveWave")

      // Уничтожаем всех монстров на экране
      for (let i = this.monsters.length - 1; i >= 0; i--) {
        const monster = this.monsters[i]

        // Боссы не уничтожаются, но получают урон
        if (monster.isBoss) {
          monster.health -= 2

          // Если босс уничтожен
          if (monster.health <= 0) {
            this.monsters.splice(i, 1)

            // Добавляем очки за уничтожение босса
            this.score += 20
            this.onScoreChange(this.score)
          }
        } else {
          // Создаем эффект взрыва для каждого монстра
          this.particles.createExplosion(monster.x, monster.y, "#FF0000", 20)

          // Удаляем монстра
          this.monsters.splice(i, 1)

          // Добавляем очки за уничтожение монстра
          this.score += 1
          this.onScoreChange(this.score)
        }
      }

      // Уничтожаем все снаряды
      this.projectiles = this.projectiles.filter((p) => p.isBonus)

      // Создаем эффект взрывной волны по всему экрану
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const x = Math.random() * this.canvas.width
          const y = Math.random() * this.canvas.height
          this.particles.createExplosion(x, y, "#FF0000", 30)
        }, i * 100)
      }

      // Вызываем колбэк активации способности
      this.onSpecialAbilityActivated("explosiveWave", 0)
    }
  }

  public activateShield() {
    if (this.energy >= 60) {
      // Тратим энергию
      this.energy -= 60
      this.onEnergyChange(this.energy, this.maxEnergy)

      // Активируем щит
      this.shieldActive = true

      // Воспроизводим звук активации щита
      this.audioSystem.play("shield")

      // Вызываем колбэк активации способности
      this.onSpecialAbilityActivated("shield", this.shieldDuration / 1000)

      // Сбрасываем щит через определенное время
      setTimeout(() => {
        this.shieldActive = false
      }, this.shieldDuration)
    }
  }

  // Update and draw monsters
  private updateMonsters(timestamp: number) {
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const monster = this.monsters[i]

      // Если активна заморозка времени, замедляем движение монстров
      const moveSpeedMultiplier = this.isFrozen ? 0.2 : 1

      // Обновляем позицию босса, если он двигается
      if (monster.isBoss && monster.moveSpeed > 0) {
        // Обновляем позицию с учетом замедления
        monster.x += monster.moveDirection.x * monster.moveSpeed * moveSpeedMultiplier
        monster.y += monster.moveDirection.y * monster.moveSpeed * moveSpeedMultiplier

        // Проверяем границы и меняем направление при необходимости
        const margin = monster.width / 2
        if (monster.x - margin < 0 || monster.x + margin > this.canvas.width) {
          monster.moveDirection.x *= -1
        }
        if (monster.y - margin < 0 || monster.y + margin > this.canvas.height / 2) {
          monster.moveDirection.y *= -1
        }
      }

      // Добавляем эффект "дыхания" для всех монстров
      const breathingEffect = Math.sin(timestamp / 500) * 0.05 + 1
      const breathingScale = monster.isBoss ? breathingEffect * 0.5 + 0.95 : breathingEffect

      // Draw monster
      if (monster.isBoss) {
        // Получаем правильное изображение босса
        const bossImage = monster.bossType
          ? this.bossImages.get(monster.bossType)
          : this.bossImages.get(BossType.NORMAL)

        if (bossImage) {
          // Сохраняем контекст для трансформаций
          this.ctx.save()

          // Применяем эффект дыхания и небольшое покачивание
          this.ctx.translate(monster.x, monster.y)
          this.ctx.rotate(Math.sin(timestamp / 1000) * 0.05)
          this.ctx.scale(breathingScale, breathingScale)

          // Добавляем тень для объема
          this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
          this.ctx.shadowBlur = 10
          this.ctx.shadowOffsetX = 5
          this.ctx.shadowOffsetY = 5

          // Draw boss
          this.ctx.drawImage(bossImage, -monster.width / 2, -monster.height / 2, monster.width, monster.height)

          // Восстанавливаем контекст
          this.ctx.restore()
        }

        // Show boss health with улучшенным стилем
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        this.ctx.fillRect(monster.x - 30, monster.y + monster.height / 2 + 10, 60, 15)

        // Полоса здоровья
        const healthPercentage = monster.health / (10 + this.difficultyLevel * 5)
        this.ctx.fillStyle = `rgb(${255 * (1 - healthPercentage)}, ${255 * healthPercentage}, 0)`
        this.ctx.fillRect(monster.x - 30, monster.y + monster.height / 2 + 10, 60 * healthPercentage, 15)

        // Обводка полосы здоровья
        this.ctx.strokeStyle = "white"
        this.ctx.strokeRect(monster.x - 30, monster.y + monster.height / 2 + 10, 60, 15)

        // Текст здоровья
        this.ctx.fillStyle = "white"
        this.ctx.font = "12px Arial"
        this.ctx.textAlign = "center"
        this.ctx.fillText(`${monster.health}`, monster.x, monster.y + monster.height / 2 + 22)

        // Draw crown above boss с эффектом свечения
        this.ctx.save()
        this.ctx.shadowColor = "gold"
        this.ctx.shadowBlur = 10
        this.ctx.font = "24px Arial"
        this.ctx.fillText("👑", monster.x, monster.y - monster.height / 2 - 15)
        this.ctx.restore()

        // Если специальная атака перезаряжается, показываем индикатор
        if (monster.lastSpecialAttack > 0) {
          const cooldownProgress = Math.min(
            (this.gameTime - monster.lastSpecialAttack) / monster.specialAttackCooldown,
            1,
          )

          // Рисуем индикатор перезарядки с градиентом
          const gradient = this.ctx.createLinearGradient(
            monster.x - 25,
            monster.y - monster.height / 2 - 25,
            monster.x + 25,
            monster.y - monster.height / 2 - 25,
          )
          gradient.addColorStop(0, "red")
          gradient.addColorStop(0.5, "yellow")
          gradient.addColorStop(1, "green")

          this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
          this.ctx.fillRect(monster.x - 25, monster.y - monster.height / 2 - 25, 50, 5)

          this.ctx.fillStyle = gradient
          this.ctx.fillRect(monster.x - 25, monster.y - monster.height / 2 - 25, 50 * cooldownProgress, 5)
        }

        // Добавляем периодический эффект частиц вокруг босса
        if (timestamp % 500 < 50) {
          const angle = Math.random() * Math.PI * 2
          const distance = monster.width * 0.6
          const particleX = monster.x + Math.cos(angle) * distance
          const particleY = monster.y + Math.sin(angle) * distance

          this.particles.createExplosion(
            particleX,
            particleY,
            monster.bossType === BossType.CHOMPER
              ? "#FF00FF"
              : monster.bossType === BossType.SPIKY
                ? "#FF4500"
                : monster.bossType === BossType.DEMON
                  ? "#FF0000"
                  : "#FFA500",
            5,
            false,
          )
        }
      } else if (!monster.isBoss && this.monsterImages[monster.imageIndex]) {
        // Сохраняем контекст для трансформаций
        this.ctx.save()

        // Применяем эффект дыхания и небольшое покачивание для обычных монстров
        this.ctx.translate(monster.x, monster.y)
        this.ctx.rotate(Math.sin(timestamp / 800 + monster.imageIndex) * 0.1)
        this.ctx.scale(breathingScale, breathingScale)

        // Добавляем тень для объема
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        this.ctx.shadowBlur = 5
        this.ctx.shadowOffsetX = 3
        this.ctx.shadowOffsetY = 3

        // Draw regular monster
        this.ctx.drawImage(
          this.monsterImages[monster.imageIndex],
          -monster.width / 2,
          -monster.height / 2,
          monster.width,
          monster.height,
        )

        // Восстанавливаем контекст
        this.ctx.restore()

        // Если у монстра есть щит, рисуем его с улучшенным эффектом
        if (monster.hasShield && monster.shieldHealth > 0) {
          // Рисуем щит вокруг монстра с градиентом и свечением
          this.ctx.save()

          // Создаем градиент для щита
          const gradient = this.ctx.createRadialGradient(
            monster.x,
            monster.y,
            monster.width * 0.4,
            monster.x,
            monster.y,
            monster.width * 0.6,
          )
          gradient.addColorStop(0, "rgba(0, 255, 255, 0)")
          gradient.addColorStop(0.7, "rgba(0, 255, 255, 0.3)")
          gradient.addColorStop(1, "rgba(0, 255, 255, 0.7)")

          // Добавляем свечение
          this.ctx.shadowColor = "cyan"
          this.ctx.shadowBlur = 15

          // Рисуем щит
          this.ctx.beginPath()
          this.safeArc(monster.x, monster.y, Math.abs(monster.width * 0.6), 0, Math.PI * 2)
          this.ctx.fillStyle = gradient
          this.ctx.fill()

          this.ctx.lineWidth = 2
          this.ctx.strokeStyle = "rgba(0, 255, 255, 0.8)"
          this.ctx.stroke()

          this.ctx.restore()

          // Добавляем периодический эффект частиц для щита
          if (timestamp % 300 < 30) {
            this.particles.createShieldEffect(monster.x, monster.y, monster.width * 0.6)
          }

          // Показываем здоровье щита с улучшенным стилем
          this.ctx.save()
          this.ctx.shadowColor = "cyan"
          this.ctx.shadowBlur = 5
          this.ctx.fillStyle = "cyan"
          this.ctx.font = "14px Arial"
          this.ctx.textAlign = "center"
          this.ctx.fillText(`${monster.shieldHealth}`, monster.x, monster.y - monster.height / 2 - 10)
          this.ctx.restore()
        }

        // Если монстр является разделителем, показываем индикатор с улучшенным стилем
        if (monster.isSplitter) {
          // Рисуем индикатор разделителя с эффектом свечения
          this.ctx.save()
          this.ctx.shadowColor = "yellow"
          this.ctx.shadowBlur = 10
          this.ctx.font = "16px Arial"
          this.ctx.fillStyle = "yellow"
          this.ctx.textAlign = "center"
          this.ctx.fillText("✂️", monster.x, monster.y - monster.height / 2 - 12)
          this.ctx.restore()

          // Добавляем периодический эффект частиц для разделителя
          if (timestamp % 400 < 40) {
            this.particles.createExplosion(monster.x, monster.y - monster.height / 2 - 5, "#FFFF00", 3, false)
          }
        }
      }

      // Show countdown to projectile launch с улучшенным стилем
      const timeSinceSpawn = timestamp - monster.spawnTime

      // Если активна заморозка времени, замедляем отсчет
      const timeMultiplier = this.isFrozen ? 0.2 : 1
      const adjustedTime = timeSinceSpawn * timeMultiplier

      const timeLeft = Math.max(0, this.projectileInterval - Math.floor(adjustedTime / 1000))

      if (timeLeft > 0 && !monster.hasLaunchedProjectile) {
        // Рисуем фон для таймера
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        this.ctx.beginPath()
        this.safeArc(monster.x, monster.y - monster.height / 2 - 15, 12, 0, Math.PI * 2)
        this.ctx.fill()

        // Рисуем индикатор прогресса
        const progress = 1 - timeLeft / this.projectileInterval
        this.ctx.beginPath()
        this.ctx.moveTo(monster.x, monster.y - monster.height / 2 - 15)
        this.safeArc(
          monster.x,
          monster.y - monster.height / 2 - 15,
          10,
          -Math.PI / 2,
          -Math.PI / 2 + progress * Math.PI * 2,
        )
        this.ctx.closePath()

        // Градиент для индикатора прогресса
        const color =
          progress < 0.5
            ? `rgb(0, ${Math.floor(255 * (progress * 2))}, 0)`
            : `rgb(${Math.floor(255 * ((progress - 0.5) * 2))}, ${Math.floor(255 * (1 - (progress - 0.5) * 2))}, 0)`

        this.ctx.fillStyle = color
        this.ctx.fill()

        // Рисуем текст таймера
        this.ctx.fillStyle = "white"
        this.ctx.font = "bold 12px Arial"
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillText(`${timeLeft}`, monster.x, monster.y - monster.height / 2 - 15)
      }

      // Check if it's time to launch projectile (based on current projectile interval)
      if (adjustedTime >= this.projectileInterval * 1000 && !monster.hasLaunchedProjectile) {
        this.launchProjectile(monster)
        monster.hasLaunchedProjectile = true

        // Remove regular monsters after launching
        if (!monster.isBoss) {
          // Добавляем эффект исчезновения монстра
          this.particles.createExplosion(monster.x, monster.y, "#AAAAAA", 15, false)

          this.monsters.splice(i, 1)
        }
      }

      // For boss monsters, launch projectiles periodically after initial launch
      if (monster.isBoss && monster.hasLaunchedProjectile) {
        // Интервал атаки зависит от типа босса
        let attackInterval = 5000 // По умолчанию каждые 5 секунд (первый босс)

        if (monster.bossType) {
          switch (monster.bossType) {
            case BossType.CHOMPER:
              attackInterval = 5000 // Первый босс - каждые 5 секунд
              break
            case BossType.SPIKY:
              attackInterval = 4000 // Второй босс - каждые 4 секунды
              break
            case BossType.DEMON:
              attackInterval = 3000 // Третий босс - каждые 3 секунды
              break
          }
        }

        // Если активна заморозка времени, увеличиваем интервал атаки
        attackInterval = this.isFrozen ? attackInterval * 5 : attackInterval

        if (timeSinceSpawn % attackInterval < 50) {
          // Выбираем случайную базовую атаку
          const attackPatterns = [AttackPattern.SINGLE, AttackPattern.TRIPLE]
          const randomPattern = attackPatterns[Math.floor(Math.random() * attackPatterns.length)]

          // Добавляем эффект подготовки к атаке
          this.particles.createExplosion(
            monster.x,
            monster.y + monster.height / 2,
            monster.bossType === BossType.CHOMPER
              ? "#FF00FF"
              : monster.bossType === BossType.SPIKY
                ? "#FF4500"
                : monster.bossType === BossType.DEMON
                  ? "#FF0000"
                  : "#FFA500",
            10,
            false,
          )

          this.launchBossAttack(monster, randomPattern)
        }
      }
    }

    // Если активен щит, рисуем его вокруг игрового поля с улучшенным эффектом
    if (this.shieldActive) {
      // Рисуем щит по периметру экрана с градиентом
      this.ctx.save()

      // Создаем градиент для верхней и нижней границы
      const gradientTop = this.ctx.createLinearGradient(0, 0, 0, 10)
      gradientTop.addColorStop(0, "rgba(0, 100, 255, 0.8)")
      gradientTop.addColorStop(1, "rgba(0, 100, 255, 0.2)")

      const gradientBottom = this.ctx.createLinearGradient(0, this.canvas.height - 10, 0, this.canvas.height)
      gradientBottom.addColorStop(0, "rgba(0, 100, 255, 0.2)")
      gradientBottom.addColorStop(1, "rgba(0, 100, 255, 0.8)")

      // Создаем градиент для левой и правой границы
      const gradientLeft = this.ctx.createLinearGradient(0, 0, 10, 0)
      gradientLeft.addColorStop(0, "rgba(0, 100, 255, 0.8)")
      gradientLeft.addColorStop(1, "rgba(0, 100, 255, 0.2)")

      const gradientRight = this.ctx.createLinearGradient(this.canvas.width - 10, 0, this.canvas.width, 0)
      gradientRight.addColorStop(0, "rgba(0, 100, 255, 0.2)")
      gradientRight.addColorStop(1, "rgba(0, 100, 255, 0.8)")

      // Добавляем свечение
      this.ctx.shadowColor = "rgba(0, 100, 255, 0.5)"
      this.ctx.shadowBlur = 15

      // Рисуем границы с градиентами
      this.ctx.fillStyle = gradientTop
      this.ctx.fillRect(0, 0, this.canvas.width, 10)

      this.ctx.fillStyle = gradientBottom
      this.ctx.fillRect(0, this.canvas.height - 10, this.canvas.width, 10)

      this.ctx.fillStyle = gradientLeft
      this.ctx.fillRect(0, 10, 10, this.canvas.height - 20)

      this.ctx.fillStyle = gradientRight
      this.ctx.fillRect(this.canvas.width - 10, 10, 10, this.canvas.height - 20)

      this.ctx.restore()

      // Добавляем эффект пульсации
      const pulseSize = 5 + Math.sin(performance.now() / 200) * 3

      // Создаем градиент для пульсирующей границы
      this.ctx.save()
      this.ctx.strokeStyle = "rgba(0, 150, 255, 0.4)"
      this.ctx.lineWidth = 3
      this.ctx.strokeRect(pulseSize, pulseSize, this.canvas.width - pulseSize * 2, this.canvas.height - pulseSize * 2)
      this.ctx.restore()

      // Добавляем периодический эффект частиц для щита
      if (timestamp % 500 < 50) {
        const side = Math.floor(Math.random() * 4)
        let x, y

        switch (side) {
          case 0: // Верх
            x = Math.random() * this.canvas.width
            y = 5
            break
          case 1: // Право
            x = this.canvas.width - 5
            y = Math.random() * this.canvas.height
            break
          case 2: // Низ
            x = Math.random() * this.canvas.width
            y = this.canvas.height - 5
            break
          case 3: // Лево
            x = 5
            y = Math.random() * this.canvas.height
            break
        }

        this.particles.createShieldEffect(x, y, 20)
      }
    }

    // Если активна заморозка времени, рисуем эффект заморозки с улучшенным стилем
    if (this.isFrozen) {
      // Рисуем эффект заморозки по всему экрану с градиентом
      const gradient = this.ctx.createRadialGradient(
        this.canvas.width / 2,
        this.canvas.height / 2,
        0,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.canvas.width / 2,
      )
      gradient.addColorStop(0, "rgba(0, 200, 255, 0.05)")
      gradient.addColorStop(1, "rgba(0, 200, 255, 0.15)")

      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // Добавляем снежинки с разными размерами и прозрачностью
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * this.canvas.width
        const y = Math.random() * this.canvas.height
        const size = 15 + Math.random() * 10
        const opacity = 0.5 + Math.random() * 0.5

        this.ctx.save()
        this.ctx.globalAlpha = opacity
        this.ctx.font = `${size}px Arial`
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillText("❄️", x, y)
        this.ctx.restore()
      }

      // Добавляем эффект инея по краям экрана
      this.ctx.save()
      this.ctx.globalCompositeOperation = "lighter"

      // Верхний край
      const frostGradientTop = this.ctx.createLinearGradient(0, 0, 0, 30)
      frostGradientTop.addColorStop(0, "rgba(200, 240, 255, 0.4)")
      frostGradientTop.addColorStop(1, "rgba(200, 240, 255, 0)")
      this.ctx.fillStyle = frostGradientTop
      this.ctx.fillRect(0, 0, this.canvas.width, 30)

      // Нижний край
      const frostGradientBottom = this.ctx.createLinearGradient(0, this.canvas.height - 30, 0, this.canvas.height)
      frostGradientBottom.addColorStop(0, "rgba(200, 240, 255, 0)")
      frostGradientBottom.addColorStop(1, "rgba(200, 240, 255, 0.4)")
      this.ctx.fillStyle = frostGradientBottom
      this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30)

      // Левый край
      const frostGradientLeft = this.ctx.createLinearGradient(0, 0, 30, 0)
      frostGradientLeft.addColorStop(0, "rgba(200, 240, 255, 0.4)")
      frostGradientLeft.addColorStop(1, "rgba(200, 240, 255, 0)")
      this.ctx.fillStyle = frostGradientLeft
      this.ctx.fillRect(0, 0, 30, this.canvas.height)

      // Правый край
      const frostGradientRight = this.ctx.createLinearGradient(this.canvas.width - 30, 0, this.canvas.width, 0)
      frostGradientRight.addColorStop(0, "rgba(200, 240, 255, 0)")
      frostGradientRight.addColorStop(1, "rgba(200, 240, 255, 0.4)")
      this.ctx.fillStyle = frostGradientRight
      this.ctx.fillRect(this.canvas.width - 30, 0, 30, this.canvas.height)

      this.ctx.restore()
    }
  }

  // Запускаем атаку босса в зависимости от паттерна
  private launchBossAttack(monster: Monster, pattern: AttackPattern) {
    switch (pattern) {
      case AttackPattern.SINGLE:
        this.launchProjectile(monster)
        break
      case AttackPattern.TRIPLE:
        this.launchTripleProjectiles(monster)
        break
      case AttackPattern.CIRCLE:
        this.launchCircleProjectiles(monster)
        break
      case AttackPattern.WAVE:
        this.launchWaveProjectiles(monster)
        break
    }
  }

  // Запуск трех снарядов веером
  private launchTripleProjectiles(monster: Monster) {
    // Углы для трех снарядов (в градусах) - уменьшаем разброс
    const angles = [-20, 0, 20] // Было [-30, 0, 30]

    // Воспроизводим звук выстрела
    this.playSound("fart")

    // Создаем три снаряда под разными углами
    angles.forEach((angle) => {
      // Конвертируем угол в радианы
      const radians = (angle * Math.PI) / 180

      // Базовая скорость - уменьшаем
      const baseSpeed = monster.isBoss ? 1.2 : 0.8 // Было 1.5 и 1

      // Вычисляем компоненты скорости
      const speedX = Math.sin(radians) * baseSpeed
      const speedY = Math.cos(radians) * baseSpeed

      // Размер снаряда
      const size = monster.isBoss ? 30 : 20

      // Создаем снаряд
      this.projectiles.push({
        x: monster.x,
        y: monster.y + monster.height / 2,
        size,
        speedX,
        speedY,
        fromBoss: monster.isBoss,
        splitOnDestroy: false,
        homingTarget: null,
        color: monster.bossType === BossType.CHOMPER ? "#FF00FF" : undefined, // Фиолетовый для Чомпера
      })
    })
  }

  // Запуск снарядов по кругу
  private launchCircleProjectiles(monster: Monster) {
    // Количество снарядов в круге - уменьшаем
    const projectileCount = 6 // Было 8

    // Воспроизводим звук выстрела
    this.playSound("fart")

    // Создаем снаряды по кругу
    for (let i = 0; i < projectileCount; i++) {
      // Угол для текущего снаряда
      const angle = (i / projectileCount) * Math.PI * 2

      // Базовая скорость - уменьшаем
      const baseSpeed = monster.isBoss ? 1.0 : 0.7 // Было 1.2 и 0.8

      // Вычисляем компоненты скорости
      const speedX = Math.sin(angle) * baseSpeed
      const speedY = Math.cos(angle) * baseSpeed

      // Размер снаряда
      const size = monster.isBoss ? 25 : 18

      // Создаем снаряд
      this.projectiles.push({
        x: monster.x,
        y: monster.y,
        size,
        speedX,
        speedY,
        fromBoss: monster.isBoss,
        splitOnDestroy: false,
        homingTarget: null,
        color: monster.bossType === BossType.SPIKY ? "#FF4500" : undefined, // Оранжевый для Спайки
      })
    }
  }

  // Запуск волны снарядов
  private launchWaveProjectiles(monster: Monster) {
    // Количество снарядов в волне - уменьшаем
    const projectileCount = 3 // Было 5

    // Воспроизводим звук выстрела
    this.playSound("fart")

    // Создаем волну снарядов
    for (let i = 0; i < projectileCount; i++) {
      // Смещение по X
      const offsetX = (i - (projectileCount - 1) / 2) * 50

      // Базовая скорость - уменьшаем
      const baseSpeed = monster.isBoss ? 1.0 : 0.7 // Было 1.3 и 0.9

      // Размер снаряда
      const size = monster.isBoss ? 28 : 20

      // Создаем снаряд
      this.projectiles.push({
        x: monster.x + offsetX,
        y: monster.y + monster.height / 2,
        size,
        speedX: 0,
        speedY: baseSpeed,
        fromBoss: monster.isBoss,
        splitOnDestroy: false,
        homingTarget: null,
        color: monster.bossType === BossType.CHOMPER ? "#FF00FF" : undefined, // Фиолетовый для Чомпера
      })
    }
  }

  // Launch projectile from monster
  private launchProjectile(monster: Monster) {
    const size = monster.isBoss ? 30 : 20

    // Reduce projectile speed
    const baseSpeed = monster.isBoss ? 1.0 : 0.8 // Уменьшаем скорость (было 1.5 и 1)

    // Play projectile sound
    this.playSound("fart")

    // Для разных боссов - разные типы снарядов
    if (monster.isBoss && monster.bossType) {
      switch (monster.bossType) {
        case BossType.CHOMPER:
          // Chomper запускает 3 снаряда веером
          for (let i = -1; i <= 1; i++) {
            const angle = ((Math.random() * 20 - 10 + i * 20) * Math.PI) / 180 // Уменьшаем разброс (было 30-15)
            const speedX = Math.sin(angle) * baseSpeed
            const speedY = Math.cos(angle) * baseSpeed

            this.projectiles.push({
              x: monster.x + i * 20,
              y: monster.y + monster.height / 2,
              size,
              speedX,
              speedY,
              fromBoss: true,
              specialAttack: false,
            })
          }
          break

        case BossType.SPIKY:
          // Spiky запускает быстрые снаряды
          const angle = ((Math.random() * 60 - 30) * Math.PI) / 180 // Уменьшаем разброс (было 90-45)
          const speedX = Math.sin(angle) * baseSpeed * 1.5 // Уменьшаем множитель (было 1.8)
          const speedY = Math.cos(angle) * baseSpeed * 1.5 // Уменьшаем множитель (было 1.8)

          this.projectiles.push({
            x: monster.x,
            y: monster.y + monster.height / 2,
            size: size * 0.8, // Меньше размер
            speedX,
            speedY,
            fromBoss: true,
            specialAttack: false,
          })
          break

        case BossType.DEMON:
          // Demon запускает большой снаряд
          const demonAngle = ((Math.random() * 60 - 30) * Math.PI) / 180 // Уменьшаем разброс (было 90-45)
          const demonSpeedX = Math.sin(demonAngle) * baseSpeed
          const demonSpeedY = Math.cos(demonAngle) * baseSpeed

          this.projectiles.push({
            x: monster.x,
            y: monster.y + monster.height / 2,
            size: size * 1.3, // Больше размер
            speedX: demonSpeedX,
            speedY: demonSpeedY,
            fromBoss: true,
            specialAttack: false,
          })
          break

        default:
          // Стандартный снаряд
          const defaultAngle = ((Math.random() * 60 - 30) * Math.PI) / 180 // Уменьшаем разброс (было 90-45)
          const defaultSpeedX = Math.sin(defaultAngle) * baseSpeed
          const defaultSpeedY = Math.cos(defaultAngle) * baseSpeed

          this.projectiles.push({
            x: monster.x,
            y: monster.y + monster.height / 2,
            size,
            speedX: defaultSpeedX,
            speedY: defaultSpeedY,
            fromBoss: true,
            specialAttack: false,
          })
      }
    } else {
      // Обычные монстры запускают стандартные снаряды
      const angle = ((Math.random() * 60 - 30) * Math.PI) / 180 // Уменьшаем разброс (было 90-45)
      const speedX = Math.sin(angle) * baseSpeed
      const speedY = Math.cos(angle) * baseSpeed

      this.projectiles.push({
        x: monster.x,
        y: monster.y + monster.height / 2,
        size,
        speedX,
        speedY,
        fromBoss: false,
        specialAttack: false,
      })
    }
  }

  // Update projectiles
  private updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i]

      // Если активно замедление, уменьшаем скорость снарядов
      let speedMultiplier = this.slowdownActive ? this.slowdownFactor : 1

      // Если активна заморозка времени, еще больше замедляем снаряды
      if (this.isFrozen) {
        speedMultiplier *= 0.2
      }

      // Move projectile according to its speed
      projectile.x += projectile.speedX * speedMultiplier
      projectile.y += projectile.speedY * speedMultiplier

      // Добавляем след за снарядом, если это не бонус - делаем более редким и менее заметным
      if (!projectile.isBonus && Math.random() > 0.85) {
        // Увеличиваем порог с 0.7 до 0.85, чтобы частицы появлялись реже
        // Определяем цвет следа в зависимости от типа снаряда
        let trailColor = "#8B4513" // Коричневый для обычных снарядов

        if (projectile.specialAttack) {
          trailColor = "#FF00FF" // Фиолетовый для специальных атак
        } else if (projectile.fromBoss) {
          trailColor = "#FF4500" // Оранжевый для снарядов босса
        }

        // Добавляем небольшое случайное смещение для более естественного следа
        const offsetX = (Math.random() - 0.5) * 2
        const offsetY = (Math.random() - 0.5) * 2
        this.particles.createProjectileTrail(
          projectile.x + offsetX,
          projectile.y + offsetY,
          trailColor,
          projectile.fromBoss,
        )
      }

      // Draw projectile (poop emoji or special emoji for special attacks)
      this.ctx.font = `${projectile.size}px Arial`
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"

      // Разные эмодзи для разных типов снарядов
      if (projectile.isBonus) {
        // Рисуем бонус в зависимости от типа
        let bonusEmoji
        switch (projectile.bonusType) {
          case "points":
            bonusEmoji = "💰"
            break
          case "life":
            bonusEmoji = "❤️"
            break
          case "slowdown":
            bonusEmoji = "⏱️"
            break
          case "shield":
            bonusEmoji = "🛡️"
            break
          case "energy":
            bonusEmoji = "⚡"
            break
          default:
            bonusEmoji = "🎁"
        }

        // Добавляем свечение для бонусов
        this.ctx.save()
        this.ctx.shadowColor = projectile.color || "white"
        this.ctx.shadowBlur = 10
        this.ctx.fillText(bonusEmoji, projectile.x, projectile.y)
        this.ctx.restore()
      } else if (projectile.specialAttack) {
        // Добавляем свечение для специальных атак
        this.ctx.save()
        this.ctx.shadowColor = "purple"
        this.ctx.shadowBlur = 15
        this.ctx.fillText("☠️", projectile.x, projectile.y)
        this.ctx.restore()
      } else if (projectile.fromBoss) {
        // Добавляем свечение для снарядов босса
        this.ctx.save()
        this.ctx.shadowColor = "red"
        this.ctx.shadowBlur = 8
        this.ctx.fillText("💩", projectile.x, projectile.y)
        this.ctx.restore()
      } else {
        this.ctx.fillText(this.poopEmoji, projectile.x, projectile.y)
      }

      // Draw hitbox only in debug mode
      if (this.debugMode) {
        this.ctx.beginPath()
        this.safeArc(projectile.x, projectile.y, Math.abs(projectile.size * 1.2), 0, Math.PI * 2)
        this.ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"
        this.ctx.stroke()
      }

      // Check if projectile reached screen edge
      if (
        projectile.x < 0 ||
        projectile.x > this.canvas.width ||
        projectile.y < 0 ||
        projectile.y > this.canvas.height
      ) {
        // Remove projectile
        this.projectiles.splice(i, 1)

        // Если это бонус, просто удаляем его
        if (projectile.isBonus) continue

        // Если активен щит, не теряем жизнь
        if (this.shieldActive) {
          // Создаем эффект блокирования снаряда щитом
          let explosionX = projectile.x
          let explosionY = projectile.y

          // Adjust explosion coordinates to be visible
          if (explosionX < 0) explosionX = 0
          if (explosionX > this.canvas.width) explosionX = this.canvas.width
          if (explosionY < 0) explosionY = 0
          if (explosionY > this.canvas.height) explosionY = this.canvas.height

          this.particles.createExplosion(
            explosionX,
            explosionY,
            "#0000FF", // Синий цвет для эффекта щита
            15,
            true, // Улучшенный эффект
          )

          // Воспроизводим звук блокирования
          this.audioSystem.play("shield")
          continue
        }

        // Lose a life
        this.lives--
        this.onLivesChange(this.lives)

        // Воспроизводим звук потери жизни
        this.audioSystem.play("loseLife")

        // Create explosion effect at screen edge
        let explosionX = projectile.x
        let explosionY = projectile.y

        // Adjust explosion coordinates to be visible
        if (explosionX < 0) explosionX = 0
        if (explosionX > this.canvas.width) explosionX = this.canvas.width
        if (explosionY < 0) explosionY = 0
        if (explosionY > this.canvas.height) explosionY = this.canvas.height

        this.particles.createExplosion(
          explosionX,
          explosionY,
          projectile.specialAttack ? "#FF00FF" : projectile.fromBoss ? "#FF0000" : "#8B4513",
          projectile.specialAttack ? 25 : 15,
          true, // Улучшенный эффект
        )

        // Check game over
        if (this.lives <= 0) {
          this.gameOver()
        }
      }
    }
  }

  // Handle game over
  private gameOver() {
    this.gameActive = false
    cancelAnimationFrame(this.animationFrameId)

    // Очищаем таймаут специальной атаки
    if (this.specialAttackTimeout) {
      clearTimeout(this.specialAttackTimeout)
      this.specialAttackTimeout = null
    }

    // Play game over sound
    this.playSound("gameOver")

    // Для iOS устройств добавляем тактильную обратную связь при проигрыше
    if (this.audioSystem.isIOSDevice && this.vibrationEnabled) {
      this.audioSystem.playTactileFeedback("error")
    }

    this.onGameOver()
  }

  // Добавляем методы для паузы и возобновления игры
  public pauseGame() {
    if (this.gameActive) {
      this.gameActive = false
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = 0
      }
    }
  }

  public resumeGame() {
    if (!this.gameActive && this.lives > 0) {
      this.gameActive = true
      if (this.animationFrameId === 0) {
        this.gameLoop(performance.now())
      }
    }
  }

  // Метод для включения/выключения режима низкой производительности
  public setLowPerformanceMode(enabled: boolean) {
    this.lowPerformanceMode = enabled
  }

  // Метод для включения/выключения вибрации
  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled
  }

  // Add a method to set performance mode:
  public setPerformanceMode(isLowPerformance: boolean) {
    this.lowPerformanceMode = isLowPerformance
  }

  handleTouch(e: TouchEvent) {
    // Предотвращаем стандартное поведение только если касание в игровой области
    if (this.isGameAreaTouch(e)) {
      e.preventDefault()
    }

    const touch = e.touches[0]
    if (touch) {
      this.lastTouchX = touch.clientX
      this.lastTouchY = touch.clientY
      this.handleClick({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent)
    }
  }

  // Добавляем вспомогательный метод для проверки касания в игровой области
  isGameAreaTouch(e: TouchEvent): boolean {
    const touch = e.touches[0]
    if (!touch) return false

    const target = touch.target as HTMLElement
    return target.classList.contains("game-canvas") || target.classList.contains("game-area")
  }
}

// Monster interface
interface Monster {
  x: number
  y: number
  width: number
  height: number
  health: number
  isBoss: boolean
  imageIndex: number // -1 for boss, index in array for regular monsters
  spawnTime: number
  hasLaunchedProjectile: boolean
  bossType: BossType | null
  specialAttackCooldown: number
  lastSpecialAttack: number
  moveSpeed: number
  moveDirection: { x: number; y: number }
  // Новые свойства
  monsterType: MonsterType
  hasShield: boolean
  shieldHealth: number
  isSplitter: boolean
  splitCount: number
  splitSize: number
}

// Projectile interface
interface Projectile {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  fromBoss: boolean
  specialAttack?: boolean
  splitOnDestroy?: boolean
  homingTarget?: any
  color?: string
  isBonus?: boolean
  bonusType?: string
}

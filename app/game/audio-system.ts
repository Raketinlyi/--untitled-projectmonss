/**
 * Ретро-аудиосистема для генерации звуков в стиле 8-бит
 */
export class RetroAudioSystem {
  private audioContext: AudioContext | null = null
  private sounds: { [key: string]: () => void } = {}
  private muted = false
  private masterGain: GainNode | null = null
  private effectsGain: GainNode | null = null // Отдельный контроль громкости для эффектов
  private musicGain: GainNode | null = null // Отдельный контроль громкости для музыки
  private tactileGain: GainNode | null = null // Отдельный контроль для тактильных звуков
  private backgroundMusic: {
    oscillator: OscillatorNode | null
    gainNode: GainNode | null
    isPlaying: boolean
    currentMelody: number
    lastMelodyChange: number
    melodyType: "8bit" | "16bit"
  } = {
    oscillator: null,
    gainNode: null,
    isPlaying: false,
    currentMelody: 0,
    lastMelodyChange: 0,
    melodyType: "8bit",
  }
  private comboCount = 0
  private lastComboTime = 0
  private volume = 0.5 // Общая громкость 50%
  private musicVolume = 0.3 // Громкость музыки 30%
  private isIOS = false // Флаг для определения iOS устройств
  private isAndroid = false // Новый: флаг для определения Android устройств
  private tactileFeedbackEnabled = true // Включена ли тактильная обратная связь

  // Массив мелодий для фоновой музыки (8-битный и 16-битный стиль)
  private melodies: Array<{ notes: number[]; type: "8bit" | "16bit" }> = [
    // Мелодия 1: Бодрая 8-битная мелодия (в стиле игр NES)
    {
      notes: [
        262, 294, 330, 262, 262, 294, 330, 262, 330, 349, 392, 330, 349, 392, 392, 440, 392, 349, 330, 262, 392, 440,
        392, 349, 330, 262, 262, 196, 262, 262, 196, 262,
      ],
      type: "8bit",
    },

    // Мелодия 2: Таинственная 8-битная мелодия
    {
      notes: [
        196, 220, 196, 220, 247, 262, 247, 220, 196, 220, 196, 220, 247, 262, 294, 196, 220, 196, 220, 247, 262, 247,
        220, 196, 165, 147, 165, 196,
      ],
      type: "8bit",
    },

    // Мелодия 3: Боевая 8-битная мелодия
    {
      notes: [
        330, 330, 330, 262, 330, 392, 196, 330, 330, 330, 262, 330, 392, 196, 330, 330, 330, 349, 294, 294, 294, 277,
        262, 262, 262, 294, 330, 262, 220, 196,
      ],
      type: "8bit",
    },

    // Мелодия 4: Эпическая 16-битная мелодия (в стиле SEGA)
    {
      notes: [
        523, 587, 659, 698, 784, 880, 988, 1047, 988, 880, 784, 698, 659, 587, 523, 494, 440, 392, 349, 330, 294, 262,
        247, 220, 196, 175, 165, 147, 131, 123, 110, 98,
      ],
      type: "16bit",
    },

    // Мелодия 5: Драматическая 16-битная мелодия
    {
      notes: [
        523, 523, 523, 415, 466, 523, 466, 415, 392, 392, 392, 349, 392, 415, 349, 311, 294, 294, 294, 311, 349, 392,
        415, 466, 523, 587, 659, 698, 784, 880, 784, 698,
      ],
      type: "16bit",
    },
  ]

  constructor() {
    // Определяем тип устройства
    this.detectDeviceType()

    // Инициализируем AudioContext сразу
    this.initAudio()
    this.createSounds()
  }

  // Обновленный метод: определение типа устройства
  private detectDeviceType() {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase()
      this.isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream
      this.isAndroid = /android/.test(userAgent)

      if (this.isIOS) {
        console.log("iOS устройство обнаружено, будет использоваться аудио-тактильная обратная связь")
      } else if (this.isAndroid) {
        console.log("Android устройство обнаружено, доступна вибрация и аудио-тактильная обратная связь")
      }
    }
  }

  private playNoteSequence(
    notes: Array<{ freq: number; start: number; duration: number; type?: OscillatorType }>,
    volume = 0.3,
  ) {
    if (!this.audioContext || !this.effectsGain) return

    notes.forEach(({ freq, start, duration, type = "square" }) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.type = type
      oscillator.frequency.value = freq

      gainNode.gain.setValueAtTime(volume, this.audioContext!.currentTime + start)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + start + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.effectsGain!)

      oscillator.start(this.audioContext!.currentTime + start)
      oscillator.stop(this.audioContext!.currentTime + start + duration)
    })
  }

  // Инициализация аудиосистемы
  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Создаем основной регулятор громкости
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.volume
      this.masterGain.connect(this.audioContext.destination)

      // Создаем регулятор громкости для звуковых эффектов
      this.effectsGain = this.audioContext.createGain()
      this.effectsGain.gain.value = 1.0 // Полная громкость для эффектов
      this.effectsGain.connect(this.masterGain)

      // Создаем регулятор громкости для музыки
      this.musicGain = this.audioContext.createGain()
      this.musicGain.gain.value = this.musicVolume // 30% громкости для музыки
      this.musicGain.connect(this.masterGain)

      // Создаем регулятор громкости для тактильных звуков
      this.tactileGain = this.audioContext.createGain()
      this.tactileGain.gain.value = 0.7 // 70% громкости для тактильных звуков
      this.tactileGain.connect(this.masterGain)

      console.log("Аудиосистема инициализирована")

      // Автоматически возобновляем контекст при взаимодействии пользователя
      const resumeAudioContext = () => {
        if (this.audioContext && this.audioContext.state === "suspended") {
          this.audioContext.resume()
        }

        // Удаляем обработчики после первого взаимодействия
        document.removeEventListener("click", resumeAudioContext)
        document.removeEventListener("touchstart", resumeAudioContext)
        document.removeEventListener("keydown", resumeAudioContext)
      }

      document.addEventListener("click", resumeAudioContext)
      document.addEventListener("touchstart", resumeAudioContext)
      document.addEventListener("keydown", resumeAudioContext)
    } catch (error) {
      console.error("Ошибка инициализации аудиосистемы:", error)
      this.audioContext = null
    }
  }

  // Создание всех звуковых эффектов
  private createSounds() {
    // Звук попадания по монстру
    this.sounds.hit = () => this.playHitSound()

    // Звук уничтожения монстра
    this.sounds.explosion = () => this.playExplosionSound()

    // Звук выстрела/снаряда
    this.sounds.projectile = () => this.playProjectileSound()
    this.sounds.fart = () => this.playFartSound()

    // Звук проигрыша
    this.sounds.gameOver = () => this.playGameOverSound()

    // Звук появления босса
    this.sounds.boss = () => this.playBossSound()

    // Звук старта игры
    this.sounds.start = () => this.playStartSound()

    // Звук получения очков
    this.sounds.score = () => this.playScoreSound()

    // НОВЫЕ ЗВУКИ

    // Звук потери жизни
    this.sounds.loseLife = () => this.playLoseLifeSound()

    // Звук получения жизни
    this.sounds.gainLife = () => this.playGainLifeSound()

    // Звук комбо
    this.sounds.combo = () => this.playComboSound()

    // Звук достижения высокого счета
    this.sounds.highScore = () => this.playHighScoreSound()

    // Звук нажатия кнопки
    this.sounds.button = () => this.playButtonSound()

    // Звук победы над боссом
    this.sounds.bossDefeat = () => this.playBossDefeatSound()

    // Звук уровня
    this.sounds.levelUp = () => this.playLevelUpSound()

    // Звуки для новых боссов
    this.sounds.chomperAttack = () => this.playChomperAttackSound()
    this.sounds.spikyAttack = () => this.playSpikyAttackSound()
    this.sounds.demonAttack = () => this.playDemonAttackSound()
    this.sounds.specialAttack = () => this.playSpecialAttackSound()

    // Тактильные звуки
    this.sounds.tactileLight = () => this.playTactileLightSound()
    this.sounds.tactileMedium = () => this.playTactileMediumSound()
    this.sounds.tactileHeavy = () => this.playTactileHeavySound()
    this.sounds.tactileSuccess = () => this.playTactileSuccessSound()
    this.sounds.tactileError = () => this.playTactileErrorSound()

    // Новые звуки для специальных способностей и бонусов
    this.sounds.timeFreeze = () => this.playTimeFreezeSound()
    this.sounds.explosiveWave = () => this.playExplosiveWaveSound()
    this.sounds.shield = () => this.playShieldSound()
    this.sounds.specialAbility = () => this.playSpecialAbilitySound()
    this.sounds.bonusCollected = () => this.playBonusCollectedSound()
    this.sounds.comboBreak = () => this.playComboBreakSound()
  }

  // Воспроизведение звука
  public play(soundName: string) {
    if (this.muted || !this.audioContext) return

    // Возобновляем контекст, если он был приостановлен
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume()
    }

    // Воспроизводим звук, если он существует
    if (this.sounds[soundName]) {
      this.sounds[soundName]()

      // Обработка комбо
      if (soundName === "explosion") {
        const now = Date.now()
        if (now - this.lastComboTime < 1000) {
          // Если уничтожили монстра в течение 1 секунды
          this.comboCount++
          if (this.comboCount >= 3) {
            // Комбо из 3+ монстров
            this.playComboSound()
            this.comboCount = 0 // Сбрасываем комбо после воспроизведения
          }
        } else {
          this.comboCount = 1 // Начинаем новое комбо
        }
        this.lastComboTime = now
      }
    }
  }

  // Воспроизведение тактильной обратной связи
  public playTactileFeedback(intensity: "light" | "medium" | "heavy" | "success" | "error") {
    // Если тактильная обратная связь отключена или звук выключен, выходим
    if (!this.tactileFeedbackEnabled || this.muted) return

    // Воспроизводим соответствующий тактильный звук
    switch (intensity) {
      case "light":
        this.playTactileLightSound()
        break
      case "medium":
        this.playTactileMediumSound()
        break
      case "heavy":
        this.playTactileHeavySound()
        break
      case "success":
        this.playTactileSuccessSound()
        break
      case "error":
        this.playTactileErrorSound()
        break
    }
  }

  // Включение/выключение звука
  public toggleMute(): boolean {
    this.muted = !this.muted

    // Если есть masterGain, меняем его значение
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : this.volume
    }

    // Управляем фоновой музыкой
    if (this.muted) {
      this.stopBackgroundMusic()
    } else if (this.backgroundMusic.isPlaying) {
      this.startBackgroundMusic()
    }

    return this.muted
  }

  // Установка состояния звука
  public setMute(muted: boolean): boolean {
    this.muted = muted

    // Если есть masterGain, меняем его значение
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : this.volume
    }

    // Управляем фоновой музыкой
    if (this.muted) {
      this.stopBackgroundMusic()
    } else if (this.backgroundMusic.isPlaying) {
      this.startBackgroundMusic()
    }

    return this.muted
  }

  // Установка общей громкости (0-1)
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume)) // Ограничиваем значение от 0 до 1

    if (this.masterGain && !this.muted) {
      this.masterGain.gain.value = this.volume
    }
  }

  // Получение текущей громкости
  public getVolume(): number {
    return this.volume
  }

  // Установка громкости музыки (0-1)
  public setMusicVolume(volume: number): void {
    // Увеличиваем максимальную громкость музыки до 50% от основной громкости
    this.musicVolume = Math.max(0, Math.min(0.5, volume))

    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume
    }

    // Обновляем громкость текущей фоновой музыки, если она играет
    if (this.backgroundMusic.gainNode) {
      this.backgroundMusic.gainNode.gain.value = this.musicVolume * 0.1 // Увеличиваем множитель (было 0.03)
    }
  }

  // Получение текущей громкости музыки
  public getMusicVolume(): number {
    return this.musicVolume
  }

  // Включение/выключение тактильной обратной связи
  public setTactileFeedbackEnabled(enabled: boolean): void {
    this.tactileFeedbackEnabled = enabled
  }

  // Получение статуса тактильной обратной связи
  public isTactileFeedbackEnabled(): boolean {
    return this.tactileFeedbackEnabled
  }

  // Получение статуса iOS устройства
  public isIOSDevice(): boolean {
    return this.isIOS
  }

  // Получение статуса Android устройства
  public isAndroidDevice(): boolean {
    return this.isAndroid
  }

  // Проверка, заглушен ли звук
  public isMuted(): boolean {
    return this.muted
  }

  // Запуск фоновой музыки
  public startBackgroundMusic() {
    if (!this.audioContext || this.muted) return

    // Останавливаем предыдущую музыку, если она играет
    this.stopBackgroundMusic()

    try {
      // Создаем осциллятор для фоновой музыки
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Используем square wave для 8-битного звучания
      oscillator.type = "square" // 8-битный звук
      oscillator.frequency.value = 262 // Базовая частота (C4)

      // Устанавливаем громкость фоновой музыки
      gainNode.gain.value = this.musicVolume * 0.1

      oscillator.connect(gainNode)
      gainNode.connect(this.musicGain!) // Подключаем к регулятору громкости музыки

      // Сохраняем ссылки для возможности остановки
      this.backgroundMusic.oscillator = oscillator
      this.backgroundMusic.gainNode = gainNode
      this.backgroundMusic.isPlaying = true
      this.backgroundMusic.currentMelody = 0
      this.backgroundMusic.lastMelodyChange = Date.now()

      // Запускаем осциллятор
      oscillator.start()

      // Создаем 8-битную мелодию
      this.playBackgroundMelody()
    } catch (error) {
      console.error("Ошибка запуска фоновой музыки:", error)
    }
  }

  // Воспроизведение мелодии для фоновой музыки
  private playBackgroundMelody() {
    if (!this.audioContext || !this.backgroundMusic.oscillator || !this.backgroundMusic.isPlaying) return

    const oscillator = this.backgroundMusic.oscillator
    const now = this.audioContext.currentTime

    // Проверяем, нужно ли сменить мелодию (каждые 20 секунд)
    const currentTime = Date.now()
    if (currentTime - this.backgroundMusic.lastMelodyChange > 20000) {
      // Переключаемся на следующую мелодию
      this.backgroundMusic.currentMelody = (this.backgroundMusic.currentMelody + 1) % this.melodies.length
      this.backgroundMusic.lastMelodyChange = currentTime

      // Создаем небольшой звуковой эффект при смене мелодии
      this.createMelodyTransitionEffect()
    }

    // Получаем текущую мелодию
    const currentMelody = this.melodies[this.backgroundMusic.currentMelody]

    // Настраиваем параметры в зависимости от типа мелодии (8-бит или 16-бит)
    if (currentMelody.type === "16bit") {
      // 16-битные настройки: более сложная волна и более длинные ноты
      oscillator.type = "sawtooth" // Более богатый звук для 16-бит
      const noteDuration = 0.25 // Более длинные ноты для 16-бит

      // Добавляем эффект для 16-битного звучания
      if (this.audioContext.createBiquadFilter) {
        const filter = this.audioContext.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = 1500
        filter.Q.value = 5

        oscillator.disconnect()
        oscillator.connect(filter)
        filter.connect(this.backgroundMusic.gainNode!)

        // Модуляция для более богатого звука
        if (this.audioContext.createOscillator) {
          const lfo = this.audioContext.createOscillator()
          const lfoGain = this.audioContext.createGain()

          lfo.type = "sine"
          lfo.frequency.value = 5
          lfoGain.gain.value = 10

          lfo.connect(lfoGain)
          lfoGain.connect(filter.frequency)

          lfo.start()
          setTimeout(() => lfo.stop(), currentMelody.notes.length * noteDuration * 1000)
        }
      }

      // Плавные переходы между нотами для 16-битного звучания
      currentMelody.notes.forEach((freq, index) => {
        oscillator.frequency.setValueAtTime(freq, now + index * noteDuration)
        // Добавляем небольшое вибрато для 16-битного звучания
        if (index < currentMelody.notes.length - 1) {
          oscillator.frequency.linearRampToValueAtTime(freq * 1.01, now + index * noteDuration + noteDuration * 0.5)
          oscillator.frequency.linearRampToValueAtTime(freq, now + index * noteDuration + noteDuration * 0.9)
        }
      })
    } else {
      // 8-битные настройки: простая волна и короткие ноты
      oscillator.type = "square" // 8-битный звук
      const noteDuration = 0.2 // Короткие ноты для 8-битного звучания

      // Резкие переходы между нотами для 8-битного звучания
      currentMelody.notes.forEach((freq, index) => {
        oscillator.frequency.setValueAtTime(freq, now + index * noteDuration)
      })

      // Восстанавливаем соединение для 8-битного звучания
      oscillator.disconnect()
      oscillator.connect(this.backgroundMusic.gainNode!)
    }

    // Повторяем мелодию
    setTimeout(
      () => {
        if (this.backgroundMusic.isPlaying) {
          this.playBackgroundMelody()
        }
      },
      currentMelody.notes.length * (currentMelody.type === "16bit" ? 0.25 : 0.2) * 1000,
    )
  }

  // Создаем эффект перехода между мелодиями
  private createMelodyTransitionEffect() {
    if (!this.audioContext || this.muted) return

    try {
      // Создаем короткий 8-битный звуковой эффект для обозначения смены мелодии
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = "square" // 8-битный звук

      // Быстрый арпеджио эффект
      const now = this.audioContext.currentTime
      oscillator.frequency.setValueAtTime(523.25, now) // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(this.musicGain!)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + 0.3)
    } catch (error) {
      console.error("Ошибка создания эффекта перехода:", error)
    }
  }

  // Остановка фоновой музыки
  public stopBackgroundMusic() {
    if (this.backgroundMusic.oscillator) {
      try {
        this.backgroundMusic.oscillator.stop()
      } catch (e) {
        // Игнорируем ошибки при остановке
      }
      this.backgroundMusic.oscillator = null
    }

    if (this.backgroundMusic.gainNode) {
      try {
        this.backgroundMusic.gainNode.disconnect()
      } catch (e) {
        // Игнорируем ошибки при отключении
      }
      this.backgroundMusic.gainNode = null
    }

    this.backgroundMusic.isPlaying = false
  }

  // Генерация звука попадания по монстру (короткий писк)
  private playHitSound() {
    if (!this.audioContext || !this.effectsGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "square" // 8-битный звук
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.05)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain) // Подключаем к регулятору эффектов

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.1)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileLightSound()
    }
  }

  // Генерация звука уничтожения монстра (взрыв)
  private playExplosionSound() {
    if (!this.audioContext || !this.effectsGain) return

    try {
      // Пробуем использовать современный AudioWorkletNode, если доступен
      if (window.AudioWorkletNode && this.audioContext.audioWorklet) {
        // Для простоты в этой версии используем запасной вариант
        this.playExplosionSoundFallback()
      } else {
        // Запасной вариант с устаревшим API
        this.playExplosionSoundFallback()
      }

      // Добавляем тактильную обратную связь, если она включена
      if (this.tactileFeedbackEnabled) {
        this.playTactileMediumSound()
      }
    } catch (error) {
      // В случае ошибки используем запасной вариант
      console.warn("Using fallback audio method:", error)
      this.playExplosionSoundFallback()
    }
  }

  // Добавляем запасной метод для обратной совместимости
  private playExplosionSoundFallback() {
    if (!this.audioContext || !this.effectsGain) return

    const bufferSize = 4096
    const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
    const gainNode = this.audioContext.createGain()

    noiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
    }

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    noiseNode.connect(gainNode)
    gainNode.connect(this.effectsGain)

    // Автоматическое отключение через 0.3 секунды
    setTimeout(() => {
      try {
        noiseNode.disconnect()
        gainNode.disconnect()
      } catch (e) {
        // Игнорируем ошибки при отключении
      }
    }, 300)
  }

  // Генерация звука выстрела/снаряда
  private playProjectileSound() {
    if (!this.audioContext || !this.effectsGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "square" // 8-битный звук
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime)
    oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain) // Подключаем к регулятору эффектов

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.2)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileLightSound()
    }
  }

  // Звук пердежа для снарядов-какашек
  private playFartSound() {
    if (!this.audioContext || !this.effectsGain) return

    try {
      // Создаем основной осциллятор для "пердящего" звука
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Используем "sawtooth" для более "грязного" звука
      oscillator.type = "sawtooth"
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.2)

      // Добавляем модуляцию для "пердящего" эффекта
      const lfo = this.audioContext.createOscillator()
      const lfoGain = this.audioContext.createGain()

      lfo.type = "square"
      lfo.frequency.value = 12 // Частота "пузырьков" в пердеже
      lfoGain.gain.value = 30 // Глубина модуляции

      lfo.connect(lfoGain)
      lfoGain.connect(oscillator.frequency)

      // Настраиваем громкость и затухание
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

      // Добавляем шум для более реалистичного звука
      const bufferSize = 4096
      const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
      const noiseGain = this.audioContext.createGain()

      noiseNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }
      }

      noiseGain.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

      // Соединяем все компоненты
      oscillator.connect(gainNode)
      noiseNode.connect(noiseGain)
      gainNode.connect(this.effectsGain)
      noiseGain.connect(this.effectsGain)

      // Запускаем звуки
      lfo.start()
      oscillator.start()

      // Останавливаем звуки
      lfo.stop(this.audioContext.currentTime + 0.2)
      oscillator.stop(this.audioContext.currentTime + 0.2)

      // Отключаем шумовой узел через 0.2 секунды
      setTimeout(() => {
        try {
          noiseNode.disconnect()
          noiseGain.disconnect()
        } catch (e) {
          // Игнорируем ошибки при отключении
        }
      }, 200)

      // Добавляем тактильную обратную связь, если она включена
      if (this.tactileFeedbackEnabled) {
        this.playTactileLightSound()
      }
    } catch (error) {
      console.error("Ошибка воспроизведения звука пердежа:", error)
    }
  }

  // Генерация звука проигрыша (печальная мелодия)
  private playGameOverSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем 8-битную печальную последовательность нот
    this.playNoteSequence([
      { freq: 392, start: 0, duration: 0.2, type: "square" }, // G4
      { freq: 349.23, start: 0.2, duration: 0.2, type: "square" }, // F4
      { freq: 329.63, start: 0.4, duration: 0.2, type: "square" }, // E4
      { freq: 293.66, start: 0.6, duration: 0.4, type: "square" }, // D4
      { freq: 261.63, start: 1.0, duration: 0.6, type: "square" }, // C4
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileErrorSound()
    }
  }

  // Генерация звука появления босса (тревожный звук)
  private playBossSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем 8-битную тревожную последовательность нот
    this.playNoteSequence([
      { freq: 196, start: 0, duration: 0.1, type: "square" }, // G3
      { freq: 196, start: 0.1, duration: 0.1, type: "square" }, // G3 повтор
      { freq: 196, start: 0.2, duration: 0.1, type: "square" }, // G3 повтор
      { freq: 156, start: 0.3, duration: 0.3, type: "square" }, // Eb3 понижение
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileHeavySound()
    }
  }

  // Генерация звука старта игры (бодрая мелодия)
  private playStartSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем 8-битную бодрую последовательность нот
    this.playNoteSequence([
      { freq: 523.25, start: 0, duration: 0.1, type: "square" }, // C5
      { freq: 659.25, start: 0.1, duration: 0.1, type: "square" }, // E5
      { freq: 783.99, start: 0.2, duration: 0.1, type: "square" }, // G5
      { freq: 1046.5, start: 0.3, duration: 0.2, type: "square" }, // C6
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileSuccessSound()
    }
  }

  // Генерация звука получения очков
  private playScoreSound() {
    if (!this.audioContext || !this.effectsGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "square" // 8-битный звук
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime)
    oscillator.frequency.setValueAtTime(1320, this.audioContext.currentTime + 0.05)

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain) // Подключаем к регулятору эффектов

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.1)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileLightSound()
    }
  }

  // НОВЫЕ ЗВУКИ

  // Звук потери жизни с эффектом смеха
  private playLoseLifeSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Основной звук потери жизни
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.3)

    // Добавляем звук смеха в 16-битном стиле
    setTimeout(() => {
      // Создаем "смеющийся" звук
      const laughOsc1 = this.audioContext!.createOscillator()
      const laughOsc2 = this.audioContext!.createOscillator()
      const laughGain = this.audioContext!.createGain()

      // Настраиваем осцилляторы для звука смеха
      laughOsc1.type = "sawtooth"
      laughOsc1.frequency.setValueAtTime(440, this.audioContext!.currentTime)
      laughOsc1.frequency.setValueAtTime(550, this.audioContext!.currentTime + 0.1)
      laughOsc1.frequency.setValueAtTime(440, this.audioContext!.currentTime + 0.2)
      laughOsc1.frequency.setValueAtTime(550, this.audioContext!.currentTime + 0.3)

      laughOsc2.type = "square"
      laughOsc2.frequency.setValueAtTime(220, this.audioContext!.currentTime)
      laughOsc2.frequency.setValueAtTime(275, this.audioContext!.currentTime + 0.1)
      laughOsc2.frequency.setValueAtTime(220, this.audioContext!.currentTime + 0.2)
      laughOsc2.frequency.setValueAtTime(275, this.audioContext!.currentTime + 0.3)

      // Настраиваем огибающую громкости для эффекта "ха-ха-ха"
      laughGain.gain.setValueAtTime(0.01, this.audioContext!.currentTime)
      laughGain.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + 0.05)
      laughGain.gain.linearRampToValueAtTime(0.1, this.audioContext!.currentTime + 0.1)
      laughGain.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + 0.15)
      laughGain.gain.linearRampToValueAtTime(0.1, this.audioContext!.currentTime + 0.2)
      laughGain.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + 0.25)
      laughGain.gain.linearRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.4)

      // Соединяем компоненты
      laughOsc1.connect(laughGain)
      laughOsc2.connect(laughGain)
      laughGain.connect(this.effectsGain!)

      // Запускаем и останавливаем звук
      laughOsc1.start()
      laughOsc2.start()
      laughOsc1.stop(this.audioContext!.currentTime + 0.4)
      laughOsc2.stop(this.audioContext!.currentTime + 0.4)
    }, 300)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileErrorSound()
    }
  }

  // Звук получения жизни
  private playGainLifeSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем восходящую последовательность нот
    this.playNoteSequence([
      { freq: 523.25, start: 0, duration: 0.1, type: "sine" }, // C5
      { freq: 659.25, start: 0.1, duration: 0.1, type: "sine" }, // E5
      { freq: 783.99, start: 0.2, duration: 0.2, type: "sine" }, // G5
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileSuccessSound()
    }
  }

  // Звук комбо
  private playComboSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем быструю восходящую последовательность нот
    this.playNoteSequence([
      { freq: 440, start: 0, duration: 0.05 }, // A4
      { freq: 554.37, start: 0.05, duration: 0.05 }, // C#5
      { freq: 659.25, start: 0.1, duration: 0.05 }, // E5
      { freq: 880, start: 0.15, duration: 0.1 }, // A5
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileSuccessSound()
    }
  }

  // Звук достижения высокого счета
  private playHighScoreSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем фанфары
    this.playNoteSequence([
      { freq: 440, start: 0, duration: 0.1 }, // A4
      { freq: 440, start: 0.1, duration: 0.1 }, // A4
      { freq: 659.25, start: 0.2, duration: 0.2 }, // E5
      { freq: 880, start: 0.4, duration: 0.4 }, // A5
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileSuccessSound()
    }
  }

  // Звук нажатия кнопки
  private playButtonSound() {
    if (!this.audioContext || !this.effectsGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain) // Подключаем к регулятору эффектов

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.1)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileLightSound()
    }
  }

  // Звук победы над боссом
  private playBossDefeatSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем победную мелодию
    this.playNoteSequence([
      { freq: 523.25, start: 0, duration: 0.2 }, // C5
      { freq: 659.25, start: 0.2, duration: 0.2 }, // E5
      { freq: 783.99, start: 0.4, duration: 0.2 }, // G5
      { freq: 1046.5, start: 0.6, duration: 0.4 }, // C6
    ])

    // Добавляем шум взрыва
    setTimeout(() => this.playExplosionSound(), 200)
    setTimeout(() => this.playExplosionSound(), 400)
    setTimeout(() => this.playExplosionSound(), 600)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileHeavySound()
      setTimeout(() => this.playTactileSuccessSound(), 300)
    }
  }

  // Звук повышения уровня
  private playLevelUpSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем восходящую последовательность нот
    this.playNoteSequence([
      { freq: 523.25, start: 0, duration: 0.15 }, // C5
      { freq: 587.33, start: 0.15, duration: 0.15 }, // D5
      { freq: 659.25, start: 0.3, duration: 0.15 }, // E5
      { freq: 698.46, start: 0.45, duration: 0.15 }, // F5
      { freq: 783.99, start: 0.6, duration: 0.3 }, // G5
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileSuccessSound()
    }
  }

  // Звук атаки Chomper
  private playChomperAttackSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем звук "чавканья"
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    // Добавляем модуляцию для эффекта "чавканья"
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()

    lfo.type = "square"
    lfo.frequency.value = 15
    lfoGain.gain.value = 50

    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain)

    lfo.start()
    oscillator.start()

    oscillator.stop(this.audioContext.currentTime + 0.3)
    lfo.stop(this.audioContext.currentTime + 0.3)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileMediumSound()
    }
  }

  // Звук атаки Spiky
  private playSpikyAttackSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем звук "шипов"
    const bufferSize = 4096
    const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
    const gainNode = this.audioContext.createGain()

    // Создаем фильтр для "шипящего" звука
    const filter = this.audioContext.createBiquadFilter()
    filter.type = "highpass"
    filter.frequency.value = 2000
    filter.Q.value = 10

    noiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
    }

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    noiseNode.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.effectsGain)

    // Автоматическое отключение через 0.2 секунды
    setTimeout(() => {
      noiseNode.disconnect()
      filter.disconnect()
      gainNode.disconnect()
    }, 200)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileMediumSound()
    }
  }

  // Звук атаки Demon
  private playDemonAttackSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем "демонический" звук
    const oscillator1 = this.audioContext.createOscillator()
    const oscillator2 = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator1.type = "sawtooth"
    oscillator1.frequency.setValueAtTime(150, this.audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.4)

    oscillator2.type = "square"
    oscillator2.frequency.setValueAtTime(153, this.audioContext.currentTime) // Небольшой диссонанс
    oscillator2.frequency.exponentialRampToValueAtTime(53, this.audioContext.currentTime + 0.4)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4)

    // Добавляем дисторшн
    const distortion = this.audioContext.createWaveShaper()
    distortion.curve = this.makeDistortionCurve(100)

    oscillator1.connect(distortion)
    oscillator2.connect(distortion)
    distortion.connect(gainNode)
    gainNode.connect(this.effectsGain)

    oscillator1.start()
    oscillator2.start()

    oscillator1.stop(this.audioContext.currentTime + 0.4)
    oscillator2.stop(this.audioContext.currentTime + 0.4)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileHeavySound()
    }
  }

  // Функция для создания кривой дисторшна
  private makeDistortionCurve(amount: number) {
    const k = amount
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    const deg = Math.PI / 180

    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }

    return curve
  }

  // Звук специальной атаки
  private playSpecialAttackSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем звук специальной атаки - комбинация нескольких звуков

    // 1. Предупреждающий сигнал
    const warning = this.audioContext.createOscillator()
    const warningGain = this.audioContext.createGain()

    warning.type = "square"
    warning.frequency.value = 440

    warningGain.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    warningGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    warning.connect(warningGain)
    warningGain.connect(this.effectsGain)

    warning.start()
    warning.stop(this.audioContext.currentTime + 0.3)

    // 2. Через небольшую паузу - основной звук атаки
    setTimeout(() => {
      const attack = this.audioContext!.createOscillator()
      const attackGain = this.audioContext!.createGain()

      attack.type = "sawtooth"
      attack.frequency.setValueAtTime(200, this.audioContext!.currentTime)
      attack.frequency.exponentialRampToValueAtTime(400, this.audioContext!.currentTime + 0.5)

      attackGain.gain.setValueAtTime(0.4, this.audioContext!.currentTime)
      attackGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.5)

      // Добавляем тремоло
      const lfo = this.audioContext!.createOscillator()
      const lfoGain = this.audioContext!.createGain()

      lfo.type = "sine"
      lfo.frequency.value = 10
      lfoGain.gain.value = 0.2

      lfo.connect(lfoGain)
      lfoGain.connect(attackGain.gain)

      attack.connect(attackGain)
      attackGain.connect(this.effectsGain!)

      lfo.start()
      attack.start()

      attack.stop(this.audioContext!.currentTime + 0.5)
      lfo.stop(this.audioContext!.currentTime + 0.5)
    }, 350)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileHeavySound()
      setTimeout(() => this.playTactileMediumSound(), 350)
    }
  }

  // ТАКТИЛЬНЫЕ ЗВУКИ

  // Легкая тактильная обратная связь
  private playTactileLightSound() {
    if (!this.audioContext || !this.tactileGain || this.muted) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Короткий высокочастотный звук для имитации легкой вибрации
      oscillator.type = "sine"
      oscillator.frequency.value = 1800

      // Очень короткий звук с быстрым затуханием
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)

      oscillator.connect(gainNode)
      gainNode.connect(this.tactileGain)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + 0.05)
    } catch (error) {
      console.error("Ошибка воспроизведения тактильного звука:", error)
    }
  }

  // Средняя тактильная обратная связь
  private playTactileMediumSound() {
    if (!this.audioContext || !this.tactileGain || this.muted) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Средний звук для имитации средней вибрации
      oscillator.type = "triangle"
      oscillator.frequency.value = 120

      // Короткий звук с умеренным затуханием
      gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(this.tactileGain)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + 0.1)
    } catch (error) {
      console.error("Ошибка воспроизведения тактильного звука:", error)
    }
  }

  // Сильная тактильная обратная связь
  private playTactileHeavySound() {
    if (!this.audioContext || !this.tactileGain || this.muted) return

    try {
      // Используем два осциллятора для создания более насыщенного звука
      const oscillator1 = this.audioContext.createOscillator()
      const oscillator2 = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Низкочастотные звуки для имитации сильной вибрации
      oscillator1.type = "sine"
      oscillator1.frequency.value = 60

      oscillator2.type = "square"
      oscillator2.frequency.value = 30

      // Короткий звук с медленным затуханием
      gainNode.gain.setValueAtTime(0.35, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15)

      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(this.tactileGain)

      oscillator1.start()
      oscillator2.start()
      oscillator1.stop(this.audioContext.currentTime + 0.15)
      oscillator2.stop(this.audioContext.currentTime + 0.15)
    } catch (error) {
      console.error("Ошибка воспроизведения тактильного звука:", error)
    }
  }

  // Тактильный звук успеха
  private playTactileSuccessSound() {
    if (!this.audioContext || !this.tactileGain || this.muted) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Восходящий тон для имитации успеха
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.1)

      // Короткий звук с быстрым затуханием
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(this.tactileGain)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + 0.1)
    } catch (error) {
      console.error("Ошибка воспроизведения тактильного звука:", error)
    }
  }

  // Тактильный звук ошибки
  private playTactileErrorSound() {
    if (!this.audioContext || !this.tactileGain || this.muted) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      // Нисходящий тон для имитации ошибки
      oscillator.type = "square"
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(440, this.audioContext.currentTime + 0.1)

      // Короткий звук с быстрым затуханием
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(this.tactileGain)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + 0.1)
    } catch (error) {
      console.error("Ошибка воспроизведения тактильного звука:", error)
    }
  }

  // Новые звуки для специальных способностей и бонусов

  // Звук заморозки времени
  private playTimeFreezeSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем "ледяной" звук
    const bufferSize = 4096
    const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
    const gainNode = this.audioContext.createGain()

    // Создаем фильтр для "шипящего" звука
    const filter = this.audioContext.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = 4000
    filter.Q.value = 20

    noiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
    }

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    noiseNode.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.effectsGain)

    // Автоматическое отключение через 0.3 секунды
    setTimeout(() => {
      noiseNode.disconnect()
      filter.disconnect()
      gainNode.disconnect()
    }, 300)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileLightSound()
    }
  }

  // Звук взрывной волны
  private playExplosiveWaveSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем звук взрывной волны - более мощный и впечатляющий
    const oscillator1 = this.audioContext.createOscillator()
    const oscillator2 = this.audioContext.createOscillator()
    const oscillator3 = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    // Первый осциллятор - низкочастотный бас
    oscillator1.type = "sawtooth"
    oscillator1.frequency.setValueAtTime(60, this.audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.8)

    // Второй осциллятор - средние частоты
    oscillator2.type = "square"
    oscillator2.frequency.setValueAtTime(120, this.audioContext.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.8)

    // Третий осциллятор - высокие частоты для "шипения"
    oscillator3.type = "triangle"
    oscillator3.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    oscillator3.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.8)

    // Настраиваем огибающую громкости для эффекта взрыва
    gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.1) // Быстрый подъем
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8) // Медленное затухание

    // Добавляем фильтр для более реалистичного звука взрыва
    const filter = this.audioContext.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.8)
    filter.Q.value = 5

    // Соединяем компоненты
    oscillator1.connect(filter)
    oscillator2.connect(filter)
    oscillator3.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.effectsGain)

    // Запускаем звуки
    oscillator1.start()
    oscillator2.start()
    oscillator3.start()

    // Останавливаем звуки
    oscillator1.stop(this.audioContext.currentTime + 0.8)
    oscillator2.stop(this.audioContext.currentTime + 0.8)
    oscillator3.stop(this.audioContext.currentTime + 0.8)

    // Добавляем шумовой компонент для взрыва
    setTimeout(() => {
      const bufferSize = 4096
      const noiseNode = this.audioContext!.createScriptProcessor(bufferSize, 1, 1)
      const noiseGain = this.audioContext!.createGain()

      noiseNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }
      }

      noiseGain.gain.setValueAtTime(0.5, this.audioContext!.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.5)

      noiseNode.connect(noiseGain)
      noiseGain.connect(this.effectsGain!)

      // Автоматически отключаем через 0.5 секунды
      setTimeout(() => {
        try {
          noiseNode.disconnect()
          noiseGain.disconnect()
        } catch (e) {
          // Игнорируем ошибки при отключении
        }
      }, 500)
    }, 100)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileHeavySound()
      // Добавляем вторую вибрацию для усиления эффекта
      setTimeout(() => {
        if (this.tactileFeedbackEnabled) {
          this.playTactileMediumSound()
        }
      }, 200)
    }
  }

  // Звук щита
  private playShieldSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Создаем звук щита
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    // Добавляем эффект вибрации
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()

    lfo.type = "sine"
    lfo.frequency.value = 5
    lfoGain.gain.value = 20

    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain)

    lfo.start()
    oscillator.start()

    oscillator.stop(this.audioContext.currentTime + 0.3)
    lfo.stop(this.audioContext.currentTime + 0.3)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileMediumSound()
    }
  }

  // Звук специальной способности
  private playSpecialAbilitySound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем восходящую последовательность нот
    this.playNoteSequence([
      { freq: 392, start: 0, duration: 0.1, type: "sine" }, // G4
      { freq: 440, start: 0.1, duration: 0.1, type: "sine" }, // A4
      { freq: 493.88, start: 0.2, duration: 0.1, type: "sine" }, // B4
      { freq: 523.25, start: 0.3, duration: 0.2, type: "sine" }, // C5
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileSuccessSound()
    }
  }

  // Звук сбора бонуса
  private playBonusCollectedSound() {
    if (!this.audioContext || !this.effectsGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(this.effectsGain)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.2)

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileLightSound()
    }
  }

  // Звук прерывания комбо
  private playComboBreakSound() {
    if (!this.audioContext || !this.effectsGain) return

    // Играем нисходящую последовательность нот
    this.playNoteSequence([
      { freq: 523.25, start: 0, duration: 0.1, type: "square" }, // C5
      { freq: 493.88, start: 0.1, duration: 0.1, type: "square" }, // B4
      { freq: 440, start: 0.2, duration: 0.1, type: "square" }, // A4
      { freq: 392, start: 0.3, duration: 0.2, type: "square" }, // G4
    ])

    // Добавляем тактильную обратную связь, если она включена
    if (this.tactileFeedbackEnabled) {
      this.playTactileErrorSound()
    }
  }

  // Освобождение ресурсов аудиосистемы
  public dispose() {
    // Останавливаем фоновую музыку
    this.stopBackgroundMusic()

    // Отключаем все узлы аудио, если они существуют
    if (this.masterGain) {
      try {
        this.masterGain.disconnect()
      } catch (e) {
        // Игнорируем ошибки при отключении
      }
    }

    if (this.effectsGain) {
      try {
        this.effectsGain.disconnect()
      } catch (e) {
        // Игнорируем ошибки при отключении
      }
    }

    if (this.musicGain) {
      try {
        this.musicGain.disconnect()
      } catch (e) {
        // Игнорируем ошибки при отключении
      }
    }

    if (this.tactileGain) {
      try {
        this.tactileGain.disconnect()
      } catch (e) {
        // Игнорируем ошибки при отключении
      }
    }

    // Закрываем аудиоконтекст, если он существует
    if (this.audioContext && this.audioContext.state !== "closed") {
      try {
        this.audioContext.close()
      } catch (e) {
        console.error("Ошибка при закрытии аудиоконтекста:", e)
      }
    }
  }
}

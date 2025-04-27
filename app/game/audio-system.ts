// Аудио система для игры с ретро-звуками
export class RetroAudioSystem {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private musicVolume = 0.3
  private soundVolume = 0.5
  private muted = false
  private backgroundMusic: HTMLAudioElement | null = null
  public isIOSDevice = false

  constructor() {
    // Проверяем, является ли устройство iOS
    this.isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    // Предзагружаем звуки
    this.preloadSounds()
  }

  private preloadSounds() {
    // Основные звуки игры
    this.loadSound("hit", "/sounds/16bit-hit.mp3")
    this.loadSound("explosion", "/sounds/16bit-explosion.mp3")
    this.loadSound("gameOver", "/sounds/16bit-gameover.mp3")
    this.loadSound("levelUp", "/sounds/16bit-levelup.mp3")
    this.loadSound("start", "/sounds/16bit-start.mp3")
    this.loadSound("button", "/sounds/16bit-button.mp3")
    this.loadSound("fart", "/sounds/16bit-fart.mp3")
    this.loadSound("monster", "/sounds/16bit-monster.mp3")
    this.loadSound("score", "/sounds/16bit-score.mp3")
    this.loadSound("bossAppear", "/sounds/16bit-boss.mp3")
    this.loadSound("bossDefeat", "/sounds/16bit-boss-defeat.mp3")
    this.loadSound("loseLife", "/sounds/16bit-lose-life.mp3")
    this.loadSound("gainLife", "/sounds/16bit-gain-life.mp3")
    this.loadSound("highScore", "/sounds/16bit-highscore.mp3")
    this.loadSound("specialAbility", "/sounds/16bit-special.mp3")
    this.loadSound("explosiveWave", "/sounds/16bit-wave.mp3")
    this.loadSound("shield", "/sounds/16bit-shield.mp3")

    // Фоновая музыка
    this.backgroundMusic = new Audio("/sounds/16bit-background.mp3")
    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = this.musicVolume
  }

  private loadSound(name: string, url: string) {
    try {
      const audio = new Audio(url)
      audio.volume = this.soundVolume
      this.sounds.set(name, audio)
    } catch (error) {
      console.error(`Ошибка загрузки звука ${name}:`, error)
    }
  }

  public play(name: string) {
    if (this.muted) return

    try {
      const sound = this.sounds.get(name)
      if (sound) {
        // Клонируем звук для возможности одновременного воспроизведения
        const soundClone = sound.cloneNode(true) as HTMLAudioElement
        soundClone.volume = this.soundVolume
        soundClone.play().catch((err) => {
          console.warn(`Не удалось воспроизвести звук ${name}:`, err)
        })
      }
    } catch (error) {
      console.error(`Ошибка воспроизведения звука ${name}:`, error)
    }
  }

  public startBackgroundMusic() {
    if (this.muted || !this.backgroundMusic) return

    try {
      this.backgroundMusic.play().catch((err) => {
        console.warn("Не удалось воспроизвести фоновую музыку:", err)
      })
    } catch (error) {
      console.error("Ошибка воспроизведения фоновой музыки:", error)
    }
  }

  public stopBackgroundMusic() {
    if (!this.backgroundMusic) return

    try {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
    } catch (error) {
      console.error("Ошибка остановки фоновой музыки:", error)
    }
  }

  public setMute(muted: boolean) {
    this.muted = muted

    if (this.backgroundMusic) {
      if (muted) {
        this.backgroundMusic.pause()
      } else {
        this.backgroundMusic.play().catch((err) => {
          console.warn("Не удалось возобновить фоновую музыку:", err)
        })
      }
    }
  }

  public setVolume(volume: number) {
    this.soundVolume = Math.max(0, Math.min(1, volume))

    // Обновляем громкость всех звуков
    this.sounds.forEach((sound) => {
      sound.volume = this.soundVolume
    })
  }

  public getVolume(): number {
    return this.soundVolume
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume
  }

  // Метод для воспроизведения тактильной обратной связи на iOS устройствах
  public playTactileFeedback(type: "light" | "medium" | "heavy" | "success" | "error") {
    if (!this.isIOSDevice) return

    try {
      // Используем аудио для создания тактильной обратной связи на iOS
      const frequency =
        type === "light"
          ? 1519
          : type === "medium"
            ? 1000
            : type === "heavy"
              ? 500
              : type === "success"
                ? 2000
                : type === "error"
                  ? 300
                  : 1000

      const duration =
        type === "light"
          ? 20
          : type === "medium"
            ? 40
            : type === "heavy"
              ? 60
              : type === "success"
                ? 50
                : type === "error"
                  ? 100
                  : 40

      // Создаем аудио контекст
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = frequency
      gainNode.gain.value = 0.1

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => {
        oscillator.stop()
      }, duration)
    } catch (error) {
      console.error("Ошибка воспроизведения тактильной обратной связи:", error)
    }
  }

  // Освобождаем ресурсы
  public dispose() {
    this.stopBackgroundMusic()
    this.sounds.clear()
    this.backgroundMusic = null
  }
}

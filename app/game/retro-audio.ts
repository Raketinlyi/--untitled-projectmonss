// Класс для генерации ретро-звуков в стиле 8-бит и 16-бит
export class RetroAudio {
  private audioContext: AudioContext | null = null
  private masterGainNode: GainNode | null = null
  private muted = false
  private volume = 0.5
  private musicVolume = 0.3
  private backgroundMusic: OscillatorNode | null = null
  private backgroundMusicGain: GainNode | null = null
  private musicPlaying = false
  private musicNotes: number[] = []
  private currentNoteIndex = 0
  private noteInterval = 200
  private noteIntervalId: number | null = null
  private vibrationEnabled = true
  private tactileFeedbackEnabled = true

  constructor() {
    this.initAudioContext()
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGainNode = this.audioContext.createGain()
      this.masterGainNode.gain.value = this.volume
      this.masterGainNode.connect(this.audioContext.destination)
    } catch (e) {
      console.error("Web Audio API не поддерживается в этом браузере.", e)
    }
  }

  // Установка громкости
  setVolume(volume: number) {
    this.volume = volume
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.muted ? 0 : volume
    }
  }

  // Установка громкости музыки
  setMusicVolume(volume: number) {
    this.musicVolume = volume
    if (this.backgroundMusicGain) {
      this.backgroundMusicGain.gain.value = this.muted ? 0 : volume * 0.3 // Музыка тише звуков
    }
  }

  // Включение/выключение звука
  toggleMute() {
    this.muted = !this.muted
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.muted ? 0 : this.volume
    }
    if (this.backgroundMusicGain) {
      this.backgroundMusicGain.gain.value = this.muted ? 0 : this.musicVolume * 0.3
    }
    return this.muted
  }

  // Включение/выключение вибрации
  setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled
  }

  // Включение/выключение тактильной обратной связи
  setTactileFeedbackEnabled(enabled: boolean) {
    this.tactileFeedbackEnabled = enabled
  }

  // Метод для создания простого звука
  private createSimpleSound(
    frequency: number,
    duration: number,
    type: OscillatorType = "square",
    volumeMultiplier = 1,
    attackTime = 0.01,
    decayTime = 0.1,
    sustainLevel = 0.5,
    releaseTime = 0.1,
  ) {
    if (!this.audioContext || !this.masterGainNode || this.muted) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGainNode)

    // ADSR огибающая для более реалистичного звука
    const now = this.audioContext.currentTime
    gainNode.gain.value = 0
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(volumeMultiplier, now + attackTime)
    gainNode.gain.linearRampToValueAtTime(volumeMultiplier * sustainLevel, now + attackTime + decayTime)
    gainNode.gain.setValueAtTime(volumeMultiplier * sustainLevel, now + duration - releaseTime)
    gainNode.gain.linearRampToValueAtTime(0, now + duration)

    oscillator.start()
    oscillator.stop(now + duration)
  }

  // Метод для создания более сложного звука с несколькими осцилляторами (16-бит)
  private create16BitSound(
    baseFrequency: number,
    duration: number,
    harmonics: { frequency: number; type: OscillatorType; volume: number }[],
    attackTime = 0.01,
    decayTime = 0.1,
    sustainLevel = 0.5,
    releaseTime = 0.1,
  ) {
    if (!this.audioContext || !this.masterGainNode || this.muted) return

    const now = this.audioContext.currentTime

    // Создаем несколько осцилляторов для более богатого звука
    harmonics.forEach((harmonic) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = harmonic.type
      oscillator.frequency.value = baseFrequency * harmonic.frequency
      oscillator.connect(gainNode)
      gainNode.connect(this.masterGainNode!)

      // ADSR огибающая
      gainNode.gain.value = 0
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(harmonic.volume, now + attackTime)
      gainNode.gain.linearRampToValueAtTime(harmonic.volume * sustainLevel, now + attackTime + decayTime)
      gainNode.gain.setValueAtTime(harmonic.volume * sustainLevel, now + duration - releaseTime)
      gainNode.gain.linearRampToValueAtTime(0, now + duration)

      oscillator.start(now)
      oscillator.stop(now + duration)
    })
  }

  // Звук попадания по монстру (16-бит версия)
  playMonsterHit16Bit() {
    if (!this.audioContext || this.muted) return

    // Создаем более богатый 16-битный звук попадания
    this.create16BitSound(
      220, // Базовая частота
      0.15, // Длительность
      [
        { frequency: 1, type: "square", volume: 0.5 }, // Основной тон
        { frequency: 2, type: "sawtooth", volume: 0.3 }, // Октава выше
        { frequency: 3, type: "triangle", volume: 0.2 }, // Квинта
        { frequency: 0.5, type: "sine", volume: 0.15 }, // Октава ниже
        { frequency: 1.5, type: "square", volume: 0.1 }, // Добавляем еще один тон для более насыщенного звука
      ],
      0.01, // Атака
      0.05, // Спад
      0.7, // Уровень поддержки
      0.08, // Затухание
    )

    // Добавляем тактильную обратную связь
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(20)
    }
  }

  // Звук попадания по монстру (старая 8-бит версия)
  playMonsterHit() {
    // Now call the 16-bit version by default for better sound
    this.playMonsterHit16Bit()
  }

  // Звук запуска снаряда
  playProjectileLaunch() {
    this.createSimpleSound(150, 0.2, "sawtooth", 0.3, 0.01, 0.05, 0.5, 0.1)
  }

  // Звук уничтожения снаряда
  playProjectileDestroy() {
    this.createSimpleSound(330, 0.15, "square", 0.4, 0.01, 0.05, 0.6, 0.08)

    // Более короткая вибрация для уничтожения снаряда
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  // Звук потери жизни
  playLifeLost() {
    // Последовательность нисходящих нот
    this.createSimpleSound(440, 0.1, "sawtooth", 0.6, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(330, 0.1, "sawtooth", 0.6, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(220, 0.2, "sawtooth", 0.6, 0.01, 0.02, 0.8, 0.1)
    }, 200)

    // Более длительная вибрация для потери жизни
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([30, 20, 50])
    }
  }

  // Звук окончания игры
  playGameOver() {
    // Последовательность нисходящих нот для окончания игры
    this.createSimpleSound(440, 0.2, "sawtooth", 0.7, 0.01, 0.05, 0.8, 0.1)
    setTimeout(() => {
      this.createSimpleSound(330, 0.2, "sawtooth", 0.7, 0.01, 0.05, 0.8, 0.1)
    }, 200)
    setTimeout(() => {
      this.createSimpleSound(220, 0.2, "sawtooth", 0.7, 0.01, 0.05, 0.8, 0.1)
    }, 400)
    setTimeout(() => {
      this.createSimpleSound(110, 0.4, "sawtooth", 0.7, 0.01, 0.05, 0.8, 0.2)
    }, 600)

    // Паттерн вибрации для окончания игры
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([50, 30, 50, 30, 100])
    }
  }

  // Звук достижения нового рекорда
  playHighScore() {
    // Восходящая последовательность нот для нового рекорда
    this.createSimpleSound(440, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(554, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(659, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 200)
    setTimeout(() => {
      this.createSimpleSound(880, 0.2, "square", 0.5, 0.01, 0.02, 0.8, 0.1)
    }, 300)

    // Паттерн вибрации для нового рекорда
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([20, 10, 20, 10, 40])
    }
  }

  // Звук повышения уровня
  playLevelUp() {
    // Восходящая последовательность нот для повышения уровня
    this.createSimpleSound(330, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(440, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(550, 0.2, "square", 0.5, 0.01, 0.02, 0.8, 0.1)
    }, 200)

    // Паттерн вибрации для повышения уровня
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([15, 10, 30])
    }
  }

  // Звук появления босса
  playBossAppear() {
    // Зловещая последовательность нот для появления босса
    this.createSimpleSound(220, 0.2, "sawtooth", 0.6, 0.01, 0.05, 0.8, 0.1)
    setTimeout(() => {
      this.createSimpleSound(165, 0.2, "sawtooth", 0.6, 0.01, 0.05, 0.8, 0.1)
    }, 200)
    setTimeout(() => {
      this.createSimpleSound(220, 0.3, "sawtooth", 0.6, 0.01, 0.05, 0.8, 0.15)
    }, 400)

    // Паттерн вибрации для появления босса
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([30, 20, 60])
    }
  }

  // Звук специальной атаки босса
  playBossSpecialAttack() {
    // Зловещая последовательность нот для специальной атаки босса
    this.createSimpleSound(110, 0.1, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(165, 0.1, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(220, 0.1, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.05)
    }, 200)
    setTimeout(() => {
      this.createSimpleSound(110, 0.3, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.15)
    }, 300)

    // Паттерн вибрации для специальной атаки босса
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([20, 10, 20, 10, 50])
    }
  }

  // Звук победы над боссом
  playBossDefeated() {
    // Триумфальная последовательность нот для победы над боссом
    this.createSimpleSound(440, 0.1, "square", 0.6, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(554, 0.1, "square", 0.6, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(659, 0.1, "square", 0.6, 0.01, 0.02, 0.8, 0.05)
    }, 200)
    setTimeout(() => {
      this.createSimpleSound(880, 0.1, "square", 0.6, 0.01, 0.02, 0.8, 0.05)
    }, 300)
    setTimeout(() => {
      this.createSimpleSound(659, 0.1, "square", 0.6, 0.01, 0.02, 0.8, 0.05)
    }, 400)
    setTimeout(() => {
      this.createSimpleSound(880, 0.2, "square", 0.6, 0.01, 0.02, 0.8, 0.1)
    }, 500)

    // Паттерн вибрации для победы над боссом
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([20, 10, 20, 10, 20, 10, 40])
    }
  }

  // Звук активации способности заморозки времени
  playTimeFreeze() {
    // Последовательность нот для заморозки времени
    this.createSimpleSound(880, 0.1, "sine", 0.5, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(784, 0.1, "sine", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(659, 0.1, "sine", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 200)
    setTimeout(() => {
      this.createSimpleSound(554, 0.2, "sine", 0.5, 0.01, 0.02, 0.8, 0.1)
    }, 300)

    // Паттерн вибрации для заморозки времени
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([15, 10, 15, 10, 30])
    }
  }

  // Звук активации взрывной волны
  playExplosiveWave() {
    // Последовательность нот для взрывной волны
    this.createSimpleSound(110, 0.1, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(220, 0.1, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.05)
    }, 50)
    setTimeout(() => {
      this.createSimpleSound(330, 0.1, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(440, 0.2, "sawtooth", 0.7, 0.01, 0.02, 0.8, 0.1)
    }, 150)

    // Паттерн вибрации для взрывной волны
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([10, 5, 10, 5, 40])
    }
  }

  // Звук активации щита
  playShield() {
    // Последовательность нот для щита
    this.createSimpleSound(440, 0.1, "sine", 0.5, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(554, 0.1, "sine", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 100)
    setTimeout(() => {
      this.createSimpleSound(659, 0.2, "sine", 0.5, 0.01, 0.02, 0.8, 0.1)
    }, 200)

    // Паттерн вибрации для щита
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([15, 10, 30])
    }
  }

  // Звук сбора бонуса
  playBonusCollected() {
    // Последовательность нот для сбора бонуса
    this.createSimpleSound(659, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    setTimeout(() => {
      this.createSimpleSound(880, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)
    }, 100)

    // Паттерн вибрации для сбора бонуса
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(15)
    }
  }

  // Звук комбо
  playCombo(comboCount: number) {
    // Частота увеличивается с увеличением комбо
    const frequency = 440 + comboCount * 20
    this.createSimpleSound(frequency, 0.1, "square", 0.5, 0.01, 0.02, 0.8, 0.05)

    // Вибрация увеличивается с увеличением комбо
    if (this.tactileFeedbackEnabled && this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(Math.min(5 + comboCount * 2, 30))
    }
  }

  // Запуск фоновой музыки
  startBackgroundMusic() {
    if (!this.audioContext || !this.masterGainNode || this.musicPlaying) return

    // Простая мелодия для фона
    this.musicNotes = [
      262, // C4
      294, // D4
      330, // E4
      349, // F4
      392, // G4
      440, // A4
      494, // B4
      523, // C5
    ]

    this.backgroundMusicGain = this.audioContext.createGain()
    this.backgroundMusicGain.gain.value = this.muted ? 0 : this.musicVolume * 0.3
    this.backgroundMusicGain.connect(this.masterGainNode)

    this.musicPlaying = true
    this.playNextNote()
  }

  // Воспроизведение следующей ноты в фоновой музыке
  private playNextNote() {
    if (!this.audioContext || !this.backgroundMusicGain || !this.musicPlaying) return

    const note = this.musicNotes[this.currentNoteIndex]

    this.backgroundMusic = this.audioContext.createOscillator()
    this.backgroundMusic.type = "sine"
    this.backgroundMusic.frequency.value = note
    this.backgroundMusic.connect(this.backgroundMusicGain)

    this.backgroundMusic.start()

    this.noteIntervalId = window.setTimeout(() => {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop()
        this.backgroundMusic = null
      }

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.musicNotes.length
      this.playNextNote()
    }, this.noteInterval)
  }

  // Остановка фоновой музыки
  stopBackgroundMusic() {
    this.musicPlaying = false

    if (this.noteIntervalId !== null) {
      clearTimeout(this.noteIntervalId)
      this.noteIntervalId = null
    }

    if (this.backgroundMusic) {
      this.backgroundMusic.stop()
      this.backgroundMusic = null
    }

    this.currentNoteIndex = 0
  }

  // Очистка ресурсов
  destroy() {
    this.stopBackgroundMusic()

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close()
    }

    this.audioContext = null
    this.masterGainNode = null
    this.backgroundMusicGain = null
  }
}

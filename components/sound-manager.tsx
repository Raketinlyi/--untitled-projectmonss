"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Расширенный список типов звуков
type SoundType =
  | "gameTheme"
  | "battleTheme"
  | "victoryTheme"
  | "menuTheme"
  | "monsterClick"
  | "gameStart"
  | "monsterDefeat"
  | "levelUp"
  | "missClick"
  | "pointsEarned"

interface SoundContextType {
  playSound: (sound: SoundType) => void
  stopSound: (sound: SoundType) => void
  toggleMute: () => void
  isMuted: boolean
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Обновленные пути к звукам, включая новые
const sounds = {
  // Основные звуки
  gameTheme: "/sounds/game-theme-16bit.mp3",
  battleTheme: "/sounds/battle-theme-16bit.mp3",
  victoryTheme: "/sounds/victory-theme-16bit.mp3",
  menuTheme: "/sounds/menu-theme-16bit.mp3",
  monsterClick: "/sounds/monster-click-16bit.mp3",

  // Новые звуки
  gameStart: "/sounds/game-start-16bit.mp3",
  monsterDefeat: "/sounds/monster-defeat-16bit.mp3",
  levelUp: "/sounds/level-up-16bit.mp3",
  missClick: "/sounds/miss-click-16bit.mp3",
  pointsEarned: "/sounds/points-earned-16bit.mp3",
}

// Инициализация аудио элементов для всех звуков
const audioElements: Record<SoundType, HTMLAudioElement | null> = {
  gameTheme: null,
  battleTheme: null,
  victoryTheme: null,
  menuTheme: null,
  monsterClick: null,
  gameStart: null,
  monsterDefeat: null,
  levelUp: null,
  missClick: null,
  pointsEarned: null,
}

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window !== "undefined") {
      // Загружаем сохраненное состояние звука
      const savedMuteState = localStorage.getItem("isMuted")
      if (savedMuteState) {
        setIsMuted(savedMuteState === "true")
      }

      // Инициализируем аудио элементы
      Object.keys(sounds).forEach((key) => {
        const soundKey = key as SoundType
        const audio = new Audio(sounds[soundKey])

        // Настраиваем параметры для разных типов звуков
        if (soundKey.includes("Theme")) {
          audio.loop = true
          audio.volume = 0.4
        } else {
          // Настройка громкости для разных типов эффектов
          switch (soundKey) {
            case "monsterClick":
              audio.volume = 0.5
              break
            case "monsterDefeat":
              audio.volume = 0.6
              break
            case "levelUp":
              audio.volume = 0.7
              break
            case "gameStart":
              audio.volume = 0.6
              break
            case "missClick":
              audio.volume = 0.3
              break
            case "pointsEarned":
              audio.volume = 0.4
              break
            default:
              audio.volume = 0.5
          }

          // Убедимся, что звуковые эффекты не зацикливаются
          audio.loop = false
        }

        audioElements[soundKey] = audio
      })

      setIsInitialized(true)

      // Логирование для отладки
      console.log("Sound system initialized with all 16-bit sounds:", Object.keys(sounds))
    }
  }, [])

  // Обновляем состояние звука при изменении isMuted
  useEffect(() => {
    if (isInitialized) {
      Object.values(audioElements).forEach((audio) => {
        if (audio) {
          audio.muted = isMuted
        }
      })

      // Сохраняем состояние звука
      localStorage.setItem("isMuted", isMuted.toString())
    }
  }, [isMuted, isInitialized])

  const playSound = (sound: SoundType) => {
    try {
      const audio = audioElements[sound]
      if (audio) {
        // Для звуковых эффектов, просто перематываем и воспроизводим заново
        if (!sound.includes("Theme")) {
          // Останавливаем текущее воспроизведение, если оно идет
          audio.pause()
          audio.currentTime = 0

          // Воспроизводим звук
          const playPromise = audio.play()

          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.error(`Error playing ${sound}:`, err)
            })
          }
        }
        // Для музыкальных тем останавливаем все другие темы перед воспроизведением
        else {
          Object.keys(audioElements).forEach((key) => {
            const soundKey = key as SoundType
            if (soundKey.includes("Theme") && soundKey !== sound) {
              const otherAudio = audioElements[soundKey]
              if (otherAudio && !otherAudio.paused) {
                otherAudio.pause()
                otherAudio.currentTime = 0
              }
            }
          })

          if (audio.paused) {
            const playPromise = audio.play()

            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.error(`Error playing ${sound}:`, err)
              })
            }
          }
        }
      } else {
        console.error(`Audio element for ${sound} not found`)
      }
    } catch (error) {
      console.error("Error playing sound:", error)
    }
  }

  const stopSound = (sound: SoundType) => {
    try {
      const audio = audioElements[sound]
      if (audio && !audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    } catch (error) {
      console.error("Error stopping sound:", error)
    }
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return <SoundContext.Provider value={{ playSound, stopSound, toggleMute, isMuted }}>{children}</SoundContext.Provider>
}

export const useSound = () => {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}

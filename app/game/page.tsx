"use client"

import React from "react"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { MonsterGame } from "./monster-game"
import {
  Heart,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowLeft,
  Music,
  AlertTriangle,
  Shield,
  Users,
  Clock,
  Zap,
  Bomb,
  Medal,
  Crown,
  Sparkles,
  Star,
} from "lucide-react"
import { disablePawPrints, enablePawPrints } from "@/components/paw-prints"
import { useI18n } from "@/lib/i18n-context"
import { useMobile } from "@/hooks/use-mobile"
import type { GameSettings as GameSettingsType } from "@/components/game-settings"
import { motion, AnimatePresence } from "framer-motion"
import { Leaderboard } from "@/components/game/leaderboard"
import { Achievements, updatePlayerStats } from "@/components/game/achievements"
import { useRouter } from "next/navigation"
import { useWallet } from "@/lib/wallet-connect"

// Типы боссов (должны совпадать с теми, что в monster-game.ts)
enum BossType {
  NORMAL = "normal",
  CHOMPER = "chomper",
  SPIKY = "spiky",
  DEMON = "demon",
}

// Добавляем компонент для параллакс-эффекта
function ParallaxBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Нормализуем позицию мыши относительно центра экрана
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Черный фон */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
        }}
      />

      {/* Градиентная подсветка - изменена на желтую */}
      <div
        className="absolute inset-0 opacity-20 bg-gradient-radial from-yellow-900 via-transparent to-transparent"
        style={{
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
        }}
      />

      {/* Звезды на заднем плане */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            transform: `translate(${mousePosition.x * (0.5 + Math.random() * 0.5)}px, ${mousePosition.y * (0.5 + Math.random() * 0.5)}px)`,
            transition: "transform 0.1s ease-out",
            boxShadow: `0 0 ${Math.random() * 3 + 2}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}

      {/* Туманности - изменены на желтые */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 300 + 200}px`,
            height: `${Math.random() * 300 + 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.1 + 0.05,
            background: `radial-gradient(circle, rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, 0, 0.3) 0%, rgba(0,0,0,0) 70%)`,
            transform: `translate(${mousePosition.x * (0.2 + Math.random() * 0.2)}px, ${mousePosition.y * (0.2 + Math.random() * 0.2)}px)`,
            transition: "transform 0.3s ease-out",
            filter: "blur(30px)",
          }}
        />
      ))}
    </div>
  )
}

// Компонент для анимированного счета
function AnimatedScore({ score, className = "" }) {
  const [displayScore, setDisplayScore] = useState(score)

  useEffect(() => {
    if (score > displayScore) {
      // Анимируем увеличение счета
      const diff = score - displayScore
      const step = Math.max(1, Math.floor(diff / 10))

      const timer = setTimeout(() => {
        setDisplayScore((prev) => Math.min(score, prev + step))
      }, 50)

      return () => clearTimeout(timer)
    } else if (score < displayScore) {
      // Мгновенно устанавливаем счет при уменьшении
      setDisplayScore(score)
    }
  }, [score, displayScore])

  return (
    <span className={className}>
      {displayScore}
      {score > displayScore && <span className="text-yellow-400 ml-1">+{score - displayScore}</span>}
    </span>
  )
}

// Компонент для анимированных сердец
function AnimatedHearts({ lives, maxLives = 3 }) {
  const filledHearts = useMemo(() => {
    return lives > 0 ? Array(lives).fill(0) : []
  }, [lives])

  const emptyHearts = useMemo(() => {
    return lives < maxLives ? Array(Math.max(0, maxLives - lives)).fill(0) : []
  }, [lives, maxLives])

  return (
    <div className="flex items-center">
      <AnimatePresence>
        {filledHearts.map((_, i) => (
          <motion.div
            key={`heart-filled-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mx-0.5"
          >
            <Heart className="w-4 h-4 text-red-500" fill="#ef4444" />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {emptyHearts.map((_, i) => (
          <motion.div
            key={`heart-empty-${i + lives}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mx-0.5"
          >
            <Heart className="w-4 h-4 text-gray-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Компонент для энергетической полосы - изменен на желтый
function EnergyBar({ energy, maxEnergy, className = "" }) {
  const percentage = (energy / maxEnergy) * 100

  return (
    <div className={`relative h-2 bg-black/50 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-yellow-600 to-amber-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Блики на полосе энергии */}
      <div
        className="absolute top-0 left-0 h-full w-20 bg-white/20"
        style={{
          transform: `translateX(${percentage - 20}%) skewX(-30deg)`,
          transition: "transform 0.3s ease-out",
        }}
      />
    </div>
  )
}

// Компонент для кнопки способности - изменен на желтый
function AbilityButton({ icon, name, cost, energy, active, onClick, disabled }) {
  const isAffordable = energy >= cost && !active && !disabled

  return (
    <motion.button
      onClick={onClick}
      disabled={!isAffordable}
      className={`relative flex-1 py-1 h-14 rounded-lg overflow-hidden ${
        isAffordable
          ? "bg-gradient-to-br from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600"
          : "bg-gray-800/70 text-gray-400"
      }`}
      whileTap={isAffordable ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {React.cloneElement(icon, { className: "w-5 h-5 mb-1" })}
        <span className="text-[10px] sm:text-xs whitespace-nowrap">{name}</span>
        <span className="text-xs">({cost})</span>
      </div>

      {/* Индикатор доступности */}
      {isAffordable && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        />
      )}

      {/* Индикатор активности */}
      {active && (
        <motion.div
          className="absolute inset-0 bg-green-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
        />
      )}
    </motion.button>
  )
}

// Компонент для отображения бонуса - изменен на желтый
function BonusMessage({ bonusType, show }) {
  // Получаем цвет и текст бонуса
  const getBonusColor = (type) => {
    switch (type) {
      case "points":
        return "from-yellow-500 to-amber-600"
      case "life":
        return "from-red-500 to-rose-600"
      case "slowdown":
        return "from-blue-500 to-cyan-600"
      case "shield":
        return "from-yellow-500 to-amber-600"
      case "energy":
        return "from-yellow-500 to-amber-600"
      default:
        return "from-yellow-500 to-amber-600"
    }
  }

  const getBonusName = (type) => {
    switch (type) {
      case "points":
        return "Double Points!"
      case "life":
        return "Extra Life!"
      case "slowdown":
        return "Monster Slowdown!"
      case "shield":
        return "Shield Activated!"
      case "energy":
        return "Energy +25!"
      default:
        return "Bonus Collected!"
    }
  }

  const getBonusIcon = (type) => {
    switch (type) {
      case "points":
        return <Star className="w-4 h-4" />
      case "life":
        return <Heart className="w-4 h-4" fill="#ef4444" />
      case "slowdown":
        return <Clock className="w-4 h-4" />
      case "shield":
        return <Shield className="w-4 h-4" />
      case "energy":
        return <Zap className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  return (
    <AnimatePresence>
      {show && bonusType && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`absolute top-12 left-0 right-0 z-30 mx-auto w-auto max-w-[90%] bg-gradient-to-r ${getBonusColor(bonusType)} p-2 rounded-lg text-white text-center pointer-events-none shadow-lg`}
          style={{ transform: "translateX(-50%)", left: "50%" }}
        >
          <div className="flex items-center justify-center gap-2">
            {getBonusIcon(bonusType)}
            <p className="text-sm font-bold">{getBonusName(bonusType)}</p>
            {getBonusIcon(bonusType)}
          </div>

          {/* Частицы вокруг сообщения */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Компонент для отображения предупреждения о боссе - изменен на желтый
function BossWarning({ bossInfo, show }) {
  return (
    <AnimatePresence>
      {show && bossInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-2 left-0 right-0 z-30 mx-auto w-auto max-w-[90%] bg-gradient-to-r from-yellow-600 to-amber-800 p-2 rounded-lg text-white text-center pointer-events-none shadow-lg border border-yellow-400"
          style={{ transform: "translateX(-50%)", left: "50%" }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-200" />
              <h3 className="text-sm font-bold text-white">{bossInfo.name}</h3>
              <AlertTriangle className="w-4 h-4 text-yellow-200" />
            </div>
            <p className="text-xs text-yellow-200">{bossInfo.description}</p>
          </div>

          {/* Пульсирующая рамка */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-yellow-300"
            animate={{
              boxShadow: ["0 0 0 0 rgba(255,200,0,0)", "0 0 0 4px rgba(255,200,0,0.3)", "0 0 0 0 rgba(255,200,0,0)"],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Компонент для отображения предупреждения о сложности
function DifficultyWarning({ monstersPerWave, show, text }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-2 left-0 right-0 z-30 mx-auto w-auto max-w-[90%] bg-gradient-to-r from-yellow-600 to-amber-700 p-2 rounded-lg text-white text-center pointer-events-none shadow-lg border border-yellow-400"
          style={{ transform: "translateX(-50%)", left: "50%" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-yellow-200" />
            <p className="text-sm font-bold text-white">{text}</p>
            <Users className="w-4 h-4 text-yellow-200" />
          </div>

          {/* Пульсирующая рамка */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-yellow-300"
            animate={{
              boxShadow: ["0 0 0 0 rgba(255,200,0,0)", "0 0 0 4px rgba(255,200,0,0.3)", "0 0 0 0 rgba(255,200,0,0)"],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Компонент для отображения комбо - изменен на желтый
function ComboDisplay({ comboCount, comboMultiplier }) {
  const isActive = comboCount > 1

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="h-6 flex items-center bg-gradient-to-r from-yellow-500 to-amber-600 rounded-md px-2 min-w-[100px] transition-colors duration-300 shadow-md"
        >
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-200" />
            <motion.span
              className="text-white text-xs font-medium"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, repeatDelay: 0.5 }}
            >
              Combo x{comboMultiplier} ({comboCount})
            </motion.span>
          </div>

          {/* Блики */}
          <motion.div
            className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 skew-x-[-20deg]"
            animate={{ x: [-40, 100] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Компонент для отображения информации о боссе - изменен на желтый
function BossDisplay({ currentBoss, bossInfo }) {
  return (
    <AnimatePresence>
      {currentBoss && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="h-6 flex items-center bg-gradient-to-r from-yellow-700 to-amber-800 border border-yellow-500/50 rounded-md px-2 min-w-[100px] transition-colors duration-300 shadow-md"
        >
          <div className="flex items-center gap-1">
            <Crown className="w-3 h-3 text-yellow-300" />
            <span className="text-white text-xs font-medium">{bossInfo.name}</span>
          </div>

          {/* Пульсирующий эффект */}
          <motion.div
            className="absolute inset-0 rounded-md border border-yellow-400"
            animate={{
              boxShadow: ["0 0 0 0 rgba(234,179,8,0)", "0 0 0 3px rgba(234,179,8,0.3)", "0 0 0 0 rgba(234,179,8,0)"],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Компонент для отображения уровня сложности
function DifficultyDisplay({ difficultyLevel, locale }) {
  return (
    <AnimatePresence>
      {difficultyLevel > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="h-6 flex items-center bg-gradient-to-r from-amber-700 to-yellow-800 border border-yellow-500/50 rounded-md px-2 min-w-[60px] transition-colors duration-300 shadow-md"
        >
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-300" />
            <span className="text-white text-xs font-medium">
              {locale === "ru" ? `Ур. ${difficultyLevel}` : `Lvl ${difficultyLevel}`}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Компонент для кнопки с эффектом нажатия
function AnimatedButton({ children, onClick, className = "", disabled = false }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${className} relative overflow-hidden`}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}

      {/* Эффект нажатия */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        whileTap={{ opacity: 0.2, scale: 0.9 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  )
}

export default function MonsterDefenderGame() {
  // Оставляем все существующие состояния и хуки

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [game, setGame] = useState<MonsterGame | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState(0)
  const maxLives = 3
  const [muted, setMuted] = useState(false) // Звук включен по умолчанию
  const [error, setError] = useState<string | null>(null)
  const { locale } = useI18n()
  const [currentBoss, setCurrentBoss] = useState<BossType | null>(null)
  const [showBossWarning, setShowBossWarning] = useState(false)
  const [difficultyLevel, setDifficultyLevel] = useState(0)
  const [monstersPerWave, setMonstersPerWave] = useState(1)
  const [showDifficultyWarning, setShowDifficultyWarning] = useState(false)
  const router = useRouter()
  const { address } = useWallet()

  // Определение для Telegram браузера
  const isTelegramBrowser = typeof window !== "undefined" && window.navigator.userAgent.includes("Telegram")

  // Заменим определение isMobile и isLandscape на использование хука
  const { isMobile, isLandscape, isTouch } = useMobile()
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Состояние для настроек
  const [gameSettings, setGameSettings] = useState<GameSettingsType>({
    hitboxSize: 1.3,
    lowPerformanceMode: false,
    vibrationEnabled: true,
    soundEnabled: true, // Звук включен по умолчанию
    volume: 0.5, // Громкость 50%
    musicVolume: 0.3, // Громкость музыки 30%
    tactileFeedbackEnabled: true,
  })

  // Новые состояния для комбо и специальных способностей
  const [comboCount, setComboCount] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [energy, setEnergy] = useState(0)
  const [maxEnergy, setMaxEnergy] = useState(100)
  const [activeAbility, setActiveAbility] = useState<string | null>(null)
  const [abilityDuration, setAbilityDuration] = useState(0)
  const [abilityTimer, setAbilityTimer] = useState(0)
  const [lastBonusType, setLastBonusType] = useState<string | null>(null)
  const [showBonusMessage, setShowBonusMessage] = useState(false)

  // Новые состояния для таблицы лидеров и достижений
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [gameStats, setGameStats] = useState({
    monstersDefeated: 0,
    bossesDefeated: 0,
    specialAbilitiesUsed: 0,
    comboMax: 0,
    projectilesDestroyed: 0,
    powerUpsCollected: 0,
    playTime: 0,
  })
  const gameStartTimeRef = useRef<number>(0)
  const gameStatsIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Таймер для отображения сообщения о бонусе
  useEffect(() => {
    if (lastBonusType) {
      setShowBonusMessage(true)
      const timer = setTimeout(() => {
        setShowBonusMessage(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [lastBonusType])

  // Таймер для отсчета времени действия способности
  useEffect(() => {
    if (activeAbility && abilityDuration > 0) {
      setAbilityTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setActiveAbility(null)
          return 0
        }
        return prev - 1
      })

      const interval = setInterval(() => {
        setAbilityTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setActiveAbility(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [activeAbility, abilityDuration])

  // Локализованные тексты для всех языков
  const getLocalizedText = (key: string) => {
    switch (key) {
      // Общие тексты
      case "title":
        switch (locale) {
          case "ru":
            return "Защитник от Монстров"
          case "es":
            return "Defensor de Monstruos"
          case "fr":
            return "Défenseur de Monstres"
          case "de":
            return "Monster-Verteidiger"
          case "it":
            return "Difensore di Mostri"
          case "zh":
            return "怪物防御者"
          case "hi":
            return "मॉन्स्टर डिफेंडर"
          case "uk":
            return "Захисник від Монстрів"
          case "ar":
            return "مدافع الوحوش"
          default:
            return "Monster Defender"
        }
      case "backToHome":
        switch (locale) {
          case "ru":
            return "Вернуться на главную"
          case "es":
            return "Volver al inicio"
          case "fr":
            return "Retour à l'accueil"
          case "de":
            return "Zurück zur Startseite"
          case "it":
            return "Torna alla home"
          case "zh":
            return "返回首页"
          case "hi":
            return "होम पर वापस जाएं"
          case "uk":
            return "Повернутися на головну"
          case "ar":
            return "العودة إلى الرئيسية"
          default:
            return "Back to Home"
        }
      case "errorMessage":
        switch (locale) {
          case "ru":
            return "Не удалось инициализировать игру. Пожалуйста, обновите страницу."
          case "es":
            return "No se pudo inicializar el juego. Por favor, actualice la página."
          case "fr":
            return "Impossible d'initialiser le jeu. Veuillez rafraîchir la page."
          case "de":
            return "Spiel konnte nicht initialisiert werden. Bitte aktualisieren Sie die Seite."
          case "it":
            return "Impossibile inizializzare il gioco. Si prega di aggiornare la pagina."
          case "zh":
            return "无法初始化游戏。请刷新页面。"
          case "hi":
            return "गेम को प्रारंभ करने में विफल। कृपया पेज रीफ्रेश करें।"
          case "uk":
            return "Не вдалося ініціалізувати гру. Будь ласка, оновіть сторінку."
          case "ar":
            return "فشل في تهيئة اللعبة. يرجى تحديث الصفحة."
          default:
            return "Failed to initialize game. Please refresh the page."
        }
      case "refreshPage":
        switch (locale) {
          case "ru":
            return "Обновить страницу"
          case "es":
            return "Actualizar página"
          case "fr":
            return "Rafraîchir la page"
          case "de":
            return "Seite aktualisieren"
          case "it":
            return "Aggiorna pagina"
          case "zh":
            return "刷新页面"
          case "hi":
            return "पेज रीफ्रेश करें"
          case "uk":
            return "Оновити сторінку"
          case "ar":
            return "تحديث الصفحة"
          default:
            return "Refresh Page"
        }
      case "gameOver":
        switch (locale) {
          case "ru":
            return "Игра окончена!"
          case "es":
            return "¡Juego terminado!"
          case "fr":
            return "Partie terminée!"
          case "de":
            return "Spiel vorbei!"
          case "it":
            return "Game Over!"
          case "zh":
            return "游戏结束!"
          case "hi":
            return "खेल समाप्त!"
          case "uk":
            return "Гра закінчена!"
          case "ar":
            return "انتهت اللعبة!"
          default:
            return "Game Over!"
        }
      case "score":
        switch (locale) {
          case "ru":
            return "Счёт"
          case "es":
            return "Puntuación"
          case "fr":
            return "Score"
          case "de":
            return "Punktzahl"
          case "it":
            return "Punteggio"
          case "zh":
            return "得分"
          case "hi":
            return "स्कोर"
          case "uk":
            return "Рахунок"
          case "ar":
            return "النتيجة"
          default:
            return "Score"
        }
      case "highScore":
        switch (locale) {
          case "ru":
            return "Рекорд"
          case "es":
            return "Récord"
          case "fr":
            return "Meilleur score"
          case "de":
            return "Highscore"
          case "it":
            return "Punteggio massimo"
          case "zh":
            return "最高分"
          case "hi":
            return "उच्च स्कोर"
          case "uk":
            return "Рекорд"
          case "ar":
            return "أعلى نتيجة"
          default:
            return "High Score"
        }
      case "playAgain":
        switch (locale) {
          case "ru":
            return "Играть снова"
          case "es":
            return "Jugar de nuevo"
          case "fr":
            return "Rejouer"
          case "de":
            return "Nochmal spielen"
          case "it":
            return "Gioca ancora"
          case "zh":
            return "再玩一次"
          case "hi":
            return "फिर से खेलें"
          case "uk":
            return "Грати знову"
          case "ar":
            return "العب مرة أخرى"
          default:
            return "Play Again"
        }
      case "readyToPlay":
        switch (locale) {
          case "ru":
            return "Готовы играть?"
          case "es":
            return "¿Listo para jugar?"
          case "fr":
            return "Prêt à jouer?"
          case "de":
            return "Bereit zum Spielen?"
          case "it":
            return "Pronto a giocare?"
          case "zh":
            return "准备好玩了吗？"
          case "hi":
            return "खेलने के लिए तैयार?"
          case "uk":
            return "Готові грати?"
          case "ar":
            return "مستعد للعب؟"
          default:
            return "Ready to Play?"
        }
      case "clickMonsters":
        switch (locale) {
          case "ru":
            return "Нажимайте на монстров до того, как они запустят снаряды!"
          case "es":
            return "¡Toca los monstruos antes de que lancen proyectiles!"
          case "fr":
            return "Tapez sur les monstres avant qu'ils ne lancent des projectiles!"
          case "de":
            return "Tippe auf Monster, bevor sie Projektile abfeuern!"
          case "it":
            return "Tocca i mostri prima che lancino proiettili!"
          case "zh":
            return "在怪物发射弹射物之前点击它们！"
          case "hi":
            return "प्रोजेक्टाइल लॉन्च करने से पहले मॉन्स्टर पर टैप करें!"
          case "uk":
            return "Натискайте на монстрів до того, як вони запустят снаряди!"
          case "ar":
            return "انقر على الوحوش قبل أن تطلق المقذوفات!"
          default:
            return "Tap the monsters before they launch projectiles!"
        }
      case "startGame":
        switch (locale) {
          case "ru":
            return "Начать игру"
          case "es":
            return "Iniciar juego"
          case "fr":
            return "Commencer le jeu"
          case "de":
            return "Spiel starten"
          case "it":
            return "Inizia gioco"
          case "zh":
            return "开始游戏"
          case "hi":
            return "गेम शुरू करें"
          case "uk":
            return "Почати гру"
          case "ar":
            return "ابدأ اللعبة"
          default:
            return "Start Game"
        }
      case "howToPlay":
        switch (locale) {
          case "ru":
            return "Как играть"
          case "es":
            return "Cómo jugar"
          case "fr":
            return "Comment jouer"
          case "de":
            return "Spielanleitung"
          case "it":
            return "Come giocare"
          case "zh":
            return "如何玩"
          case "hi":
            return "कैसे खेलें"
          case "uk":
            return "Як грати"
          case "ar":
            return "كيفية اللعب"
          default:
            return "How to Play"
        }
      case "instruction1":
        switch (locale) {
          case "ru":
            return "Нажимайте на монстров до того, как они запустят снаряды"
          case "es":
            return "Toca los monstruos antes de que lancen proyectiles"
          case "fr":
            return "Tapez sur les monstres avant qu'ils ne lancent des projectiles"
          case "de":
            return "Tippe auf Monster, bevor sie Projektile abfeuern"
          case "it":
            return "Tocca i mostri prima che lancino proiettili"
          case "zh":
            return "在怪物发射弹射物之前点击它们"
          case "hi":
            return "प्रोजेक्टाइल लॉन्च करने से पहले मॉन्स्टर पर टैप करें"
          case "uk":
            return "Натискайте на монстрів до того, як вони запустят снаряди"
          case "ar":
            return "انقر على الوحوش قبل أن تطلق المقذوفات"
          default:
            return "Tap monsters before they launch projectiles"
        }
      case "instruction2":
        switch (locale) {
          case "ru":
            return "Нажимайте на снаряды (какашки), чтобы уничтожить их"
          case "es":
            return "Toca los proyectiles (caca) para destruirlos"
          case "fr":
            return "Tapez sur les projectiles (caca) pour les détruire"
          case "de":
            return "Tippe auf Projektile (Kacke), um sie zu zerstören"
          case "it":
            return "Tocca i proiettili (cacca) per distruggerli"
          case "zh":
            return "点击弹射物（便便）以摧毁它们"
          case "hi":
            return "प्रोजेक्टाइल (पूप) को नष्ट करने के लिए उन पर टैप करें"
          case "uk":
            return "Натискайте на снаряди (какашки), щоб знищити їх"
          case "ar":
            return "انقر على المقذوفات (البراز) لتدميرها"
          default:
            return "Tap projectiles (poop) to destroy them"
        }
      case "instruction3":
        switch (locale) {
          case "ru":
            return "Не позволяйте снарядам достигать любого края экрана"
          case "es":
            return "No dejes que los proyectiles lleguen a cualquier borde de la pantalla"
          case "fr":
            return "Ne laissez pas les projectiles atteindre les bords de l'écran"
          case "de":
            return "Lass keine Projektile den Bildschirmrand erreichen"
          case "it":
            return "Non lasciare che i proiettili raggiungano i bordi dello schermo"
          case "zh":
            return "不要让弹射物到达屏幕边缘"
          case "hi":
            return "प्रोजेक्टाइल को स्क्रीन के किसी भी किनारे तक पहुंचने न दें"
          case "uk":
            return "Не дозволяйте снарядам досягати будь-якого краю екрану"
          case "ar":
            return "لا تدع المقذوفات تصل إلى أي حافة من حواف الشاشة"
          default:
            return "Don't let projectiles reach any screen edge"
        }
      case "instruction4":
        switch (locale) {
          case "ru":
            return "Снаряды летят в разных направлениях - будьте внимательны!"
          case "es":
            return "Los proyectiles vuelan en diferentes direcciones - ¡ten cuidado!"
          case "fr":
            return "Les projectiles volent dans différentes directions - soyez vigilant!"
          case "de":
            return "Projektile fliegen in verschiedene Richtungen - sei vorsichtig!"
          case "it":
            return "I proiettili volano in diverse direzioni - fai attenzione!"
          case "zh":
            return "弹射物朝不同方向飞行 - 请小心！"
          case "hi":
            return "प्रोजेक्टाइल विभिन्न दिशाओं में उड़ते हैं - सावधान रहें!"
          case "uk":
            return "Снаряди летять у різних напрямках - будьте уважні!"
          case "ar":
            return "المقذوفات تطير في اتجاهات مختلفة - كن حذرًا!"
          default:
            return "Projectiles fly in different directions - be careful!"
        }
      case "instruction5":
        switch (locale) {
          case "ru":
            return "Боссы появляются каждые 30 секунд"
          case "es":
            return "Los jefes aparecen cada 30 segundos"
          case "fr":
            return "Les boss apparaissent toutes les 30 secondes"
          case "de":
            return "Bosse erscheinen alle 30 Sekunden"
          case "it":
            return "I boss appaiono ogni 30 secondi"
          case "zh":
            return "Boss每30秒出现一次"
          case "hi":
            return "बॉस हर 30 सेकंड में दिखाई देते हैं"
          case "uk":
            return "Боси з'являються кожні 30 секунд"
          case "ar":
            return "تظهر الزعماء كل 30 ثانية"
          default:
            return "Bosses appear every 30 seconds"
        }
      case "instruction6":
        switch (locale) {
          case "ru":
            return "У вас есть 3 жизни - удачи!"
          case "es":
            return "Tienes 3 vidas - ¡buena suerte!"
          case "fr":
            return "Vous avez 3 vies - bonne chance!"
          case "de":
            return "Du hast 3 Leben - viel Glück!"
          case "it":
            return "Hai 3 vite - buona fortuna!"
          case "zh":
            return "你有3条生命 - 祝你好运！"
          case "hi":
            return "आपके पास 3 जीवन हैं - शुभकामनाएं!"
          case "uk":
            return "У вас є 3 життя - удачі!"
          case "ar":
            return "لديك 3 أرواح - حظًا سعيدًا!"
          default:
            return "You have 3 lives - good luck!"
        }
      case "muteSound":
        switch (locale) {
          case "ru":
            return "Отключить звук"
          case "es":
            return "Silenciar sonido"
          case "fr":
            return "Couper le son"
          case "de":
            return "Ton ausschalten"
          case "it":
            return "Disattiva audio"
          case "zh":
            return "静音"
          case "hi":
            return "साउंड म्यूट करें"
          case "uk":
            return "Вимкнути звук"
          case "ar":
            return "كتم الصوت"
          default:
            return "Mute game sounds"
        }
      case "unmuteSound":
        switch (locale) {
          case "ru":
            return "Включить звук"
          case "es":
            return "Activar sonido"
          case "fr":
            return "Activer le son"
          case "de":
            return "Ton einschalten"
          case "it":
            return "Attiva audio"
          case "zh":
            return "取消静音"
          case "hi":
            return "साउंड अनम्यूट करें"
          case "uk":
            return "Увімкнути звук"
          case "ar":
            return "إلغاء كتم الصوت"
          default:
            return "Unmute game sounds"
        }
      case "soundsEnabled":
        switch (locale) {
          case "ru":
            return "Звуки включены!"
          case "es":
            return "¡Sonidos activados!"
          case "fr":
            return "Sons activés!"
          case "de":
            return "Töne aktiviert!"
          case "it":
            return "Suoni attivati!"
          case "zh":
            return "声音已启用！"
          case "hi":
            return "साउंड सक्षम!"
          case "uk":
            return "Звуки увімкнено!"
          case "ar":
            return "تم تمكين الأصوات!"
          default:
            return "Sounds Enabled!"
        }
      case "retroSounds":
        switch (locale) {
          case "ru":
            return "Ретро-звуки в стиле Dendy/Sega"
          case "es":
            return "Sonidos retro estilo Dendy/Sega"
          case "fr":
            return "Sons rétro style Dendy/Sega"
          case "de":
            return "Retro-Sounds im Dendy/Sega-Stil"
          case "it":
            return "Suoni retro stile Dendy/Sega"
          case "zh":
            return "Dendy/Sega风格的复古音效"
          case "hi":
            return "Dendy/Sega शैली में रेट्रो साउंड"
          case "uk":
            return "Ретро-звуки у стилі Dendy/Sega"
          case "ar":
            return "أصوات ريترو على طراز Dendy/Sega"
          default:
            return "Retro Dendy/Sega style sounds"
        }
      case "difficultyIncreases":
        switch (locale) {
          case "ru":
            return "Сложность увеличивается каждые 30 секунд!"
          case "es":
            return "¡La dificultad aumenta cada 30 segundos!"
          case "fr":
            return "La difficulté augmente toutes les 30 secondes!"
          case "de":
            return "Die Schwierigkeit steigt alle 30 Sekunden!"
          case "it":
            return "La difficoltà aumenta ogni 30 secondi!"
          case "zh":
            return "难度每30秒增加一次！"
          case "hi":
            return "कठिनाई हर 30 सेकंड में बढ़ती है!"
          case "uk":
            return "Складність збільшується кожні 30 секунд!"
          case "ar":
            return "تزداد الصعوبة كل 30 ثانية!"
          default:
            return "Difficulty increases every 30 seconds!"
        }
      case "bossWarning":
        switch (locale) {
          case "ru":
            return "ВНИМАНИЕ! БОСС ПОЯВИЛСЯ!"
          case "es":
            return "¡ATENCIÓN! ¡HA APARECIDO UN JEFE!"
          case "fr":
            return "ATTENTION! UN BOSS EST APPARU!"
          case "de":
            return "ACHTUNG! BOSS ERSCHIENEN!"
          case "it":
            return "ATTENZIONE! BOSS APPARSO!"
          case "zh":
            return "警告！BOSS出现了！"
          case "hi":
            return "चेतावनी! बॉस प्रकट हुआ!"
          case "uk":
            return "УВАГА! БОС З'ЯВИВСЯ!"
          case "ar":
            return "تحذير! ظهر الزعيم!"
          default:
            return "WARNING! BOSS APPEARED!"
        }
      case "difficultyWarning":
        switch (locale) {
          case "ru":
            return "СЛОЖНОСТЬ УВЕЛИЧЕНА!"
          case "es":
            return "¡DIFICULTAD AUMENTADA!"
          case "fr":
            return "DIFFICULTÉ AUGMENTÉE!"
          case "de":
            return "SCHWIERIGKEIT ERHÖHT!"
          case "it":
            return "DIFFICOLTÀ AUMENTATA!"
          case "zh":
            return "难度增加！"
          case "hi":
            return "कठिनाई बढ़ी!"
          case "uk":
            return "СКЛАДНІСТЬ ЗБІЛЬШЕНО!"
          case "ar":
            return "زادت الصعوبة!"
          default:
            return "DIFFICULTY INCREASED!"
        }
      case "specialAttackWarning":
        switch (locale) {
          case "ru":
            return "СПЕЦИАЛЬНАЯ АТАКА БОССА!"
          case "es":
            return "¡ATAQUE ESPECIAL DEL JEFE!"
          case "fr":
            return "ATTAQUE SPÉCIALE DU BOSS!"
          case "de":
            return "SPEZIALANGRIFF DES BOSSES!"
          case "it":
            return "ATTACCO SPECIALE DEL BOSS!"
          case "zh":
            return "BOSS特殊攻击！"
          case "hi":
            return "बॉस का विशेष हमला!"
          case "uk":
            return "СПЕЦІАЛЬНА АТАКА БОСА!"
          case "ar":
            return "هجوم خاص من الزعيم!"
          default:
            return "BOSS SPECIAL ATTACK!"
        }
      case "combo":
        return locale === "ru" ? "Комбо" : "Combo"
      case "energy":
        return locale === "ru" ? "Энергия" : "Energy"
      case "timeFreeze":
        return locale === "ru" ? "Заморозка времени" : "Time Freeze"
      case "explosiveWave":
        return locale === "ru" ? "Взрывная волна" : "Explosive Wave"
      case "shield":
        return locale === "ru" ? "Щит" : "Shield"
      case "activateAbility":
        return locale === "ru" ? "Активировать" : "Activate"
      case "secondsLeft":
        return locale === "ru" ? "сек." : "sec."
      case "bonusCollected":
        return locale === "ru" ? "Бонус собран!" : "Bonus Collected!"
      case "shieldedMonster":
        return locale === "ru"
          ? "Монстры с щитами требуют нескольких нажатий"
          : "Shielded monsters require multiple taps"
      case "splitterMonster":
        return locale === "ru"
          ? "Монстры-разделители распадаются на маленькие части"
          : "Splitter monsters break into smaller ones"
      case "comboSystem":
        return locale === "ru"
          ? "Система комбо увеличивает очки за быстрые убийства"
          : "Combo system increases points for quick kills"
      case "bonusItems":
        return locale === "ru" ? "Собирайте бонусы от уничтоженных монстров" : "Collect bonuses from destroyed monsters"
      case "specialAbilities":
        return locale === "ru"
          ? "Используйте специальные способности, когда накопите энергию"
          : "Use special abilities when you gather enough energy"
      case "leaderboard":
        return locale === "ru" ? "Таблица лидеров" : "Leaderboard"
      case "achievements":
        return locale === "ru" ? "Достижения" : "Achievements"
      default:
        return ""
    }
  }

  // Локализованные тексты
  const texts = {
    title: getLocalizedText("title"),
    backToHome: getLocalizedText("backToHome"),
    errorMessage: getLocalizedText("errorMessage"),
    refreshPage: getLocalizedText("refreshPage"),
    gameOver: getLocalizedText("gameOver"),
    score: getLocalizedText("score"),
    highScore: getLocalizedText("highScore"),
    playAgain: getLocalizedText("playAgain"),
    readyToPlay: getLocalizedText("readyToPlay"),
    clickMonsters: getLocalizedText("clickMonsters"),
    startGame: getLocalizedText("startGame"),
    howToPlay: getLocalizedText("howToPlay"),
    instruction1: getLocalizedText("instruction1"),
    instruction2: getLocalizedText("instruction2"),
    instruction3: getLocalizedText("instruction3"),
    instruction4: getLocalizedText("instruction4"),
    instruction5: getLocalizedText("instruction5"),
    instruction6: getLocalizedText("instruction6"),
    muteSound: getLocalizedText("muteSound"),
    unmuteSound: getLocalizedText("unmuteSound"),
    livesRemaining: (lives: number) => (locale === "ru" ? `Осталось жизней: ${lives}` : `${lives} lives remaining`),
    soundsEnabled: getLocalizedText("soundsEnabled"),
    retroSounds: getLocalizedText("retroSounds"),
    difficultyIncreases: getLocalizedText("difficultyIncreases"),
    bossWarning: getLocalizedText("bossWarning"),
    difficultyWarning: getLocalizedText("difficultyWarning"),
    monstersPerWave: (count: number) =>
      locale === "ru"
        ? `Теперь появляется ${count} ${count === 1 ? "монстр" : count < 5 ? "монстра" : "монстров"} одновременно!`
        : `Now spawning ${count} monster${count > 1 ? "s" : ""} at once!`,
    bossNames: {
      [BossType.NORMAL]: locale === "ru" ? "Обычный Босс" : "Normal Boss",
      [BossType.CHOMPER]: locale === "ru" ? "Пожиратель" : "Chomper",
      [BossType.SPIKY]: locale === "ru" ? "Колючка" : "Spiky",
      [BossType.DEMON]: locale === "ru" ? "Демон" : "Demon",
    },
    bossDescriptions: {
      [BossType.NORMAL]: locale === "ru" ? "Стандартный босс с базовыми атаками" : "Standard boss with basic attacks",
      [BossType.CHOMPER]:
        locale === "ru"
          ? "Атакует сразу в нескольких направлениях. Специальная атака: круговой залп!"
          : "Attacks in multiple directions. Special attack: circular barrage!",
      [BossType.SPIKY]:
        locale === "ru"
          ? "Быстрые и опасные снаряды. Специальная атака: волна шипов!"
          : "Fast and dangerous projectiles. Special attack: spike wave!",
      [BossType.DEMON]:
        locale === "ru"
          ? "Телепортируется и запускает мощные снаряды. Специальная атака: телепортация и залп!"
          : "Teleports and launches powerful projectiles. Special attack: teleport and barrage!",
    },
    specialAttackWarning: getLocalizedText("specialAttackWarning"),
    combo: getLocalizedText("combo"),
    energy: getLocalizedText("energy"),
    timeFreeze: getLocalizedText("timeFreeze"),
    explosiveWave: getLocalizedText("explosiveWave"),
    shield: getLocalizedText("shield"),
    activateAbility: getLocalizedText("activateAbility"),
    secondsLeft: getLocalizedText("secondsLeft"),
    bonusCollected: getLocalizedText("bonusCollected"),
    shieldedMonster: getLocalizedText("shieldedMonster"),
    splitterMonster: getLocalizedText("splitterMonster"),
    comboSystem: getLocalizedText("comboSystem"),
    bonusItems: getLocalizedText("bonusItems"),
    specialAbilities: getLocalizedText("specialAbilities"),
    leaderboard: getLocalizedText("leaderboard"),
    achievements: getLocalizedText("achievements"),
  }

  // Handle back to home
  const handleBackToHome = () => {
    router.push("/")
  }

  // Disable paw prints when mounting component
  useEffect(() => {
    // Disable paw prints when entering game page
    disablePawPrints()

    // Enable paw prints when leaving page
    return () => {
      enablePawPrints()

      // Stop background music when leaving the game page
      if (game) {
        game.destroy()
      }
    }
  }, [game])

  // Улучшаем обработку сенсорных событий для мобильных устройств

  // Добавляем эффект для предотвращения прокрутки страницы во время игры
  useEffect(() => {
    if (gameStarted) {
      // Предотвращаем прокрутку страницы во время игры
      const preventDefault = (e: Event) => {
        e.preventDefault()
      }

      // Добавляем обработчики событий
      document.addEventListener("touchmove", preventDefault, { passive: false })

      // Очищаем обработчики при размонтировании
      return () => {
        document.removeEventListener("touchmove", preventDefault)
      }
    }
  }, [gameStarted])

  // Track game stats
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Start tracking play time
      gameStartTimeRef.current = Date.now()

      // Set up interval to update play time
      gameStatsIntervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - gameStartTimeRef.current) / 1000)
        setGameStats((prev) => ({
          ...prev,
          playTime: elapsedSeconds,
        }))
      }, 1000)
    } else if (gameOver) {
      // Clear interval when game is over
      if (gameStatsIntervalRef.current) {
        clearInterval(gameStatsIntervalRef.current)
        gameStatsIntervalRef.current = null
      }

      // Update achievements if wallet is connected
      if (address) {
        updatePlayerStats(address, {
          monstersDefeated: gameStats.monstersDefeated,
          bossesDefeated: gameStats.bossesDefeated,
          highScore: score,
          specialAbilitiesUsed: gameStats.specialAbilitiesUsed,
          comboMax: gameStats.comboMax,
          projectilesDestroyed: gameStats.projectilesDestroyed,
          powerUpsCollected: gameStats.powerUpsCollected,
          gamesPlayed: 1,
          totalPlayTime: gameStats.playTime,
        })
      }
    }

    return () => {
      if (gameStatsIntervalRef.current) {
        clearInterval(gameStatsIntervalRef.current)
        gameStatsIntervalRef.current = null
      }
    }
  }, [gameStarted, gameOver, address, score, gameStats])

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return

    let newGame: MonsterGame | null = null

    try {
      // Create game instance
      newGame = new MonsterGame(canvasRef.current)
      setGame(newGame)

      // Set up event handlers
      newGame.onScoreChange = (newScore) => setScore(newScore)
      newGame.onLivesChange = (newLives) => setLives(newLives)
      newGame.onGameOver = () => {
        setGameOver(true)
        setGameStarted(false)

        // Update high score if needed
        if (newGame && newGame.score > highScore) {
          setHighScore(newGame.score)
          localStorage.setItem("monsterDefenderHighScore", newGame.score.toString())
        }
      }

      // Обработчик появления босса
      newGame.onBossAppear = (bossType) => {
        setCurrentBoss(bossType)
        setShowBossWarning(true)

        // Update boss defeated count for stats
        setGameStats((prev) => ({
          ...prev,
          bossesDefeated: prev.bossesDefeated + 1,
        }))

        // Скрываем предупреждение через 3 секунды
        setTimeout(() => {
          setShowBossWarning(false)
        }, 3000)
      }

      // Обработчик увеличения сложности
      newGame.onDifficultyIncrease = (level, monstersCount) => {
        setDifficultyLevel(level)
        setMonstersPerWave(monstersCount)
        setShowDifficultyWarning(true)

        // Скрываем предупреждение через 3 секунды
        setTimeout(() => {
          setShowDifficultyWarning(false)
        }, 3000)
      }

      // Новые обработчики
      newGame.onComboChange = (combo, multiplier) => {
        setComboCount(combo)
        setComboMultiplier(multiplier)

        // Update max combo for stats
        if (combo > gameStats.comboMax) {
          setGameStats((prev) => ({
            ...prev,
            comboMax: combo,
          }))
        }
      }

      newGame.onEnergyChange = (currentEnergy, maxEnergyValue) => {
        setEnergy(currentEnergy)
        setMaxEnergy(maxEnergyValue)
      }

      newGame.onSpecialAbilityActivated = (abilityType, duration) => {
        setActiveAbility(abilityType)
        setAbilityDuration(duration)

        // Update special abilities used count for stats
        setGameStats((prev) => ({
          ...prev,
          specialAbilitiesUsed: prev.specialAbilitiesUsed + 1,
        }))
      }

      newGame.onBonusCollected = (bonusType) => {
        setLastBonusType(bonusType)

        // Update power-ups collected count for stats
        setGameStats((prev) => ({
          ...prev,
          powerUpsCollected: prev.powerUpsCollected + 1,
        }))
      }

      // Установка начальных значений громкости
      newGame.setVolume(gameSettings.volume)
      newGame.setMusicVolume(gameSettings.musicVolume)

      // Load high score from localStorage
      const savedHighScore = localStorage.getItem("monsterDefenderHighScore")
      if (savedHighScore) {
        setHighScore(Number.parseInt(savedHighScore))
      }

      // Clean up on unmount
      return () => {
        if (newGame) {
          newGame.destroy()
        }
      }
    } catch (err: any) {
      console.error("Error initializing game:", err)
      setError(texts.errorMessage)
    }
  }, [highScore, texts.errorMessage, gameSettings.volume, gameSettings.musicVolume])

  // Добавим обработчики для активации специальных способностей
  const handleActivateTimeFreeze = useCallback(() => {
    if (game && energy >= 50) {
      game.activateTimeFreeze()
    }
  }, [game, energy])

  const handleActivateExplosiveWave = useCallback(() => {
    if (game && energy >= 75) {
      game.activateExplosiveWave()
    }
  }, [game, energy])

  const handleActivateShield = useCallback(() => {
    if (game && energy >= 60) {
      game.activateShield()
    }
  }, [game, energy])

  // Функция для получения локализованного названия бонуса
  const getBonusName = (bonusType: string) => {
    switch (bonusType) {
      case "points":
        return locale === "ru" ? "Удвоение очков!" : "Double Points!"
      case "life":
        return locale === "ru" ? "Дополнительная жизнь!" : "Extra Life!"
      case "slowdown":
        return locale === "ru" ? "Замедление монстров!" : "Monster Slowdown!"
      case "shield":
        return locale === "ru" ? "Щит активирован!" : "Shield Activated!"
      case "energy":
        return locale === "ru" ? "Энергия +25!" : "Energy +25!"
      default:
        return locale === "ru" ? "Бонус собран!" : "Bonus Collected!"
    }
  }

  // Функция для получения цвета бонуса
  const getBonusColor = (bonusType: string) => {
    switch (bonusType) {
      case "points":
        return "bg-yellow-500"
      case "life":
        return "bg-red-500"
      case "slowdown":
        return "bg-blue-500"
      case "shield":
        return "bg-indigo-500"
      case "energy":
        return "bg-purple-500"
      default:
        return "bg-green-500"
    }
  }

  // Добавим новые тексты в объект texts

  // В JSX добавим отображение комбо, энергии и кнопок способностей

  // Dummy data for bossInfo
  const getBossInfo = () => {
    if (currentBoss) {
      return {
        name: texts.bossNames[currentBoss],
        description: texts.bossDescriptions[currentBoss],
      }
    }
    return {
      name: texts.bossNames[BossType.NORMAL],
      description: texts.bossDescriptions[BossType.NORMAL],
    }
  }

  const bossInfo = getBossInfo()

  // Create arrays for hearts display with proper length validation
  const filledHearts = useMemo(() => {
    return lives > 0 ? Array(lives).fill(0) : []
  }, [lives])

  const emptyHearts = useMemo(() => {
    return lives < 3 ? Array(Math.max(0, 3 - lives)).fill(0) : []
  }, [lives, maxLives])

  const handleToggleMute = () => {
    setMuted((prev) => !prev)
    if (game) {
      game.toggleMute()
    }
  }

  const handleSettingsChange = (newSettings: GameSettingsType) => {
    setGameSettings(newSettings)
    if (game) {
      game.setVolume(newSettings.volume)
      game.setMusicVolume(newSettings.musicVolume)
    }
  }

  const handleSettingsOpen = () => {
    if (game) {
      game.pauseGame()
    }
  }

  const handleSettingsClose = () => {
    if (game) {
      game.resumeGame()
    }
  }

  // Handle start game
  const handleStartGame = () => {
    if (!game) return

    game.start()
    setGameStarted(true)
    setGameOver(false)

    // Пробуем перейти в полноэкранный режим ТОЛЬКО на мобильных устройствах
    if (isMobile) {
      try {
        const element = document.documentElement

        if (element.requestFullscreen) {
          element.requestFullscreen().catch((err) => {
            console.log("Ошибка перехода в полноэкранный режим:", err)
          })
        } else if ((element as any).webkitRequestFullscreen) {
          ;(element as any).webkitRequestFullscreen()
        } else if ((element as any).mozRequestFullScreen) {
          ;(element as any).mozRequestFullScreen()
        } else if ((element as any).msRequestFullscreen) {
          ;(element as any).msRequestFullscreen()
        }
        setIsFullscreen(true)
      } catch (err) {
        console.error("Не удалось перейти в полноэкранный режим:", err)
      }
    }
  }

  // Handle restart game
  const handleRestartGame = () => {
    if (!game) return

    game.restart()
    setGameStarted(true)
    setGameOver(false)

    // Проверяем, находимся ли мы уже в полноэкранном режиме
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullscreenElement ||
      (document as any).msFullscreenElement
    )

    // Если не в полноэкранном режиме и это мобильное устройство, пробуем перейти
    if (!isCurrentlyFullscreen && isMobile) {
      try {
        const element = document.documentElement

        if (element.requestFullscreen) {
          element.requestFullscreen().catch((err) => {
            console.log("Ошибка перехода в полноэкранный режим:", err)
          })
        } else if ((element as any).webkitRequestFullscreen) {
          ;(element as any).webkitRequestFullscreen()
        } else if ((element as any).mozRequestFullScreen) {
          ;(element as any).mozRequestFullScreen()
        } else if ((element as any).msRequestFullscreen) {
          ;(element as any).msRequestFullscreen()
        }
        setIsFullscreen(true)
      } catch (err) {
        console.error("Не удалось перейти в полноэкранный режим:", err)
      }
    }
  }

  // Улучшим функцию toggleFullscreen, чтобы она более надежно проверяла и устанавливала полноэкранный режим
  const toggleFullscreen = () => {
    try {
      // Проверяем, находимся ли мы в полноэкранном режиме
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )

      if (isCurrentlyFullscreen) {
        // Выходим из полноэкранного режима
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          ;(document as any).webkitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
          ;(document as any).mozCancelFullScreen()
        } else if ((document as any).msExitFullscreen) {
          ;(document as any).msExitFullscreen()
        }
        setIsFullscreen(false)
      } else {
        // Входим в полноэкранный режим
        const element = document.documentElement

        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if ((element as any).webkitRequestFullscreen) {
          ;(element as any).webkitRequestFullscreen()
        } else if ((element as any).mozRequestFullScreen) {
          ;(element as any).mozRequestFullScreen()
        } else if ((element as any).msRequestFullscreen) {
          ;(element as any).msRequestFullscreen()
        }
        setIsFullscreen(true)
      }
    } catch (err) {
      console.error("Ошибка при переключении полноэкранного режима:", err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black p-2 pt-0 relative overflow-hidden">
      {/* Добавляем параллакс-фон */}
      <ParallaxBackground />

      {/* Error message */}
      {error && (
        <div className="w-full max-w-md bg-red-500/20 border border-red-500 p-4 rounded-lg mb-4 text-white mt-10 shadow-lg">
          <p>{error}</p>
          <AnimatedButton
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            {texts.refreshPage}
          </AnimatedButton>
        </div>
      )}

      {/* Boss warning - overlay */}
      <BossWarning bossInfo={bossInfo} show={showBossWarning} />

      {/* Difficulty warning - overlay */}
      <DifficultyWarning
        monstersPerWave={monstersPerWave}
        show={showDifficultyWarning}
        text={texts.monstersPerWave(monstersPerWave)}
      />

      {/* Сообщение о собранном бонусе */}
      <BonusMessage bonusType={lastBonusType} show={showBonusMessage} />

      {/* Верхняя панель - супер компактная */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex justify-between items-center w-full max-w-md mt-1 mb-0 px-2 bg-gradient-to-r from-yellow-900/90 to-amber-900/90 rounded-lg h-10 shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center">
          <AnimatedButton
            onClick={handleBackToHome}
            className="p-0 h-8 w-8 mr-1 rounded-full bg-yellow-800/50 hover:bg-yellow-700/70 flex items-center justify-center"
            aria-label={texts.backToHome}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </AnimatedButton>

          <div className="flex items-center bg-black/30 px-2 py-1 rounded-md">
            <Trophy className="w-4 h-4 text-yellow-400 mr-1" aria-hidden="true" />
            <AnimatedScore score={score} className="text-white font-bold text-sm" />
          </div>
        </div>

        <div className="flex items-center" aria-label={texts.livesRemaining(lives)}>
          <AnimatedHearts lives={lives} maxLives={3} />
        </div>

        {/* Энергия в верхней панели */}
        <div className="flex items-center bg-black/30 px-2 py-1 rounded-md">
          <Zap className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-white text-xs">
            {energy}/{maxEnergy}
          </span>
        </div>

        {/* Управление в одну линию */}
        <div className="flex items-center gap-1">
          <AnimatedButton
            onClick={handleToggleMute}
            className="text-white bg-yellow-800/50 hover:bg-yellow-700/70 w-8 h-8 p-0 rounded-full flex items-center justify-center"
            aria-label={muted ? texts.unmuteSound : texts.muteSound}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </AnimatedButton>

          <AnimatedButton
            onClick={toggleFullscreen}
            className="text-white bg-yellow-800/50 hover:bg-yellow-700/70 w-8 h-8 p-0 rounded-full flex items-center justify-center"
            aria-label={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
          >
            {isFullscreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            )}
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Информационная панель - всегда видимая, но компактная */}
      <div className="flex justify-between items-center w-full max-w-md mb-1 px-1 h-8 gap-2">
        {/* Блок для информации о боссе */}
        <BossDisplay currentBoss={currentBoss} bossInfo={bossInfo} />

        {/* Блок для комбо */}
        <ComboDisplay comboCount={comboCount} comboMultiplier={comboMultiplier} />

        {/* Блок для уровня сложности */}
        <DifficultyDisplay difficultyLevel={difficultyLevel} locale={locale} />
      </div>

      {/* Canvas container - maximized */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative bg-gradient-to-b from-yellow-900/70 to-amber-900/70 rounded-lg overflow-hidden border-2 border-yellow-700/70 w-full max-w-md canvas-container shadow-xl ${
          isMobile && isLandscape ? "landscape-mode" : ""
        }`}
        style={{
          height: isMobile ? `calc(100vh - ${isTelegramBrowser ? "180px" : "150px"})` : "70vh",
          maxHeight: isMobile ? `calc(100vh - ${isTelegramBrowser ? "180px" : "150px"})` : "70vh",
        }}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full touch-none cursor-crosshair ${isMobile ? "prevent-scroll no-select" : ""}`}
          style={{
            touchAction: "none",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
          aria-label={locale === "ru" ? "Игровое поле Защитника от Монстров" : "Monster Defender Game Canvas"}
        />

        {/* Полоса энергии внизу игрового поля */}
        {gameStarted && (
          <EnergyBar energy={energy} maxEnergy={maxEnergy} className="absolute bottom-0 left-0 right-0" />
        )}

        {/* Game state overlays */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 to-yellow-900/80 backdrop-blur-sm">
            {gameOver ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-center p-6 bg-black/50 rounded-xl border border-yellow-500/30 shadow-xl max-w-xs"
              >
                <motion.h2
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent"
                >
                  {texts.gameOver}
                </motion.h2>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-3 rounded-lg mb-4"
                >
                  <p className="text-yellow-400 text-xl mb-1 font-bold">
                    {texts.score}: <AnimatedScore score={score} />
                  </p>
                  <p className="text-green-400 text-sm mb-1">
                    {texts.highScore}: {highScore}
                  </p>

                  {/* Статистика игры */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-left text-xs text-gray-300">
                    <div>Monsters: {gameStats.monstersDefeated}</div>
                    <div>Bosses: {gameStats.bossesDefeated}</div>
                    <div>Max Combo: {gameStats.comboMax}x</div>
                    <div>Play Time: {gameStats.playTime}s</div>
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center mb-2">
                  <AnimatedButton
                    onClick={handleRestartGame}
                    className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white py-2 px-4 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {texts.playAgain}
                    </div>
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={() => setShowLeaderboard(true)}
                    className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white py-2 px-4 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      {texts.leaderboard}
                    </div>
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={() => setShowAchievements(true)}
                    className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white py-2 px-4 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      <Medal className="w-4 h-4 mr-2" />
                      {texts.achievements}
                    </div>
                  </AnimatedButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-center p-6 bg-black/50 rounded-xl border border-yellow-500/30 shadow-xl max-w-xs"
              >
                <motion.h2
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent"
                >
                  {texts.readyToPlay}
                </motion.h2>

                <p className="text-gray-300 text-sm mb-3 max-w-xs">{texts.clickMonsters}</p>
                <p className="text-yellow-300 text-sm mb-4">{texts.difficultyIncreases}</p>

                {/* Яркое сообщение о звуке */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-lg mb-6 shadow-lg shadow-yellow-500/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        rotate: [-5, 5, -5],
                      }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <Volume2 className="w-5 h-5 text-white" />
                    </motion.div>
                    <p className="text-white font-bold">
                      {locale === "ru" ? "ВКЛЮЧИ ЗВУК - БУДЕТ ВЕСЕЛЕЕ!" : "TURN ON SOUND - MORE FUN!"}
                    </p>
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        rotate: [5, -5, 5],
                      }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <Music className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-white/80 text-xs mt-1">
                    {locale === "ru" ? "Ретро-звуки и 8-битные эффекты!" : "Retro sounds and 8-bit effects!"}
                  </p>
                </motion.div>

                <AnimatedButton
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white py-3 px-8 rounded-lg text-lg font-bold shadow-lg shadow-yellow-500/30"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="flex items-center justify-center"
                  >
                    {texts.startGame}
                  </motion.div>
                </AnimatedButton>

                {/* Инструкции */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-xs text-gray-400 text-left"
                >
                  <p className="mb-1">• {texts.instruction1}</p>
                  <p className="mb-1">• {texts.instruction2}</p>
                  <p className="mb-1">• {texts.instruction3}</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Кнопки специальных способностей и настройки внизу */}
      {gameStarted && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex w-full max-w-md mt-2 gap-2 px-1 pb-16"
        >
          {/* Кнопки способностей с улучшенным дизайном */}
          <AbilityButton
            icon={<Clock />}
            name={texts.timeFreeze}
            cost={50}
            energy={energy}
            active={activeAbility === "timeFreeze"}
            onClick={handleActivateTimeFreeze}
            disabled={activeAbility !== null && activeAbility !== "timeFreeze"}
          />

          <AbilityButton
            icon={<Bomb />}
            name={texts.explosiveWave}
            cost={75}
            energy={energy}
            active={activeAbility === "explosiveWave"}
            onClick={handleActivateExplosiveWave}
            disabled={activeAbility !== null && activeAbility !== "explosiveWave"}
          />

          <AbilityButton
            icon={<Shield />}
            name={texts.shield}
            cost={60}
            energy={energy}
            active={activeAbility === "shield"}
            onClick={handleActivateShield}
            disabled={activeAbility !== null && activeAbility !== "shield"}
          />
        </motion.div>
      )}

      {/* Leaderboard Dialog */}
      <Leaderboard
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        currentScore={gameOver ? score : undefined}
        onSaveScore={(success) => {
          // Optionally handle successful score save
          if (success) {
            console.log("Score saved successfully")
          }
        }}
      />

      {/* Achievements Dialog */}
      <Achievements open={showAchievements} onOpenChange={setShowAchievements} />
    </div>
  )
}

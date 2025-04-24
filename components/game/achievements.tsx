"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Medal, X, Check, Lock, Star, Zap, Trophy, Skull, Target, AlertCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-connect"
import { useI18n } from "@/lib/i18n-context"
import { Progress } from "@/components/ui/progress"

// Define achievement types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  reward: string
  category: "monsters" | "bosses" | "score" | "special"
  secret?: boolean
}

export interface PlayerAchievement {
  id: string
  progress: number
  completed: boolean
  completedDate?: number
}

// Define player stats interface
export interface PlayerStats {
  monstersDefeated: number
  bossesDefeated: number
  highScore: number
  specialAbilitiesUsed: number
  comboMax: number
  projectilesDestroyed: number
  powerUpsCollected: number
  gamesPlayed: number
  totalPlayTime: number
}

// Mock API functions (replace with actual API calls in production)
const getAchievements = (): Achievement[] => {
  return [
    {
      id: "monsters_10",
      name: "Monster Hunter",
      description: "Defeat 10 monsters",
      icon: "monster",
      requirement: 10,
      reward: "Unlock new color scheme",
      category: "monsters",
    },
    {
      id: "monsters_50",
      name: "Monster Slayer",
      description: "Defeat 50 monsters",
      icon: "monster",
      requirement: 50,
      reward: "+10% score bonus",
      category: "monsters",
    },
    {
      id: "monsters_100",
      name: "Monster Exterminator",
      description: "Defeat 100 monsters",
      icon: "monster",
      requirement: 100,
      reward: "Unlock special ability",
      category: "monsters",
    },
    {
      id: "bosses_1",
      name: "Boss Challenger",
      description: "Defeat your first boss",
      icon: "boss",
      requirement: 1,
      reward: "Unlock boss info",
      category: "bosses",
    },
    {
      id: "bosses_5",
      name: "Boss Conqueror",
      description: "Defeat 5 bosses",
      icon: "boss",
      requirement: 5,
      reward: "+15% energy gain",
      category: "bosses",
    },
    {
      id: "bosses_all",
      name: "Boss Master",
      description: "Defeat all boss types",
      icon: "boss",
      requirement: 4, // Number of boss types
      reward: "Unlock special weapon",
      category: "bosses",
    },
    {
      id: "score_500",
      name: "Skilled Player",
      description: "Reach a score of 500",
      icon: "score",
      requirement: 500,
      reward: "New player title",
      category: "score",
    },
    {
      id: "score_1000",
      name: "Expert Player",
      description: "Reach a score of 1000",
      icon: "score",
      requirement: 1000,
      reward: "Extra life",
      category: "score",
    },
    {
      id: "score_2000",
      name: "Master Player",
      description: "Reach a score of 2000",
      icon: "score",
      requirement: 2000,
      reward: "Unlock all abilities",
      category: "score",
    },
    {
      id: "combo_10",
      name: "Combo Starter",
      description: "Achieve a 10x combo",
      icon: "special",
      requirement: 10,
      reward: "+5% combo multiplier",
      category: "special",
    },
    {
      id: "special_all",
      name: "Ability Master",
      description: "Use all special abilities",
      icon: "special",
      requirement: 3, // Number of special abilities
      reward: "Reduced energy cost",
      category: "special",
    },
    {
      id: "secret_survive",
      name: "Survivor",
      description: "Survive for 5 minutes",
      icon: "special",
      requirement: 300, // 300 seconds
      reward: "Secret bonus",
      category: "special",
      secret: true,
    },
  ]
}

const getPlayerAchievements = (address: string): PlayerAchievement[] => {
  try {
    const key = `achievements_${address.toLowerCase()}`
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : []
  } catch (error) {
    console.error("Error loading achievements:", error)
    return []
  }
}

const savePlayerAchievements = (address: string, achievements: PlayerAchievement[]): boolean => {
  try {
    const key = `achievements_${address.toLowerCase()}`
    localStorage.setItem(key, JSON.stringify(achievements))
    return true
  } catch (error) {
    console.error("Error saving achievements:", error)
    return false
  }
}

const getPlayerStats = (address: string): PlayerStats => {
  try {
    const key = `stats_${address.toLowerCase()}`
    const storedData = localStorage.getItem(key)
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    console.error("Error loading player stats:", error)
  }

  // Default stats
  return {
    monstersDefeated: 0,
    bossesDefeated: 0,
    highScore: 0,
    specialAbilitiesUsed: 0,
    comboMax: 0,
    projectilesDestroyed: 0,
    powerUpsCollected: 0,
    gamesPlayed: 0,
    totalPlayTime: 0,
  }
}

const savePlayerStats = (address: string, stats: PlayerStats): boolean => {
  try {
    const key = `stats_${address.toLowerCase()}`
    localStorage.setItem(key, JSON.stringify(stats))
    return true
  } catch (error) {
    console.error("Error saving player stats:", error)
    return false
  }
}

// Update player stats and check for achievements
export const updatePlayerStats = (
  address: string | null,
  statsUpdate: Partial<PlayerStats>,
): { newAchievements: Achievement[] } => {
  if (!address) return { newAchievements: [] }

  // Get current stats and achievements
  const currentStats = getPlayerStats(address)
  const playerAchievements = getPlayerAchievements(address)
  const allAchievements = getAchievements()

  // Update stats
  const updatedStats: PlayerStats = {
    ...currentStats,
    ...statsUpdate,
    // Ensure some values are properly calculated
    monstersDefeated: currentStats.monstersDefeated + (statsUpdate.monstersDefeated || 0),
    bossesDefeated: currentStats.bossesDefeated + (statsUpdate.bossesDefeated || 0),
    highScore: Math.max(currentStats.highScore, statsUpdate.highScore || 0),
    specialAbilitiesUsed: currentStats.specialAbilitiesUsed + (statsUpdate.specialAbilitiesUsed || 0),
    comboMax: Math.max(currentStats.comboMax, statsUpdate.comboMax || 0),
    projectilesDestroyed: currentStats.projectilesDestroyed + (statsUpdate.projectilesDestroyed || 0),
    powerUpsCollected: currentStats.powerUpsCollected + (statsUpdate.powerUpsCollected || 0),
    gamesPlayed: currentStats.gamesPlayed + (statsUpdate.gamesPlayed || 0),
    totalPlayTime: currentStats.totalPlayTime + (statsUpdate.totalPlayTime || 0),
  }

  // Save updated stats
  savePlayerStats(address, updatedStats)

  // Check for new achievements
  const newAchievements: Achievement[] = []

  allAchievements.forEach((achievement) => {
    // Skip if already completed
    const existingAchievement = playerAchievements.find((pa) => pa.id === achievement.id)
    if (existingAchievement && existingAchievement.completed) return

    // Calculate progress based on category
    let progress = 0
    let completed = false

    switch (achievement.category) {
      case "monsters":
        progress = updatedStats.monstersDefeated
        completed = progress >= achievement.requirement
        break
      case "bosses":
        if (achievement.id === "bosses_all") {
          // Special case for defeating all boss types
          // This would need actual tracking of which boss types were defeated
          progress = Math.min(updatedStats.bossesDefeated, achievement.requirement)
          completed = progress >= achievement.requirement
        } else {
          progress = updatedStats.bossesDefeated
          completed = progress >= achievement.requirement
        }
        break
      case "score":
        progress = updatedStats.highScore
        completed = progress >= achievement.requirement
        break
      case "special":
        if (achievement.id === "combo_10") {
          progress = updatedStats.comboMax
          completed = progress >= achievement.requirement
        } else if (achievement.id === "special_all") {
          // Special case for using all abilities
          // This would need actual tracking of which abilities were used
          progress = Math.min(updatedStats.specialAbilitiesUsed, achievement.requirement)
          completed = progress >= achievement.requirement
        } else if (achievement.id === "secret_survive") {
          progress = updatedStats.totalPlayTime
          completed = progress >= achievement.requirement
        }
        break
    }

    // Update achievement
    if (existingAchievement) {
      existingAchievement.progress = progress
      if (!existingAchievement.completed && completed) {
        existingAchievement.completed = true
        existingAchievement.completedDate = Date.now()
        newAchievements.push(achievement)
      }
    } else {
      const newPlayerAchievement: PlayerAchievement = {
        id: achievement.id,
        progress,
        completed,
        completedDate: completed ? Date.now() : undefined,
      }
      playerAchievements.push(newPlayerAchievement)

      if (completed) {
        newAchievements.push(achievement)
      }
    }
  })

  // Save updated achievements
  savePlayerAchievements(address, playerAchievements)

  return { newAchievements }
}

interface AchievementsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Achievements({ open, onOpenChange }: AchievementsProps) {
  const { address } = useWallet()
  const { locale } = useI18n()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [activeCategory, setActiveCategory] = useState<"all" | "monsters" | "bosses" | "score" | "special">("all")

  // Load achievements data
  useEffect(() => {
    if (open) {
      const allAchievements = getAchievements()
      setAchievements(allAchievements)

      if (address) {
        const playerAchievs = getPlayerAchievements(address)
        setPlayerAchievements(playerAchievs)

        const stats = getPlayerStats(address)
        setPlayerStats(stats)
      } else {
        setPlayerAchievements([])
        setPlayerStats(null)
      }
    }
  }, [open, address])

  // Get achievement progress
  const getAchievementProgress = (achievementId: string): { progress: number; completed: boolean; date?: number } => {
    const playerAchievement = playerAchievements.find((pa) => pa.id === achievementId)

    if (!playerAchievement) {
      return { progress: 0, completed: false }
    }

    return {
      progress: playerAchievement.progress,
      completed: playerAchievement.completed,
      date: playerAchievement.completedDate,
    }
  }

  // Format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get icon component
  const getIconComponent = (iconType: string, className = "w-5 h-5") => {
    switch (iconType) {
      case "monster":
        return <Skull className={className} />
      case "boss":
        return <Trophy className={className} />
      case "score":
        return <Target className={className} />
      case "special":
        return <Zap className={className} />
      default:
        return <Star className={className} />
    }
  }

  // Filter achievements by category
  const filteredAchievements = achievements.filter(
    (achievement) => activeCategory === "all" || achievement.category === activeCategory,
  )

  // Localized texts
  const texts = {
    title: locale === "ru" ? "Достижения" : "Achievements",
    all: locale === "ru" ? "Все" : "All",
    monsters: locale === "ru" ? "Монстры" : "Monsters",
    bosses: locale === "ru" ? "Боссы" : "Bosses",
    score: locale === "ru" ? "Очки" : "Score",
    special: locale === "ru" ? "Особые" : "Special",
    progress: locale === "ru" ? "Прогресс" : "Progress",
    reward: locale === "ru" ? "Награда" : "Reward",
    completed: locale === "ru" ? "Выполнено" : "Completed",
    locked: locale === "ru" ? "Заблокировано" : "Locked",
    secret: locale === "ru" ? "Секретное достижение" : "Secret Achievement",
    close: locale === "ru" ? "Закрыть" : "Close",
    connectWallet:
      locale === "ru" ? "Подключите кошелек для отслеживания достижений" : "Connect wallet to track achievements",
    statsTitle: locale === "ru" ? "Статистика игрока" : "Player Stats",
    monstersDefeated: locale === "ru" ? "Уничтожено монстров" : "Monsters Defeated",
    bossesDefeated: locale === "ru" ? "Уничтожено боссов" : "Bosses Defeated",
    highScore: locale === "ru" ? "Рекорд" : "High Score",
    specialAbilitiesUsed: locale === "ru" ? "Использовано способностей" : "Special Abilities Used",
    comboMax: locale === "ru" ? "Макс. комбо" : "Max Combo",
    projectilesDestroyed: locale === "ru" ? "Уничтожено снарядов" : "Projectiles Destroyed",
    powerUpsCollected: locale === "ru" ? "Собрано бонусов" : "Power-Ups Collected",
    gamesPlayed: locale === "ru" ? "Игр сыграно" : "Games Played",
    totalPlayTime: locale === "ru" ? "Общее время игры" : "Total Play Time",
    seconds: locale === "ru" ? "сек." : "sec.",
    minutes: locale === "ru" ? "мин." : "min.",
    noAchievements: locale === "ru" ? "Нет достижений в этой категории" : "No achievements in this category",
  }

  // Format time
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} ${texts.seconds}`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} ${texts.minutes} ${remainingSeconds} ${texts.seconds}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border border-purple-500/50 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Medal className="w-6 h-6 text-yellow-400" />
            {texts.title}
          </DialogTitle>
        </DialogHeader>

        {/* Wallet not connected message */}
        {!address && (
          <div className="mb-6 bg-red-900/30 p-4 rounded-lg border border-red-500/50">
            <p className="text-center text-red-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {texts.connectWallet}
            </p>
          </div>
        )}

        {/* Player stats */}
        {address && playerStats && (
          <div className="mb-6 bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">{texts.statsTitle}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.monstersDefeated}</div>
                <div className="text-xl font-bold">{playerStats.monstersDefeated}</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.bossesDefeated}</div>
                <div className="text-xl font-bold">{playerStats.bossesDefeated}</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.highScore}</div>
                <div className="text-xl font-bold">{playerStats.highScore}</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.comboMax}</div>
                <div className="text-xl font-bold">{playerStats.comboMax}x</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.specialAbilitiesUsed}</div>
                <div className="text-xl font-bold">{playerStats.specialAbilitiesUsed}</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.projectilesDestroyed}</div>
                <div className="text-xl font-bold">{playerStats.projectilesDestroyed}</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.powerUpsCollected}</div>
                <div className="text-xl font-bold">{playerStats.powerUpsCollected}</div>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <div className="text-gray-400 text-xs">{texts.gamesPlayed}</div>
                <div className="text-xl font-bold">{playerStats.gamesPlayed}</div>
              </div>
              <div className="bg-black/30 p-2 rounded col-span-2 md:col-span-4">
                <div className="text-gray-400 text-xs">{texts.totalPlayTime}</div>
                <div className="text-xl font-bold">{formatTime(playerStats.totalPlayTime)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all" ? "bg-purple-600" : "border-purple-500/50 text-gray-300"}
          >
            {texts.all}
          </Button>
          <Button
            variant={activeCategory === "monsters" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("monsters")}
            className={activeCategory === "monsters" ? "bg-purple-600" : "border-purple-500/50 text-gray-300"}
          >
            <Skull className="w-4 h-4 mr-1" />
            {texts.monsters}
          </Button>
          <Button
            variant={activeCategory === "bosses" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("bosses")}
            className={activeCategory === "bosses" ? "bg-purple-600" : "border-purple-500/50 text-gray-300"}
          >
            <Trophy className="w-4 h-4 mr-1" />
            {texts.bosses}
          </Button>
          <Button
            variant={activeCategory === "score" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("score")}
            className={activeCategory === "score" ? "bg-purple-600" : "border-purple-500/50 text-gray-300"}
          >
            <Target className="w-4 h-4 mr-1" />
            {texts.score}
          </Button>
          <Button
            variant={activeCategory === "special" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("special")}
            className={activeCategory === "special" ? "bg-purple-600" : "border-purple-500/50 text-gray-300"}
          >
            <Zap className="w-4 h-4 mr-1" />
            {texts.special}
          </Button>
        </div>

        {/* Achievements list */}
        <div className="space-y-4">
          {filteredAchievements.length === 0 ? (
            <div className="text-center text-gray-400 py-8">{texts.noAchievements}</div>
          ) : (
            filteredAchievements.map((achievement) => {
              const { progress, completed, date } = getAchievementProgress(achievement.id)
              const isSecret = achievement.secret && !completed && !address

              return (
                <div
                  key={achievement.id}
                  className={`
                    border rounded-lg p-4 transition-all
                    ${
                      completed
                        ? "bg-green-900/20 border-green-500/50"
                        : "bg-black/30 border-purple-500/30 hover:border-purple-500/50"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      flex items-center justify-center w-12 h-12 rounded-full
                      ${completed ? "bg-green-500/20 text-green-400" : "bg-purple-900/30 text-purple-400"}
                    `}
                    >
                      {completed ? (
                        <Check className="w-6 h-6" />
                      ) : isSecret ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        getIconComponent(achievement.icon, "w-6 h-6")
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {isSecret ? texts.secret : achievement.name}
                        {completed && (
                          <span className="text-xs text-green-400 font-normal">
                            {texts.completed} {date ? `(${formatDate(date)})` : ""}
                          </span>
                        )}
                      </h3>

                      <p className="text-gray-300 text-sm mb-2">{isSecret ? "???" : achievement.description}</p>

                      {!isSecret && (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-xs text-gray-400">{texts.progress}:</div>
                            <div className="flex-1">
                              <Progress
                                value={(progress / achievement.requirement) * 100}
                                className="h-2 bg-gray-700"
                                indicatorClassName={completed ? "bg-green-500" : "bg-purple-500"}
                              />
                            </div>
                            <div className="text-xs font-medium">
                              {progress}/{achievement.requirement}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-400">{texts.reward}:</div>
                            <div className="text-xs text-yellow-400">{achievement.reward}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            {texts.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trophy, User, X, Check, AlertCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-connect"
import { useI18n } from "@/lib/i18n-context"

// Define the leaderboard entry type
export interface LeaderboardEntry {
  address: string
  name: string
  score: number
  date: number
}

// Mock API functions (replace with actual API calls in production)
const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const storedData = localStorage.getItem("gameLeaderboard")
    return storedData ? JSON.parse(storedData) : []
  } catch (error) {
    console.error("Error loading leaderboard:", error)
    return []
  }
}

const saveLeaderboard = (leaderboard: LeaderboardEntry[]) => {
  try {
    localStorage.setItem("gameLeaderboard", JSON.stringify(leaderboard))
    return true
  } catch (error) {
    console.error("Error saving leaderboard:", error)
    return false
  }
}

const getUserScore = (address: string): LeaderboardEntry | undefined => {
  const leaderboard = getLeaderboard()
  return leaderboard.find((entry) => entry.address.toLowerCase() === address.toLowerCase())
}

const addOrUpdateScore = (entry: LeaderboardEntry): boolean => {
  try {
    const leaderboard = getLeaderboard()
    const existingEntryIndex = leaderboard.findIndex((e) => e.address.toLowerCase() === entry.address.toLowerCase())

    if (existingEntryIndex >= 0) {
      // Only update if new score is higher
      if (entry.score > leaderboard[existingEntryIndex].score) {
        leaderboard[existingEntryIndex] = entry
      } else {
        return false // No update needed
      }
    } else {
      leaderboard.push(entry)
    }

    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score)

    // Save updated leaderboard
    return saveLeaderboard(leaderboard)
  } catch (error) {
    console.error("Error updating leaderboard:", error)
    return false
  }
}

const isNameTaken = (name: string, currentAddress: string): boolean => {
  const leaderboard = getLeaderboard()
  return leaderboard.some(
    (entry) =>
      entry.name.toLowerCase() === name.toLowerCase() && entry.address.toLowerCase() !== currentAddress.toLowerCase(),
  )
}

interface LeaderboardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentScore?: number
  onSaveScore?: (success: boolean) => void
}

export function Leaderboard({ open, onOpenChange, currentScore, onSaveScore }: LeaderboardProps) {
  const { address } = useWallet()
  const { locale } = useI18n()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)
  const [showNameInput, setShowNameInput] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)

  // Load leaderboard data
  useEffect(() => {
    if (open) {
      const data = getLeaderboard()
      setLeaderboard(data)

      // If user has a wallet connected and there's a current score
      if (address && currentScore) {
        const userEntry = getUserScore(address)
        if (userEntry) {
          setPlayerName(userEntry.name)
        }
        setShowNameInput(true)
      }
    }
  }, [open, address, currentScore])

  // Handle name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setPlayerName(name)

    // Validate name
    if (name.trim().length < 3) {
      setNameError(locale === "ru" ? "Имя должно содержать минимум 3 символа" : "Name must be at least 3 characters")
    } else if (name.trim().length > 15) {
      setNameError(locale === "ru" ? "Имя должно быть не более 15 символов" : "Name must be at most 15 characters")
    } else if (isNameTaken(name, address || "")) {
      setNameError(locale === "ru" ? "Это имя уже занято" : "This name is already taken")
    } else {
      setNameError(null)
    }
  }

  // Save score to leaderboard
  const saveScore = () => {
    if (!address || !currentScore || nameError || playerName.trim().length < 3) return

    setIsSaving(true)

    const entry: LeaderboardEntry = {
      address,
      name: playerName.trim(),
      score: currentScore,
      date: Date.now(),
    }

    const success = addOrUpdateScore(entry)
    setSavedSuccessfully(success)

    if (success) {
      // Refresh leaderboard
      setLeaderboard(getLeaderboard())
    }

    setIsSaving(false)

    // Notify parent component
    if (onSaveScore) {
      onSaveScore(success)
    }
  }

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const dateLocale = locale === "ru" ? "ru-RU" : "en-US"
    return date.toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Localized texts
  const texts = {
    title: locale === "ru" ? "Таблица лидеров" : "Leaderboard",
    rank: locale === "ru" ? "Ранг" : "Rank",
    player: locale === "ru" ? "Игрок" : "Player",
    score: locale === "ru" ? "Очки" : "Score",
    date: locale === "ru" ? "Дата" : "Date",
    yourScore: locale === "ru" ? "Ваш результат" : "Your Score",
    enterName: locale === "ru" ? "Введите ваше имя" : "Enter your name",
    save: locale === "ru" ? "Сохранить" : "Save",
    saving: locale === "ru" ? "Сохранение..." : "Saving...",
    saved: locale === "ru" ? "Сохранено!" : "Saved!",
    close: locale === "ru" ? "Закрыть" : "Close",
    connectWallet:
      locale === "ru" ? "Подключите кошелек для сохранения результата" : "Connect wallet to save your score",
    noEntries: locale === "ru" ? "В таблице лидеров пока нет записей" : "No entries in the leaderboard yet",
    you: locale === "ru" ? "Вы" : "You",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border border-purple-500/50 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-400" />
            {texts.title}
          </DialogTitle>
        </DialogHeader>

        {/* Current score input (if wallet connected) */}
        {address && currentScore && showNameInput && (
          <div className="mb-6 bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              {texts.yourScore}: <span className="text-yellow-400">{currentScore}</span>
            </h3>

            <div className="space-y-2">
              <div className="flex flex-col space-y-1">
                <label htmlFor="playerName" className="text-sm text-gray-300">
                  {texts.enterName}:
                </label>
                <div className="flex gap-2">
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={handleNameChange}
                    className="bg-black/50 border-purple-500/50 text-white"
                    placeholder={texts.enterName}
                    disabled={isSaving || savedSuccessfully}
                  />
                  <Button
                    onClick={saveScore}
                    disabled={!!nameError || playerName.trim().length < 3 || isSaving || savedSuccessfully}
                    className={savedSuccessfully ? "bg-green-600" : "bg-purple-600 hover:bg-purple-700"}
                  >
                    {savedSuccessfully ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : isSaving ? (
                      <span className="animate-pulse">{texts.saving}</span>
                    ) : (
                      texts.save
                    )}
                  </Button>
                </div>
                {nameError && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {nameError}
                  </p>
                )}
                {savedSuccessfully && (
                  <p className="text-green-400 text-xs flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" />
                    {texts.saved}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wallet not connected message */}
        {!address && currentScore && (
          <div className="mb-6 bg-red-900/30 p-4 rounded-lg border border-red-500/50">
            <p className="text-center text-red-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {texts.connectWallet}
            </p>
          </div>
        )}

        {/* Leaderboard table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-900/50 text-left">
                <th className="p-2 border-b border-purple-500/50">{texts.rank}</th>
                <th className="p-2 border-b border-purple-500/50">{texts.player}</th>
                <th className="p-2 border-b border-purple-500/50 text-right">{texts.score}</th>
                <th className="p-2 border-b border-purple-500/50 text-right">{texts.date}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">
                    {texts.noEntries}
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => {
                  const isCurrentUser = address && entry.address.toLowerCase() === address.toLowerCase()
                  return (
                    <tr
                      key={index}
                      className={`
                        ${index % 2 === 0 ? "bg-black/30" : "bg-black/60"} 
                        ${isCurrentUser ? "bg-purple-900/30 border-l-2 border-purple-500" : ""}
                        hover:bg-purple-900/20 transition-colors
                      `}
                    >
                      <td className="p-2 border-b border-purple-500/20">
                        {index < 3 ? (
                          <span
                            className={`
                            inline-flex items-center justify-center w-6 h-6 rounded-full 
                            ${
                              index === 0
                                ? "bg-yellow-500/20 text-yellow-300"
                                : index === 1
                                  ? "bg-gray-400/20 text-gray-300"
                                  : "bg-amber-700/20 text-amber-600"
                            }
                          `}
                          >
                            {index + 1}
                          </span>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="p-2 border-b border-purple-500/20 font-medium">
                        {entry.name} {isCurrentUser && <span className="text-xs text-purple-400">({texts.you})</span>}
                      </td>
                      <td className="p-2 border-b border-purple-500/20 text-right font-bold">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="p-2 border-b border-purple-500/20 text-right text-gray-400 text-sm">
                        {formatDate(new Date(entry.date))}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
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

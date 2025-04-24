// leaderboard.tsx

interface LeaderboardEntry {
  name: string
  score: number
}

const LEADERBOARD_KEY = "leaderboard"

const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const leaderboardString = localStorage.getItem(LEADERBOARD_KEY)
    if (leaderboardString) {
      return JSON.parse(leaderboardString) as LeaderboardEntry[]
    }
    return []
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    return []
  }
}

const saveLeaderboard = (leaderboard: LeaderboardEntry[]): boolean => {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard))
    return true
  } catch (error) {
    console.error("Error saving leaderboard:", error)
    return false
  }
}

const addOrUpdateScore = (entry: LeaderboardEntry): boolean => {
  try {
    // Используем блокировку или другой механизм синхронизации
    const lockKey = "leaderboard_lock"
    if (localStorage.getItem(lockKey)) {
      // Если блокировка активна, подождем и попробуем снова
      setTimeout(() => addOrUpdateScore(entry), 100)
      return false
    }

    // Устанавливаем блокировку
    localStorage.setItem(lockKey, "locked")

    try {
      const leaderboard = getLeaderboard()
      const existingEntryIndex = leaderboard.findIndex((e) => e.name === entry.name)

      if (existingEntryIndex !== -1) {
        if (entry.score > leaderboard[existingEntryIndex].score) {
          leaderboard[existingEntryIndex].score = entry.score
        }
      } else {
        leaderboard.push(entry)
      }

      leaderboard.sort((a, b) => b.score - a.score)

      const result = saveLeaderboard(leaderboard)
      return result
    } finally {
      // Снимаем блокировку в любом случае
      localStorage.removeItem(lockKey)
    }
  } catch (error) {
    console.error("Error updating leaderboard:", error)
    return false
  }
}

const clearLeaderboard = (): boolean => {
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
    return true
  } catch (error) {
    console.error("Error clearing leaderboard:", error)
    return false
  }
}

export { type LeaderboardEntry, getLeaderboard, saveLeaderboard, addOrUpdateScore, clearLeaderboard }

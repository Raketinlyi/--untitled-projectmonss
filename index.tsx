"use client"

import { useEffect, useRef, useState } from "react"
import { Game } from "./game"
import { Button } from "@/components/ui/button"
import { Heart, Trophy, RotateCcw, Volume2, VolumeX } from "lucide-react"

export default function EmojiDefender() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState(0)
  const [muted, setMuted] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [energy, setEnergy] = useState(0)
  const [maxEnergy, setMaxEnergy] = useState(100)

  // Initialize the game
  useEffect(() => {
    if (!canvasRef.current) return

    // Create game instance
    const newGame = new Game(canvasRef.current)
    setGame(newGame)

    // Set up event listeners for game state changes
    newGame.onScoreChange = (newScore) => setScore(newScore)
    newGame.onLivesChange = (newLives) => setLives(newLives)
    newGame.onGameOver = () => {
      setGameOver(true)
      setGameStarted(false)

      // Update high score if needed
      if (newGame.score > highScore) {
        setHighScore(newGame.score)
        localStorage.setItem("emojiDefenderHighScore", newGame.score.toString())
      }
    }

    game.onComboChange = (combo: number, multiplier: number) => {
      setComboCount(combo)
      setComboMultiplier(multiplier)
    }

    game.onEnergyChange = (currentEnergy: number, maxEnergyValue: number) => {
      setEnergy(currentEnergy)
      setMaxEnergy(maxEnergyValue)
    }

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("emojiDefenderHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    // Clean up
    return () => {
      newGame.destroy()
    }
  }, [highScore])

  // Handle start game
  const handleStartGame = () => {
    if (!game) return

    game.start()
    setGameStarted(true)
    setGameOver(false)
  }

  // Handle restart game
  const handleRestartGame = () => {
    if (!game) return

    game.restart()
    setGameStarted(true)
    setGameOver(false)
  }

  // Handle toggle mute
  const handleToggleMute = () => {
    if (!game) return

    const newMuted = game.toggleMute()
    setMuted(newMuted)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-950 p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Emoji Defender</h1>

      {/* Game UI */}
      <div className="relative w-full max-w-md">
        {/* Game stats */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="text-white font-bold">{score}</span>
          </div>
          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
            {[...Array(lives)].map((_, i) => (
              <Heart key={i} className="w-5 h-5 text-red-500 mx-0.5" fill="#ef4444" />
            ))}
            {[...Array(3 - lives)].map((_, i) => (
              <Heart key={i + lives} className="w-5 h-5 text-gray-500 mx-0.5" />
            ))}
          </div>

          {/* Mute button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleMute}
            className="bg-black/30 text-white hover:bg-black/50"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        {/* Canvas container */}
        <div className="relative bg-indigo-900/50 rounded-lg overflow-hidden border-2 border-indigo-700">
          <canvas ref={canvasRef} className="w-full touch-none" style={{ aspectRatio: "3/4" }} />

          {/* Overlay for game states */}
          {!gameStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              {gameOver ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
                  <p className="text-yellow-400 text-lg mb-1">Score: {score}</p>
                  <p className="text-green-400 text-sm mb-4">High Score: {highScore}</p>
                  <Button onClick={handleRestartGame} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Ready to Play?</h2>
                  <p className="text-gray-300 text-sm mb-6 max-w-xs">
                    Tap the enemies before they launch poop emoji projectiles!
                  </p>
                  <Button onClick={handleStartGame} className="bg-green-600 hover:bg-green-700 text-white">
                    Start Game
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Game instructions */}
        <div className="mt-4 bg-black/30 p-3 rounded-lg text-white text-sm">
          <h3 className="font-bold mb-1">How to Play:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Tap/click enemies before they launch projectiles</li>
            <li>Avoid letting projectiles reach the bottom</li>
            <li>Boss enemies appear every 30 seconds</li>
            <li>You have 3 lives - good luck!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

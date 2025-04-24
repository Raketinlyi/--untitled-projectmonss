"use client"

import { memo, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Coins, Star, Zap, Trophy, AlertCircle } from "lucide-react"
import { triggerConfetti } from "../utils/game-utils"
import { Progress } from "@/components/ui/progress"
import { RARITIES } from "../data/rarities"
import { useWallet } from "@/lib/wallet-connect"

interface GameOverProps {
  score: number
  highScore: number
  earnedCoins: number
  gameOverReason: string
  selectedRarity: string | null
  monstersDefeated: number
  bossesDefeated: number
  powerUpsCollected: number
  longestCombo: number
  playerLevel: number
  experiencePoints: number
  experienceToNextLevel: number
  onPlayAgain: () => void
  onChangeRarity: () => void
  onExit: () => void
}

const GameOver = memo(
  ({
    score,
    highScore,
    earnedCoins,
    gameOverReason,
    selectedRarity,
    monstersDefeated,
    bossesDefeated,
    powerUpsCollected,
    longestCombo,
    playerLevel,
    experiencePoints,
    experienceToNextLevel,
    onPlayAgain,
    onChangeRarity,
    onExit,
  }: GameOverProps) => {
    const [isConnecting, setIsConnecting] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [locale, setLocale] = useState<string>("en") // Default to English

    useEffect(() => {
      // Determine the user's locale (example using browser language)
      const browserLocale = navigator.language || navigator.languages[0] || "en"
      setLocale(browserLocale.split("-")[0]) // Use only the language code (e.g., "en", "es")
    }, [])

    // Trigger confetti for new high score
    useEffect(() => {
      if (score >= highScore && score > 0) {
        triggerConfetti()

        // For really high scores, trigger multiple confetti bursts
        if (score > 1000) {
          setTimeout(() => triggerConfetti({ y: 0.3, x: 0.3 }), 300)
          setTimeout(() => triggerConfetti({ y: 0.3, x: 0.7 }), 600)
        }
      }
    }, [score, highScore])

    const rarityColor = selectedRarity ? RARITIES[selectedRarity as keyof typeof RARITIES].color : "bg-gray-500"
    const rarityBorderGlow = selectedRarity
      ? RARITIES[selectedRarity as keyof typeof RARITIES].borderGlow
      : "shadow-gray-500/50"

    // Calculate rank based on score
    const getRank = () => {
      if (score >= 2000) return { name: "Legendary Hunter", color: "text-orange-500" }
      if (score >= 1500) return { name: "Master Hunter", color: "text-purple-500" }
      if (score >= 1000) return { name: "Expert Hunter", color: "text-blue-500" }
      if (score >= 500) return { name: "Skilled Hunter", color: "text-green-500" }
      if (score >= 200) return { name: "Novice Hunter", color: "text-yellow-500" }
      return { name: "Beginner", color: "text-gray-400" }
    }

    const rank = getRank()

    // Get wallet connection state
    const { address, connectWallet } = useWallet()
    const isWalletConnected = !!address

    // Handle wallet connection with proper error handling
    const handleConnectWallet = async () => {
      if (isConnecting) return

      setIsConnecting(true)
      setConnectionError(null)

      try {
        const result = await connectWallet()

        // Don't show error if user rejected the request
        if (result.userRejected) {
          console.log("User rejected wallet connection - this is normal")
        } else if (!result.success) {
          setConnectionError(result.error || "Failed to connect wallet")
        }
      } catch (error) {
        console.error("Error connecting wallet:", error)
        setConnectionError("Unexpected error connecting wallet")
      } finally {
        setIsConnecting(false)
      }
    }

    return (
      <div className="p-2 md:p-4">
        <div className="bg-black/30 rounded-xl p-3 md:p-4 mb-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>

          {gameOverReason && <p className="text-red-300 mb-4">{gameOverReason}</p>}

          <div className="mb-6">
            <div className={`inline-block ${rank.color} text-xl font-bold border-b-2 border-current px-4 py-1 mb-2`}>
              {rank.name}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-purple-900/50 p-4 rounded-lg">
              <div className="text-gray-300 text-sm">Your Score</div>
              <div className="text-3xl font-bold text-white">{score}</div>
            </div>

            <div className="bg-purple-900/50 p-4 rounded-lg">
              <div className="text-gray-300 text-sm">High Score</div>
              <div className="text-3xl font-bold text-white">{highScore}</div>
            </div>
          </div>

          {/* Player stats section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black/20 p-4 rounded-lg text-left">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Game Stats
              </h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="text-gray-300">Monsters Defeated:</div>
                <div className="text-white font-bold text-right">{monstersDefeated}</div>

                <div className="text-gray-300">Bosses Defeated:</div>
                <div className="text-white font-bold text-right">{bossesDefeated}</div>

                <div className="text-gray-300">Power-ups Collected:</div>
                <div className="text-white font-bold text-right">{powerUpsCollected}</div>

                <div className="text-gray-300">Longest Combo:</div>
                <div className="text-white font-bold text-right">x{longestCombo}</div>

                <div className="text-gray-300">Monster Rarity:</div>
                <div className={`font-bold text-right ${rarityColor.replace("bg-", "text-")}`}>{selectedRarity}</div>
              </div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg text-left">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-purple-500" />
                Player Progress
              </h4>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-gray-300">Level {playerLevel}</div>
                  <div className="text-white text-sm">
                    {experiencePoints}/{experienceToNextLevel} XP
                  </div>
                </div>
                <Progress
                  value={(experiencePoints / experienceToNextLevel) * 100}
                  className="h-2 bg-gray-700"
                  indicatorClassName="bg-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="text-gray-300">Current Level:</div>
                <div className="text-white font-bold text-right">{playerLevel}</div>

                <div className="text-gray-300">XP to Next Level:</div>
                <div className="text-white font-bold text-right">{experienceToNextLevel - experiencePoints}</div>

                <div className="text-gray-300">Total Games:</div>
                <div className="text-white font-bold text-right">{Math.floor(playerLevel / 2) + 1}</div>
              </div>
            </div>
          </div>

          {/* Coins earned section */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-700/20 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-bold text-yellow-300 flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5" />
              Coins Earned
            </h4>
            <div className="text-4xl font-bold text-yellow-300">{earnedCoins} MOMON</div>
            <p className="text-yellow-200/70 text-sm mt-1">Added to your wallet balance</p>
          </div>

          {!isWalletConnected && (
            <div className="bg-red-500/20 border-2 border-red-500/50 p-4 rounded-lg mb-6 animate-pulse">
              <h4 className="text-lg font-bold text-red-300 flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                {locale === "ru"
                  ? "Кошелек не подключен!"
                  : locale === "es"
                    ? "¡Billetera no conectada!"
                    : locale === "fr"
                      ? "Portefeuille non connecté !"
                      : locale === "de"
                        ? "Wallet nicht verbunden!"
                        : locale === "it"
                          ? "Portafoglio non connesso!"
                          : locale === "zh"
                            ? "钱包未连接！"
                            : locale === "uk"
                              ? "Гаманець не підключено!"
                              : locale === "ar"
                                ? "المحفظة غير متصلة!"
                                : locale === "hi"
                                  ? "वॉलेट कनेक्ट नहीं है!"
                                  : "Wallet not connected!"}
              </h4>
              <p className="text-red-200 mb-3">
                {locale === "ru"
                  ? "Вы играли в демо-режиме. Подключите кошелек, чтобы сохранить свои награды и играть с вашими NFT!"
                  : locale === "es"
                    ? "Jugaste en modo demo. ¡Conecta tu billetera para guardar tus recompensas y jugar con tus NFT!"
                    : locale === "fr"
                      ? "Vous avez joué en mode démo. Connectez votre portefeuille pour sauvegarder vos récompenses et jouer avec vos NFT !"
                      : locale === "de"
                        ? "Du hast im Demo-Modus gespielt. Verbinde dein Wallet, um deine Belohnungen zu speichern und mit deinen NFTs zu spielen!"
                        : locale === "it"
                          ? "Hai giocato in modalità demo. Connetti il tuo portafoglio per salvare i tuoi premi e giocare con i tuoi NFT!"
                          : locale === "zh"
                            ? "您在演示模式下玩游戏。连接您的钱包以保存您的奖励并使用您的NFT玩游戏！"
                            : locale === "uk"
                              ? "Ви грали в демо-режимі. Підключіть гаманець, щоб зберегти свої нагороди та грати з вашими NFT!"
                              : locale === "ar"
                                ? "لقد لعبت في وضع العرض التوضيحي. قم بتوصيل محفظتك لحفظ مكافآتك واللعب بالرموز غير القابلة للاستبدال الخاصة بك!"
                                : locale === "hi"
                                  ? "आपने डेमो मोड में खेला। अपने पुरस्कार सहेजने और अपने NFT के साथ खेलने के लिए अपना वॉलेट कनेक्ट करें!"
                                  : "You played in demo mode. Connect your wallet to save your rewards and play with your NFTs!"}
              </p>

              {/* Updated button with better error handling */}
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                {isConnecting ? "Подключение..." : "Подключить кошелек"}
              </Button>

              {connectionError && <p className="mt-2 text-sm text-red-400">{connectionError}</p>}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-2">
            <Button
              onClick={onPlayAgain}
              className={`${rarityColor} hover:opacity-90 relative overflow-hidden group py-3 px-4 text-base`}
            >
              <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Play Again with {selectedRarity}
              </span>
            </Button>

            <Button
              onClick={onChangeRarity}
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/20 py-3 px-4 text-base"
            >
              <Star className="w-4 h-4 mr-2" />
              Change Rarity
            </Button>

            <Button
              onClick={onExit}
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-700 py-3 px-4 text-base"
            >
              Exit Game
            </Button>
          </div>
        </div>
      </div>
    )
  },
)

GameOver.displayName = "GameOver"

export default GameOver

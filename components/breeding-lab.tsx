"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/lib/wallet-connect"
import { useI18n } from "@/lib/i18n-context"
import { Badge } from "@/components/ui/badge"

// Define types for monsters and offspring
interface Monster {
  id: string
  name: string
  image: string
  rarity: string
}

export function BreedingLab() {
  const { translations, locale } = useI18n()
  const [parent1, setParent1] = useState<string>("")
  const [parent2, setParent2] = useState<string>("")
  const [isBreeding, setIsBreeding] = useState<boolean>(false)
  const [offspring, setOffspring] = useState<Monster | null>(null)
  const [breedingError, setBreedingError] = useState<string | null>(null)
  const { address, connectWallet, ownedNFTs } = useWallet()

  // Default translation values
  const demoMode = translations.breeding?.demoMode || "Demo Mode"
  const connectWalletText =
    translations.breeding?.connectWallet || "Connect your wallet to breed with your own MonadMonsters monsters."
  const parentText = translations.breeding?.parent || "Parent"

  // Дополнительные локализованные тексты
  const texts = {
    breedMonsters: locale === "ru" ? "Разводить монстров" : "Breed Monsters",
    breeding: locale === "ru" ? "Разведение..." : "Breeding...",
    needTwoNFTs: locale === "ru" ? "Вам нужно как минимум 2 NFT для разведения" : "You need at least 2 NFTs to breed",
    newMonsterCreated: locale === "ru" ? "Создан новый монстр!" : "New monster created!",
    selectTwoMonsters:
      locale === "ru" ? "Пожалуйста, выберите двух монстров для разведения" : "Please select two monsters to breed",
    cannotBreedSame:
      locale === "ru"
        ? "Нельзя разводить одного и того же монстра с самим собой"
        : "Cannot breed the same monster with itself",
    breedingError:
      locale === "ru"
        ? "Произошла ошибка при разведении. Пожалуйста, попробуйте снова."
        : "An error occurred during breeding. Please try again.",
    connectWallet: locale === "ru" ? "Подключить кошелек" : "Connect Wallet",
  }

  // Monster data
  const allMonsters: Monster[] = [
    {
      id: "1",
      name: "Greeny",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
      rarity: "Common",
    },
    {
      id: "2",
      name: "Aqua",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
      rarity: "Uncommon",
    },
    {
      id: "3",
      name: "Purply",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68d56a43-41e6-4efd-bc1a-92a8d6985612-QoXIJH3cGbNcKhVk6V9E8UnuJAkG5S.png",
      rarity: "Rare",
    },
    {
      id: "4",
      name: "Pinky",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68522fbc-f35b-4416-8ac3-d0e783ba5714-elFuXplIykv79gn5XXNdxcqHFfGhOY.png",
      rarity: "Uncommon",
    },
    {
      id: "5",
      name: "Chompy",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e63a0f33-b60a-4366-832d-f6e3442b9ad9-LCRlrOfUwlaT2IYxlRQE313572hMya.png",
      rarity: "Rare",
    },
  ]

  // Function to get monster by ID
  const getMonsterById = (id: string): Monster | undefined => allMonsters.find((m) => m.id === id)

  // Update selected monsters when wallet connects
  useEffect(() => {
    if (address && ownedNFTs && ownedNFTs.length >= 2) {
      // Select the first two owned NFTs
      setParent1(ownedNFTs[0])
      setParent2(ownedNFTs[1])
    } else {
      // Reset for demo mode
      setParent1("1")
      setParent2("2")
    }
  }, [address, ownedNFTs])

  // Fix the breeding function to handle errors better
  const handleBreed = () => {
    // Reset any previous errors
    setBreedingError(null)

    if (!parent1 || !parent2) {
      setBreedingError(texts.selectTwoMonsters)
      return
    }

    if (parent1 === parent2) {
      setBreedingError(texts.cannotBreedSame)
      return
    }

    setIsBreeding(true)
    setOffspring(null)

    // Simulate breeding process with timeout
    setTimeout(() => {
      try {
        // For demo purposes, create a hybrid offspring
        const parent1Monster = getMonsterById(parent1)
        const parent2Monster = getMonsterById(parent2)

        if (parent1Monster && parent2Monster) {
          // Pick a random monster as base for offspring
          const randomIndex = Math.floor(Math.random() * allMonsters.length)
          const randomName = `Baby ${parent1Monster.name}-${parent2Monster.name}`

          setOffspring({
            ...allMonsters[randomIndex],
            name: randomName,
          })
        } else {
          // Handle case where monsters aren't found
          throw new Error("Could not find parent monsters")
        }
      } catch (error) {
        console.error("Breeding error:", error)
        setBreedingError(texts.breedingError)
      } finally {
        setIsBreeding(false)
      }
    }, 3000)
  }

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-green-500"
      case "Uncommon":
        return "bg-blue-500"
      case "Rare":
        return "bg-purple-500"
      case "Epic":
        return "bg-orange-500"
      case "Legendary":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Check if user has enough monsters to breed
  const hasEnoughMonsters = address && ownedNFTs && ownedNFTs.length >= 2
  const isWalletConnected = !!address

  // Get monsters to display
  const parent1Monster = getMonsterById(parent1)
  const parent2Monster = getMonsterById(parent2)

  return (
    <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-br from-purple-900/40 to-pink-600/40 border border-white/10 shadow-2xl p-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Image
          src="/images/momon-logo.png"
          alt="Momon Logo"
          width={80}
          height={80}
          className="object-contain animate-float"
        />
      </div>
      {/* Demo mode indicator */}
      {!isWalletConnected && (
        <div className="absolute -top-6 left-0 right-0 flex justify-center">
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 px-4 py-1">
            {demoMode}
          </Badge>
        </div>
      )}

      {/* Error message if present */}
      {breedingError && (
        <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-center">
          {breedingError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <Card className="bg-black/40 border-none relative overflow-hidden">
          <CardContent className="p-4 flex flex-col items-center">
            {parent1Monster && (
              <>
                <div className="absolute top-2 right-2">
                  <Badge className={`${getRarityColor(parent1Monster.rarity)} text-white`}>
                    {parent1Monster.rarity}
                  </Badge>
                </div>
                <div className="relative h-40 w-40 mb-3">
                  <Image
                    src={parent1Monster.image || "/placeholder.svg"}
                    alt={parent1Monster.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-300">{parent1Monster.name}</p>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4">
          {!isWalletConnected ? (
            <>
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/20 transition-all duration-300 transform hover:scale-105"
              >
                {texts.connectWallet}
              </Button>
              <p className="text-center text-sm text-gray-300 max-w-[250px]">{connectWalletText}</p>
            </>
          ) : (
            <Button
              onClick={handleBreed}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-lg py-6 px-8"
              disabled={isBreeding || !hasEnoughMonsters}
            >
              {isBreeding ? texts.breeding : texts.breedMonsters}
            </Button>
          )}

          {isBreeding && (
            <div className="animate-pulse text-pink-400 text-center">
              <p>{locale === "ru" ? "Разведение в процессе..." : "Breeding in progress..."}</p>
              <p>{locale === "ru" ? "Это может занять несколько секунд" : "This may take a few moments"}</p>
            </div>
          )}

          {isWalletConnected && !hasEnoughMonsters && (
            <div className="flex items-center gap-2 text-yellow-300 text-sm">
              <span>{texts.needTwoNFTs}</span>
            </div>
          )}

          {offspring && (
            <div className="mt-4 bg-black/60 p-3 rounded-lg border border-pink-500/30">
              <p className="text-center text-green-400 font-bold mb-2">{texts.newMonsterCreated}</p>
              <div className="relative h-20 w-20 mx-auto">
                <Image
                  src={offspring.image || "/placeholder.svg"}
                  alt={`${offspring.name} - New offspring`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-center text-white mt-2">{offspring.name}</p>
            </div>
          )}
        </div>

        <Card className="bg-black/40 border-none relative overflow-hidden">
          <CardContent className="p-4 flex flex-col items-center">
            {parent2Monster && (
              <>
                <div className="absolute top-2 right-2">
                  <Badge className={`${getRarityColor(parent2Monster.rarity)} text-white`}>
                    {parent2Monster.rarity}
                  </Badge>
                </div>
                <div className="relative h-40 w-40 mb-3">
                  <Image
                    src={parent2Monster.image || "/placeholder.svg"}
                    alt={parent2Monster.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-300">{parent2Monster.name}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

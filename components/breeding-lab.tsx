"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/lib/wallet-connect"
import { useI18n } from "@/lib/i18n-context"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BnbMonsterLogo } from "./bnb-monster-logo"

// Define types for monsters and offspring
interface Monster {
  id: string
  name: string
  image: string
  rarity: string
  price: string
}

export function BreedingLab() {
  const { translations, locale } = useI18n()
  const [parent1, setParent1] = useState<string>("1")
  const [parent2, setParent2] = useState<string>("3")
  const [isBreeding, setIsBreeding] = useState<boolean>(false)
  const [offspring, setOffspring] = useState<Monster | null>(null)
  const [breedingError, setBreedingError] = useState<string | null>(null)
  const [breedingPower, setBreedingPower] = useState(50)
  const [useSpecialGenes, setUseSpecialGenes] = useState(false)
  const { address, connectWallet, ownedNFTs } = useWallet()

  // Default translation values
  const demoMode = translations.breeding?.demoMode || "Demo Mode"
  const connectWalletText =
    translations.breeding?.connectWallet || "Connect your wallet to breed with your own MonadMonsters monsters."
  const parentText = translations.breeding?.parent || "Parent"

  // Дополнительные локализованные тексты
  const texts = {
    breedMonsters: locale === "ru" ? "Скрестить монстров" : "Breed Monsters",
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
    breedingPower: locale === "ru" ? "Сила разведения" : "Breeding Power",
    useSpecialGenes: locale === "ru" ? "Использовать специальные гены" : "Use Special Genes",
    specialGenesInfo:
      locale === "ru"
        ? "Увеличивает шанс редких характеристик, но стоит дополнительные токены"
        : "Increases chance of rare traits but costs additional tokens",
    costLabel: locale === "ru" ? "Стоимость:" : "Cost:",
    selectParent1: locale === "ru" ? "Выберите первого родителя" : "Select first parent",
    selectParent2: locale === "ru" ? "Выберите второго родителя" : "Select second parent",
    selectMonster: locale === "ru" ? "Выбрать монстра" : "Select Monster",
  }

  // Monster data
  const allMonsters: Monster[] = [
    {
      id: "1",
      name: "Greeny",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
      rarity: "Common",
      price: "0.05 BNB",
    },
    {
      id: "2",
      name: "Aqua",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
      rarity: "Uncommon",
      price: "0.08 BNB",
    },
    {
      id: "3",
      name: "Purply",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68d56a43-41e6-4efd-bc1a-92a8d6985612-QoXIJH3cGbNcKhVk6V9E8UnuJAkG5S.png",
      rarity: "Rare",
      price: "0.15 BNB",
    },
    {
      id: "4",
      name: "Pinky",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68522fbc-f35b-4416-8ac3-d0e783ba5714-elFuXplIykv79gn5XXNdxcqHFfGhOY.png",
      rarity: "Uncommon",
      price: "0.08 BNB",
    },
    {
      id: "5",
      name: "Chompy",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e63a0f33-b60a-4366-832d-f6e3442b9ad9-LCRlrOfUwlaT2IYxlRQE313572hMya.png",
      rarity: "Rare",
      price: "0.12 BNB",
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
      setParent2("3")
    }
  }, [address, ownedNFTs])

  // Calculate breeding cost
  const calculateBreedingCost = () => {
    let cost = 0.05 // Базовая стоимость

    // Увеличиваем стоимость в зависимости от силы разведения
    cost += (breedingPower / 100) * 0.05

    // Добавляем стоимость за специальные гены
    if (useSpecialGenes) {
      cost += 0.03
    }

    return cost.toFixed(2)
  }

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
    <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-br from-yellow-900/40 to-amber-800/40 border border-white/10 shadow-2xl p-8">
      <div className="flex items-center justify-center mb-6">
        <BnbMonsterLogo size={48} />
      </div>

      <div className="text-center mb-8">
        <p className="text-gray-300 max-w-2xl mx-auto">
          {locale === "ru"
            ? "Скрещивайте своих монстров для создания новых уникальных существ с комбинированными характеристиками."
            : "Combine your monsters to create unique offspring with inherited traits."}
        </p>
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
            <h3 className="text-yellow-400 font-semibold mb-4">{texts.selectParent1}</h3>
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

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {allMonsters.slice(0, 3).map((monster) => (
                <Button
                  key={monster.id}
                  variant={parent1 === monster.id ? "default" : "outline"}
                  className={
                    parent1 === monster.id
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : "border-yellow-500/20 hover:border-yellow-500/50 text-yellow-400"
                  }
                  onClick={() => setParent1(monster.id)}
                >
                  {monster.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4">
          <div className="space-y-6 bg-black/40 p-6 rounded-xl border border-yellow-500/20 w-full">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="breeding-power" className="text-gray-300">
                  {texts.breedingPower}
                </Label>
                <span className="text-yellow-400">{breedingPower}%</span>
              </div>
              <Slider
                id="breeding-power"
                min={10}
                max={100}
                step={5}
                value={[breedingPower]}
                onValueChange={(value) => setBreedingPower(value[0])}
                className="[&>span]:bg-yellow-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="special-genes" className="text-gray-300">
                  {texts.useSpecialGenes}
                </Label>
                <p className="text-xs text-gray-400">{texts.specialGenesInfo}</p>
              </div>
              <Switch
                id="special-genes"
                checked={useSpecialGenes}
                onCheckedChange={setUseSpecialGenes}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 flex justify-between items-center">
              <span className="text-gray-300">{texts.costLabel}</span>
              <span className="text-xl font-bold text-yellow-400">{calculateBreedingCost()} BNB</span>
            </div>
          </div>

          {!isWalletConnected ? (
            <>
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105"
              >
                {texts.connectWallet}
              </Button>
              <p className="text-center text-sm text-gray-300 max-w-[250px]">{connectWalletText}</p>
            </>
          ) : (
            <Button
              onClick={handleBreed}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-lg py-6 px-8"
              disabled={isBreeding || !hasEnoughMonsters}
            >
              {isBreeding ? texts.breeding : texts.breedMonsters}
            </Button>
          )}

          {isBreeding && (
            <div className="animate-pulse text-yellow-400 text-center">
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
            <div className="mt-4 bg-black/60 p-3 rounded-lg border border-yellow-500/30">
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
            <h3 className="text-yellow-400 font-semibold mb-4">{texts.selectParent2}</h3>
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

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {allMonsters.slice(0, 3).map((monster) => (
                <Button
                  key={monster.id}
                  variant={parent2 === monster.id ? "default" : "outline"}
                  className={
                    parent2 === monster.id
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : "border-yellow-500/20 hover:border-yellow-500/50 text-yellow-400"
                  }
                  onClick={() => setParent2(monster.id)}
                >
                  {monster.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

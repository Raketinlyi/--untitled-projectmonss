"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Heart, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useWallet } from "@/lib/wallet-connect"

interface Monster {
  id: string
  name: string
  image: string
  rarity: string
  price: string
  traits: string[]
}

export function MonsterCollection() {
  const { translations, locale } = useI18n()
  const { ownedNFTs, address } = useWallet()
  const isWalletConnected = !!address

  // Локализованные тексты
  const texts = {
    viewDetails: translations.monsters?.viewDetails || "View Details",
    viewTraits: locale === "ru" ? "Просмотр характеристик" : "View monster traits",
    addToFavorites: locale === "ru" ? "Добавить в избранное" : "Add to favorites",
    viewSpecialAbilities: locale === "ru" ? "Просмотр особых способностей" : "View special abilities",
  }

  // Monster data
  const monsters: Monster[] = [
    {
      id: "1",
      name: "Greeny",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
      rarity: "Common",
      price: "0.05 MON",
      traits: ["happy", "energetic", "friendly"],
    },
    {
      id: "2",
      name: "Aqua",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
      rarity: "Uncommon",
      price: "0.08 MON",
      traits: ["calm", "wise", "mysterious"],
    },
    {
      id: "3",
      name: "Purply",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68d56a43-41e6-4efd-bc1a-92a8d6985612-QoXIJH3cGbNcKhVk6V9E8UnuJAkG5S.png",
      rarity: "Rare",
      price: "0.15 MON",
      traits: ["wild", "hungry", "chaotic"],
    },
    {
      id: "4",
      name: "Pinky",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68522fbc-f35b-4416-8ac3-d0e783ba5714-elFuXplIykv79gn5XXNdxcqHFfGhOY.png",
      rarity: "Uncommon",
      price: "0.08 MON",
      traits: ["sassy", "stylish", "smooth"],
    },
    {
      id: "5",
      name: "Chompy",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e63a0f33-b60a-4366-832d-f6e3442b9ad9-LCRlrOfUwlaT2IYxlRQE313572hMya.png",
      rarity: "Rare",
      price: "0.12 MON",
      traits: ["excited", "playful", "mischievous"],
    },
  ]

  // Check if monster is owned - memoize this to avoid recalculations
  const isMonsterOwned = useMemo(() => {
    return (id: string) => {
      return isWalletConnected && ownedNFTs.includes(id)
    }
  }, [isWalletConnected, ownedNFTs])

  // Get rarity color and label based on language
  const getRarityInfo = (rarity: string, isOwned: boolean) => {
    // If not owned or not connected, show gray
    if (!isWalletConnected || !isOwned) {
      return {
        color: "bg-gray-500 border-gray-400",
        label: getRarityTranslation(rarity),
      }
    }

    // If owned, show colored badge
    switch (rarity) {
      case "Common":
        return {
          color: "bg-green-500 border-green-400",
          label: getRarityTranslation(rarity),
        }
      case "Uncommon":
        return {
          color: "bg-blue-500 border-blue-400",
          label: getRarityTranslation(rarity),
        }
      case "Rare":
        return {
          color: "bg-purple-500 border-purple-400",
          label: getRarityTranslation(rarity),
        }
      case "Epic":
        return {
          color: "bg-orange-500 border-orange-400",
          label: getRarityTranslation(rarity),
        }
      case "Legendary":
        return {
          color: "bg-yellow-500 border-yellow-400",
          label: getRarityTranslation(rarity),
        }
      default:
        return {
          color: "bg-gray-500 border-gray-400",
          label: getRarityTranslation(rarity),
        }
    }
  }

  // Fix the trait translation function to handle missing translations
  const getTraitTranslation = (trait: string) => {
    if (!translations.monsters?.traits) return trait
    const traits = translations.monsters.traits as Record<string, string>
    return traits[trait] || trait
  }

  // Fix the rarity translation function
  const getRarityTranslation = (rarity: string) => {
    // Try to get from translations object first
    if (translations.rarities && translations.rarities[rarity as keyof typeof translations.rarities]) {
      return translations.rarities[rarity as keyof typeof translations.rarities]
    }

    // Fallback for languages without translations
    return rarity
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {monsters.map((monster) => {
        const isOwned = isMonsterOwned(monster.id)
        const rarityInfo = getRarityInfo(monster.rarity, isOwned)

        return (
          <Card
            key={monster.id}
            className={`bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-4 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105`}
          >
            <div className="relative pt-4 px-4">
              <Badge className={`absolute top-2 right-2 z-10 ${rarityInfo.color} px-3 py-1 text-sm font-medium border`}>
                {rarityInfo.label}
              </Badge>
              <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20">
                <Image
                  src={monster.image || "/placeholder.svg"}
                  alt={`${monster.name} - ${monster.rarity} monster`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-subtitle font-bold gradient-text-secondary">{monster.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label={texts.viewTraits}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-bold">{locale === "ru" ? "Характеристики:" : "Traits:"}</p>
                        <ul className="text-xs">
                          {monster.traits.map((trait, i) => (
                            <li key={i}>{getTraitTranslation(trait)}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {monster.traits.map((trait, i) => (
                  <span key={i} className="text-small px-2 py-1 bg-white/10 rounded-full text-gray-300">
                    {getTraitTranslation(trait)}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-body font-medium text-white">{monster.price}</p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-pink-500"
                    aria-label={texts.addToFavorites}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-500"
                    aria-label={texts.viewSpecialAbilities}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/20 transition-all duration-300">
                {texts.viewDetails}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

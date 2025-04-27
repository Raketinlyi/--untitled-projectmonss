"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n-context"

interface Monster {
  id: string
  name: string
  image: string
  rarity: string
  traits: string[]
  price: string
}

export function MonsterCollection() {
  const { locale } = useI18n()
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null)

  // Локализованные тексты
  const texts = {
    viewDetails: locale === "ru" ? "Подробнее" : "View Details",
    close: locale === "ru" ? "Закрыть" : "Close",
    traits: locale === "ru" ? "Характеристики" : "Traits",
    price: locale === "ru" ? "Цена" : "Price",
    noMonsters:
      locale === "ru" ? "У вас пока нет монстров в коллекции" : "You don't have any monsters in your collection yet",
  }

  // Данные о монстрах
  const monsters: Monster[] = [
    {
      id: "1",
      name: "Greeny",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
      rarity: "Common",
      traits: [
        locale === "ru" ? "Счастливый" : "Happy",
        locale === "ru" ? "Энергичный" : "Energetic",
        locale === "ru" ? "Дружелюбный" : "Friendly",
      ],
      price: "0.05 BNB",
    },
    {
      id: "2",
      name: "Aqua",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
      rarity: "Uncommon",
      traits: [
        locale === "ru" ? "Спокойный" : "Calm",
        locale === "ru" ? "Мудрый" : "Wise",
        locale === "ru" ? "Таинственный" : "Mysterious",
      ],
      price: "0.08 BNB",
    },
    {
      id: "3",
      name: "Purply",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68d56a43-41e6-4efd-bc1a-92a8d6985612-QoXIJH3cGbNcKhVk6V9E8UnuJAkG5S.png",
      rarity: "Rare",
      traits: [
        locale === "ru" ? "Дикий" : "Wild",
        locale === "ru" ? "Голодный" : "Hungry",
        locale === "ru" ? "Хитрый" : "Cunning",
      ],
      price: "0.15 BNB",
    },
    {
      id: "4",
      name: "Pinky",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68522fbc-f35b-4416-8ac3-d0e783ba5714-elFuXplIykv79gn5XXNdxcqHFfGhOY.png",
      rarity: "Uncommon",
      traits: [
        locale === "ru" ? "Дерзкий" : "Bold",
        locale === "ru" ? "Сильный" : "Strong",
        locale === "ru" ? "Гладкий" : "Smooth",
      ],
      price: "0.08 BNB",
    },
    {
      id: "5",
      name: "Chompy",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e63a0f33-b60a-4366-832d-f6e3442b9ad9-LCRlrOfUwlaT2IYxlRQE313572hMya.png",
      rarity: "Rare",
      traits: [
        locale === "ru" ? "Возбужденный" : "Excited",
        locale === "ru" ? "Игривый" : "Playful",
        locale === "ru" ? "Озорной" : "Mischievous",
      ],
      price: "0.12 BNB",
    },
  ]

  // Получение цвета для редкости
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

  // Открытие диалога с деталями монстра
  const openMonsterDetails = (monster: Monster) => {
    setSelectedMonster(monster)
  }

  // Закрытие диалога
  const closeMonsterDetails = () => {
    setSelectedMonster(null)
  }

  return (
    <div className="relative">
      {monsters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-yellow-300 text-xl">{texts.noMonsters}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {monsters.map((monster) => (
            <Card
              key={monster.id}
              className="bg-gradient-to-b from-amber-900/80 to-yellow-900/80 border-yellow-500/30 overflow-hidden hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-4 flex flex-col items-center">
                <div className="absolute top-2 right-2">
                  <Badge className={`${getRarityColor(monster.rarity)} text-white`}>{monster.rarity}</Badge>
                </div>
                <div className="relative h-40 w-40 my-4">
                  <Image src={monster.image || "/placeholder.svg"} alt={monster.name} fill className="object-contain" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{monster.name}</h3>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {monster.traits.slice(0, 3).map((trait, index) => (
                    <span key={index} className="text-xs text-yellow-200 bg-yellow-900/50 px-2 py-1 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
                <div className="text-yellow-400 font-bold mb-4">{monster.price}</div>
                <Button
                  onClick={() => openMonsterDetails(monster)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {texts.viewDetails}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMonster} onOpenChange={closeMonsterDetails}>
        {selectedMonster && (
          <DialogContent className="bg-gradient-to-b from-yellow-900 to-amber-900 border-yellow-500/30 text-yellow-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-yellow-400 text-center">
                {selectedMonster.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <Badge className={`${getRarityColor(selectedMonster.rarity)} text-white mb-4`}>
                {selectedMonster.rarity}
              </Badge>
              <div className="relative h-60 w-60 mb-6">
                <Image
                  src={selectedMonster.image || "/placeholder.svg"}
                  alt={selectedMonster.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="w-full">
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">{texts.traits}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMonster.traits.map((trait, index) => (
                    <span key={index} className="text-sm bg-yellow-800/50 px-3 py-1 rounded-full text-yellow-200">
                      {trait}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-yellow-500/30 pt-4 mt-4">
                  <span className="text-yellow-300">{texts.price}</span>
                  <span className="text-xl font-bold text-yellow-400">{selectedMonster.price}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

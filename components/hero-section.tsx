"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n-context"
import { ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface Monster {
  id: number
  name: string
  image: string
  description: string
  descriptionRu?: string
  rarity: string
  color: string
}

export function HeroSection() {
  const { translations, locale } = useI18n()
  const [currentMonster, setCurrentMonster] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Мемоизируем переводы для предотвращения ненужных ререндеров
  const heroTitle = useMemo(
    () => translations.hero?.title || "Collect, Breed, Trade Crazy Momon NFTs",
    [translations.hero?.title],
  )
  const heroSubtitle = useMemo(
    () => translations.hero?.subtitle || "Enter the psychedelic world of Momon monsters",
    [translations.hero?.subtitle],
  )
  const exploreButton = useMemo(
    () => translations.hero?.exploreButton || "Explore Collection",
    [translations.hero?.exploreButton],
  )
  const breedButton = useMemo(
    () => translations.hero?.breedButton || "Start Breeding",
    [translations.hero?.breedButton],
  )

  // Мемоизируем массив монстров для предотвращения ненужных ререндеров
  const monsters: Monster[] = useMemo(
    () => [
      {
        id: 1,
        name: "Greeny",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
        description: "The happiest BNBMonster with lime energy and boundless enthusiasm!",
        descriptionRu: "Самый счастливый BNBMonster с лаймовой энергией и безграничным энтузиазмом!",
        rarity: "Common",
        color: "from-green-400 to-lime-500",
      },
      {
        id: 2,
        name: "Aqua",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
        description: "The chill BNBMonster with laid-back vibes and ocean wisdom.",
        descriptionRu: "Спокойный BNBMonster с расслабленной атмосферой и мудростью океана.",
        rarity: "Rare",
        color: "from-blue-400 to-cyan-500",
      },
      {
        id: 3,
        name: "Purply",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68d56a43-41e6-4efd-bc1a-92a8d6985612-QoXIJH3cGbNcKhVk6V9E8UnuJAkG5S.png",
        description: "The wildest BNBMonster with chaotic energy and a hunger for adventure!",
        descriptionRu: "Самый дикий BNBMonster с хаотичной энергией и жаждой приключений!",
        rarity: "Epic",
        color: "from-purple-400 to-indigo-500",
      },
      {
        id: 4,
        name: "Pinky",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/68522fbc-f35b-4416-8ac3-d0e783ba5714-elFuXplIykv79gn5XXNdxcqHFfGhOY.png",
        description: "The smooth BNBMonster with style, sass, and a mysterious smile.",
        descriptionRu: "Гладкий BNBMonster со стилем, дерзостью и загадочной улыбкой.",
        rarity: "Legendary",
        color: "from-pink-400 to-rose-500",
      },
      {
        id: 5,
        name: "Chompy",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e63a0f33-b60a-4366-832d-f6e3442b9ad9-LCRlrOfUwlaT2IYxlRQE313572hMya.png",
        description: "The excitable BNBMonster with a big appetite for fun and mischief!",
        descriptionRu: "Возбудимый BNBMonster с большим аппетитом к веселью и озорству!",
        rarity: "Uncommon",
        color: "from-yellow-400 to-amber-500",
      },
    ],
    [],
  )

  // Устанавливаем флаг загрузки
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Автоматическое переключение монстров с интервалом
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      setCurrentMonster((prev) => (prev + 1) % monsters.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [monsters.length, isHovering])

  // Обработчики событий мыши
  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => setIsHovering(false), [])
  const handleMonsterClick = useCallback((index: number) => setCurrentMonster(index), [])

  // Безопасно разделяем заголовок
  const titleParts = useMemo(() => heroTitle.split(","), [heroTitle])

  // Получаем правильное описание в зависимости от языка
  const currentDescription =
    locale === "ru" && monsters[currentMonster].descriptionRu
      ? monsters[currentMonster].descriptionRu
      : monsters[currentMonster].description

  // Анимации для элементов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const monsterVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, rotate: 5, transition: { duration: 0.3 } },
  }

  return (
    <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-br from-yellow-900/40 to-amber-800/40 border border-yellow-500/10 shadow-2xl">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-800/30 to-amber-700/30 mix-blend-multiply z-10"></div>
      <div className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/30 via-amber-500/30 to-transparent animate-pulse"></div>

      {/* Блики */}
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-amber-500/20 rounded-full blur-xl"></div>

      <motion.div
        className="relative z-20 grid md:grid-cols-2 gap-6 sm:gap-8 items-center p-4 sm:p-6 md:p-8 lg:p-12"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div>
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-full border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-512x512-mzpZcLlZpfmk9fYVHTXFOA1kfExO9k.png"
                  alt="BNB Monster Logo"
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 640px) 48px, 64px"
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight tracking-tight"
            variants={itemVariants}
          >
            <span className="inline-block">{titleParts[0] || "Collect"},</span>{" "}
            <span className="inline-block">{titleParts[1] || "Breed"}</span> <span className="inline-block">&</span>{" "}
            <span className="inline-block">{titleParts[2] || "Trade"}</span>
            <br />
            <span className="text-yellow-400 animate-gradient drop-shadow-lg">BNBMonster NFTs</span>
          </motion.h1>

          <motion.div
            className="bg-gradient-to-r from-yellow-500/30 to-amber-500/30 px-3 sm:px-4 py-1.5 rounded-full inline-block mb-3 sm:mb-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <p className="text-yellow-300 font-bold text-sm">
                {locale === "ru" ? "МЕМ-МОНЕТА BNB С УТИЛИТОЙ" : "BNB MEME COIN WITH UTILITY"}
              </p>
            </div>
          </motion.div>

          <motion.p className="text-body text-gray-200 mb-6 sm:mb-8 max-w-2xl" variants={itemVariants}>
            {heroSubtitle}
          </motion.p>

          <motion.div className="flex flex-wrap gap-3 sm:gap-4" variants={itemVariants}>
            <Link href="/collection">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border-none font-bold shadow-lg shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105 group"
              >
                {exploreButton}
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/breed">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 font-medium backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:border-white"
              >
                {breedButton}
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={monsters[currentMonster].id}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={monsterVariants}
              className="absolute inset-0 flex items-center justify-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMonsterClick((currentMonster + 1) % monsters.length)}
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(255,204,0,0.5)]">
                <Image
                  src={monsters[currentMonster].image || "/placeholder.svg"}
                  alt={`${monsters[currentMonster].name} - ${locale === "ru" ? monsters[currentMonster].descriptionRu : monsters[currentMonster].description}`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, (max-width: 1200px) 256px, 320px"
                />

                {/* Эффект свечения вокруг монстра */}
                <div
                  className={`absolute inset-0 -z-10 rounded-full blur-2xl opacity-30 bg-gradient-to-r ${monsters[currentMonster].color}`}
                ></div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Информация о текущем монстре */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white">{monsters[currentMonster].name}</h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${monsters[currentMonster].color}`}
              >
                {monsters[currentMonster].rarity}
              </span>
            </div>
            <p className="text-gray-200 text-xs sm:text-sm">{currentDescription}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Индикаторы для переключения монстров */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {monsters.map((_, index) => (
          <button
            key={index}
            onClick={() => handleMonsterClick(index)}
            className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentMonster
                ? `bg-gradient-to-r ${monsters[index].color} w-4 sm:w-6`
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={
              locale === "ru"
                ? `Показать монстра ${index + 1}: ${monsters[index].name}`
                : `Show monster ${index + 1}: ${monsters[index].name}`
            }
          />
        ))}
      </div>
    </div>
  )
}

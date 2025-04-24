"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MonsterCollection } from "@/components/monster-collection"
import { HeroSection } from "@/components/hero-section"
import { BreedingLab } from "@/components/breeding-lab"
import { WalletConnect } from "@/components/wallet-connect"
import { PartyMode } from "@/components/party-mode"
import { TokenomicsSection } from "@/components/tokenomics-section"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { Gamepad } from "lucide-react"
import { AboutSection } from "@/components/about-section"
import Image from "next/image"
import { motion } from "framer-motion"
import { Footer } from "@/components/layout/footer"

function HomeContent() {
  const { translations, locale } = useI18n()
  const [isMounted, setIsMounted] = useState(false)

  // Check if component is mounted on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Memoize translation values to prevent unnecessary re-renders
  const translatedTexts = useMemo(
    () => ({
      homeText: translations.common?.home || "Home",
      collectionText: translations.common?.collection || "Collection",
      breedText: translations.common?.breed || "Breed",
      marketplaceText: translations.common?.marketplace || "Marketplace",
      learnMoreText: translations.common?.learnMore || "Learn More",
      featuredMonstersText: translations.sections?.featuredMonsters || "Featured Monsters",
      breedingLabText: translations.sections?.breedingLab || "Breeding Lab",
      aboutTitleText: translations.sections?.aboutTitle || "About Momon NFT",
      aboutText1: translations.sections?.aboutText1 || "Momon is a collection of charismatic monster NFTs.",
      aboutText2: translations.sections?.aboutText2 || "Their bodies resemble inflated memcoins covered with graffiti.",
      copyrightText: translations.footer?.copyright || "© 2023 MomonVerse. All rights reserved.",
      poweredByText: translations.footer?.poweredBy || "Powered by Monad",
      warningText: translations.footer?.warning || "Warning: This site may cause excessive happiness.",
      // Добавляем перевод для кнопки игры
      playGame: locale === "ru" ? "Играть в Защитника от Монстров" : "Play Monster Defender",
    }),
    [translations, locale],
  )

  // Анимации для секций
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        <header className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PartyMode />
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <WalletConnect />
            </div>
          </div>
        </header>

        <motion.main
          className="container mx-auto px-4 py-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <HeroSection />
          </motion.div>

          {/* Add meme coin subtitle */}
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-sm md:text-base text-yellow-300 font-medium mt-1 animate-pulse">
              {locale === "ru"
                ? "Самая горячая мем-монета на блокчейне Monad!"
                : "The hottest meme coin on Monad blockchain!"}
            </p>
          </motion.div>

          {/* Game button */}
          {isMounted && (
            <motion.div className="my-16 flex justify-center" variants={itemVariants}>
              <ErrorBoundary
                fallback={
                  <div className="text-red-500">
                    {locale === "ru" ? "Не удалось загрузить игровую кнопку" : "Failed to load game button"}
                  </div>
                }
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <Image
                      src="/images/momon-logo.png"
                      alt="Momon Logo"
                      width={100}
                      height={100}
                      className="object-contain animate-bounce"
                    />
                  </div>
                  <Link href="/game">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-8 px-12 rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 animate-pulse group"
                      size="lg"
                    >
                      <Gamepad className="w-6 h-6 mr-3 group-hover:animate-wiggle" aria-hidden="true" />
                      {translatedTexts.playGame}
                    </Button>
                  </Link>
                </div>
              </ErrorBoundary>
            </motion.div>
          )}

          {/* Featured monsters section */}
          <motion.section className="my-16" variants={itemVariants}>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="animate-bounce inline-block text-2xl" aria-hidden="true">
                🔥
              </span>
              <h2 className="text-title gradient-text-secondary">{translatedTexts.featuredMonstersText}</h2>
              <span className="animate-bounce inline-block text-2xl" aria-hidden="true">
                🔥
              </span>
            </div>
            <MonsterCollection />
          </motion.section>

          {/* Breeding lab section */}
          <motion.section
            className="my-16 bg-gradient-to-br from-black/30 to-purple-900/20 p-6 md:p-8 rounded-2xl backdrop-blur-sm border-2 border-dashed border-pink-500 animate-border-pulse"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <h2 className="text-title gradient-text-secondary">{translatedTexts.breedingLabText}</h2>
            </div>
            <BreedingLab />
          </motion.section>

          {/* Tokenomics section */}
          <motion.div variants={itemVariants}>
            <TokenomicsSection />
          </motion.div>

          {/* About section */}
          <motion.div variants={itemVariants}>
            <AboutSection
              title={translatedTexts.aboutTitleText}
              text1={translatedTexts.aboutText1}
              text2={translatedTexts.aboutText2}
              locale={locale}
            />
          </motion.div>
        </motion.main>

        {/* Добавляем футер */}
        <Footer />
      </div>
    </div>
  )
}

export default HomeContent

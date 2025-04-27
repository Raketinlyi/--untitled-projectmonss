"use client"

import { useI18n } from "@/lib/i18n-context"
import { motion } from "framer-motion"
import { Coins, TrendingUp, Wallet } from "lucide-react"

export function TokenomicsSection() {
  const { locale } = useI18n()

  // Локализованные тексты
  const texts = {
    title: locale === "ru" ? "Токеномика" : "Tokenomics",
    totalSupply: locale === "ru" ? "Общий запас" : "Total Supply",
    tokens: locale === "ru" ? "BNB токенов" : "BNB tokens",
    initialPrice: locale === "ru" ? "Начальная цена" : "Initial Price",
    perToken: locale === "ru" ? "за BNB токен" : "per BNB token",
    stakingRewards: locale === "ru" ? "Награды за стейкинг" : "Staking Rewards",
    forNftHolders: locale === "ru" ? "для держателей NFT" : "for NFT holders",
  }

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(255, 204, 0, 0.1), 0 10px 10px -5px rgba(255, 204, 0, 0.04)",
    },
  }

  return (
    <motion.section
      className="my-8 sm:my-16 p-4 sm:p-8 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl backdrop-blur-sm border border-yellow-500/10 shadow-2xl overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.div className="flex items-center justify-center gap-3 mb-6 sm:mb-8" variants={itemVariants}>
        <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
          <Coins className="w-5 h-5 text-yellow-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400">{texts.title}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          className="bg-gradient-to-br from-yellow-900/40 to-amber-800/40 p-4 sm:p-6 rounded-lg border border-yellow-500/20 shadow-lg shadow-yellow-500/10 backdrop-blur-sm transition-all duration-300"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">{texts.totalSupply}</h3>
            <div className="p-2 rounded-full bg-yellow-500/20">
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          {/* Используем два разных отображения для больших и маленьких экранов */}
          <div className="hidden md:block">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 truncate">1,000,000,000</p>
          </div>
          <div className="block md:hidden">
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">1B</p>
          </div>

          <p className="text-sm text-gray-300 mt-2">{texts.tokens}</p>

          {/* Декоративный элемент */}
          <div className="w-full h-1 bg-gradient-to-r from-yellow-500/50 to-amber-500/50 rounded-full mt-4"></div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-yellow-900/40 to-amber-800/40 p-4 sm:p-6 rounded-lg border border-yellow-500/20 shadow-lg shadow-yellow-500/10 backdrop-blur-sm transition-all duration-300"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">{texts.initialPrice}</h3>
            <div className="p-2 rounded-full bg-yellow-500/20">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">$0.001</p>
          <p className="text-sm text-gray-300 mt-2">{locale === "ru" ? "за BNB токен" : "per BNB token"}</p>

          {/* Декоративный элемент */}
          <div className="w-full h-1 bg-gradient-to-r from-yellow-500/50 to-amber-500/50 rounded-full mt-4"></div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-yellow-900/40 to-amber-800/40 p-4 sm:p-6 rounded-lg border border-yellow-500/20 shadow-lg shadow-yellow-500/10 backdrop-blur-sm transition-all duration-300"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">{texts.stakingRewards}</h3>
            <div className="p-2 rounded-full bg-yellow-500/20">
              <Wallet className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">12% APY</p>
          <p className="text-sm text-gray-300 mt-2">{texts.forNftHolders}</p>

          {/* Декоративный элемент */}
          <div className="w-full h-1 bg-gradient-to-r from-yellow-500/50 to-amber-500/50 rounded-full mt-4"></div>
        </motion.div>
      </div>

      {/* Добавляем всплывающую подсказку с полной информацией */}
      <div className="mt-6 text-center">
        <p
          className="text-sm text-gray-400 hover:text-white transition-colors cursor-help"
          title="Total Supply: 1,000,000,000 BNB tokens"
        >
          {locale === "ru" ? "* Наведите для подробной информации" : "* Hover for detailed information"}
        </p>
      </div>
    </motion.section>
  )
}

"use client"

import { useI18n } from "@/lib/i18n-context"
import Link from "next/link"
import { Heart } from "lucide-react"
import { TwitterIcon, DiscordIcon, TelegramIcon } from "@/components/social-icons"
import { motion } from "framer-motion"
import { BnbMonsterLogo } from "@/components/bnb-monster-logo"

export function Footer() {
  const { translations, locale } = useI18n()
  const currentYear = new Date().getFullYear()

  // Локализованные тексты
  const texts = {
    copyright: translations.footer?.copyright || `© ${currentYear} MonadMonster NFT. All rights reserved.`,
    poweredBy: translations.footer?.poweredBy || "Powered by Monad",
    resources: translations.footer?.resources || "Resources",
    community: translations.footer?.community || "Community",
    legal: translations.footer?.legal || "Legal",
    terms: translations.footer?.terms || "Terms",
    privacy: translations.footer?.privacy || "Privacy",
    whitepaper: translations.footer?.whitepaper || "Whitepaper",
    docs: translations.footer?.docs || "Docs",
    faq: translations.footer?.faq || "FAQ",
    madeWith: translations.footer?.madeWith || "Made with",
    byTeam: translations.footer?.byTeam || "by the MonadMonster Team",
  }

  // Анимация для ссылок
  const linkAnimation = {
    whileHover: { scale: 1.05, x: 3, transition: { duration: 0.2 } },
  }

  // Анимация для иконок соцсетей
  const socialIconAnimation = {
    whileHover: { scale: 1.1, y: -5, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
  }

  // Социальные сети с правильными ссылками
  const socialLinks = [
    {
      icon: <TwitterIcon className="w-6 h-6 md:w-8 md:h-8" />,
      href: "https://x.com/MonadMonster",
      label: "Twitter",
      color: "from-yellow-400 to-amber-600",
    },
    {
      icon: <DiscordIcon className="w-6 h-6 md:w-8 md:h-8" />,
      href: "https://discord.gg/8f35EBkX",
      label: "Discord",
      color: "from-yellow-400 to-amber-600",
    },
    {
      icon: <TelegramIcon className="w-6 h-6 md:w-8 md:h-8" />,
      href: "https://web.telegram.org/a/#7923585285",
      label: "Telegram",
      color: "from-yellow-400 to-amber-600",
    },
  ]

  // Ссылки на сообщество для списка в футере
  const communityLinks = [
    { label: "Twitter", href: "https://x.com/MonadMonster", icon: <TwitterIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { label: "Discord", href: "https://discord.gg/8f35EBkX", icon: <DiscordIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
    {
      label: "Telegram",
      href: "https://web.telegram.org/a/#7923585285",
      icon: <TelegramIcon className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ]

  return (
    <footer className="mt-8 sm:mt-12 md:mt-16 lg:mt-24 border-t border-white/10 bg-gradient-to-b from-transparent to-yellow-950/30 pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6">
      <div className="container mx-auto px-4">
        {/* Большие иконки социальных сетей в верхней части футера */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-xs sm:max-w-md mx-auto">
            {socialLinks.map((social) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 sm:p-4 md:p-6 rounded-2xl bg-gradient-to-br ${social.color} hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
                variants={socialIconAnimation}
                whileHover="whileHover"
                whileTap="whileTap"
                aria-label={social.label}
              >
                <div className="text-white">{social.icon}</div>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
          {/* Логотип и информация */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BnbMonsterLogo size={32} />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 max-w-xs">
              {locale === "ru"
                ? "Коллекция уникальных NFT монстров на блокчейне BNB с игровыми механиками и стейкингом."
                : "A collection of unique monster NFTs on the BNB blockchain with gaming mechanics and staking rewards."}
            </p>
          </div>

          {/* Ресурсы */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4 text-spacing-wide">
              {texts.resources}
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { label: texts.whitepaper, href: "/whitepaper" },
                { label: texts.docs, href: "/docs" },
                { label: texts.faq, href: "/faq" },
              ].map((item) => (
                <li key={item.href}>
                  <motion.div whileHover="whileHover" variants={linkAnimation}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-yellow-400 text-xs sm:text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Сообщество */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              {texts.community}
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {communityLinks.map((item) => (
                <li key={item.href}>
                  <motion.div whileHover="whileHover" variants={linkAnimation}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-yellow-400 text-xs sm:text-sm transition-colors flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Правовая информация */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              {texts.legal}
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { label: texts.terms, href: "/terms" },
                { label: texts.privacy, href: "/privacy" },
              ].map((item) => (
                <li key={item.href}>
                  <motion.div whileHover="whileHover" variants={linkAnimation}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-yellow-400 text-xs sm:text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 md:mb-0 text-center md:text-left">
            {locale === "ru"
              ? `© ${new Date().getFullYear()} BNBMonster NFT. Все права защищены.`
              : `© ${new Date().getFullYear()} BNBMonster NFT. All rights reserved.`}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{texts.madeWith}</span>
            <Heart className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{texts.byTeam.replace("MonadMonster", "BNBMonster")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

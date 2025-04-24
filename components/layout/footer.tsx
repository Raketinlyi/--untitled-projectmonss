"use client"

import { useI18n } from "@/lib/i18n-context"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { TwitterIcon, DiscordIcon, TelegramIcon } from "@/components/social-icons"
import { motion } from "framer-motion"

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
      icon: <TwitterIcon className="w-8 h-8 md:w-10 md:h-10" />,
      href: "https://x.com/MonadMonster",
      label: "Twitter",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <DiscordIcon className="w-8 h-8 md:w-10 md:h-10" />,
      href: "https://discord.gg/8f35EBkX",
      label: "Discord",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      icon: <TelegramIcon className="w-8 h-8 md:w-10 md:h-10" />,
      href: "https://web.telegram.org/a/#7923585285",
      label: "Telegram",
      color: "from-sky-400 to-sky-600",
    },
  ]

  // Ссылки на сообщество для списка в футере
  const communityLinks = [
    { label: "Twitter", href: "https://x.com/MonadMonster", icon: <TwitterIcon className="w-5 h-5" /> },
    { label: "Discord", href: "https://discord.gg/8f35EBkX", icon: <DiscordIcon className="w-5 h-5" /> },
    { label: "Telegram", href: "https://web.telegram.org/a/#7923585285", icon: <TelegramIcon className="w-5 h-5" /> },
  ]

  return (
    <footer className="mt-24 border-t border-white/10 bg-gradient-to-b from-transparent to-purple-950/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Большие иконки социальных сетей в верхней части футера */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 gap-6 md:gap-10 max-w-md mx-auto">
            {socialLinks.map((social) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 md:p-6 rounded-2xl bg-gradient-to-br ${social.color} hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Логотип и информация */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
                alt="Momon Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-lg font-bold text-white">MonadMonster</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              {locale === "ru"
                ? "Коллекция уникальных NFT монстров на блокчейне Monad с игровыми механиками и стейкингом."
                : "A collection of unique monster NFTs on the Monad blockchain with gaming mechanics and staking rewards."}
            </p>
          </div>

          {/* Ресурсы */}
          <div>
            <h3 className="text-small font-semibold text-white uppercase tracking-wider mb-4 text-spacing-wide">
              {texts.resources}
            </h3>
            <ul className="space-y-2">
              {[
                { label: texts.whitepaper, href: "/whitepaper" },
                { label: texts.docs, href: "/docs" },
                { label: texts.faq, href: "/faq" },
              ].map((item) => (
                <li key={item.href}>
                  <motion.div whileHover="whileHover" variants={linkAnimation}>
                    <Link href={item.href} className="text-gray-400 hover:text-pink-400 text-small transition-colors">
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Сообщество */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{texts.community}</h3>
            <ul className="space-y-2">
              {communityLinks.map((item) => (
                <li key={item.href}>
                  <motion.div whileHover="whileHover" variants={linkAnimation}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-pink-400 text-sm transition-colors flex items-center gap-2"
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{texts.legal}</h3>
            <ul className="space-y-2">
              {[
                { label: texts.terms, href: "/terms" },
                { label: texts.privacy, href: "/privacy" },
              ].map((item) => (
                <li key={item.href}>
                  <motion.div whileHover="whileHover" variants={linkAnimation}>
                    <Link href={item.href} className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-small text-gray-400 mb-4 md:mb-0">{texts.copyright}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{texts.madeWith}</span>
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
            <span>{texts.byTeam}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

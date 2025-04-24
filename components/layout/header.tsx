"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import { MobileNav } from "@/components/mobile-nav"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { TwitterIcon, DiscordIcon, TelegramIcon } from "@/components/social-icons"

interface HeaderProps {
  showNavigation?: boolean
}

export function Header({ showNavigation = true }: HeaderProps) {
  const { translations } = useI18n()
  const pathname = usePathname()

  // Анимация для логотипа
  const logoAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  // Определяем активную ссылку
  const isActive = (path: string) => pathname === path

  // Анимация для иконок соцсетей
  const socialIconAnimation = {
    whileHover: { scale: 1.2, y: -3, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
  }

  // Социальные сети с правильными ссылками
  const socialLinks = [
    { icon: <TwitterIcon className="w-6 h-6" />, href: "https://x.com/MonadMonster", label: "Twitter" },
    { icon: <DiscordIcon className="w-6 h-6" />, href: "https://discord.gg/8f35EBkX", label: "Discord" },
    { icon: <TelegramIcon className="w-6 h-6" />, href: "https://web.telegram.org/a/#7923585285", label: "Telegram" },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-b border-white/10 shadow-lg">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <motion.div initial="initial" animate="animate" whileHover="whileHover" variants={logoAnimation}>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-pink-500/50 shadow-lg shadow-pink-500/20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
                  alt="Momon Logo"
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                  MonadMonster
                </h1>
                <p className="text-xs text-pink-300/80 -mt-1">NFT Collection</p>
              </div>
            </Link>
          </motion.div>

          <div className="flex items-center gap-6">
            {/* Социальные сети в хедере */}
            <div className="hidden md:flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-pink-400 transition-colors duration-200"
                  variants={socialIconAnimation}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  aria-label={social.label}
                >
                  <div className="p-2 rounded-full bg-purple-800/50 hover:bg-purple-700/50 transition-colors duration-200 shadow-md hover:shadow-pink-500/20">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>

            {showNavigation && (
              <>
                <nav className="hidden md:flex items-center gap-8">
                  {[
                    { href: "/", label: translations.common?.home || "Home" },
                    { href: "/collection", label: translations.common?.collection || "Collection" },
                    { href: "/breed", label: translations.common?.breed || "Breed" },
                    { href: "/collection", label: translations.common?.marketplace || "Marketplace" },
                    { href: "/game", label: translations.common?.game || "Game" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative font-medium transition-colors duration-200 hover:text-pink-400 ${
                        isActive(link.href) ? "text-pink-400" : "text-white/90"
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <motion.span
                          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
                          layoutId="activeNavIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  ))}
                </nav>
                <MobileNav />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

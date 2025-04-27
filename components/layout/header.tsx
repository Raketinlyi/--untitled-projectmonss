"use client"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import { MobileNav } from "@/components/mobile-nav"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { TwitterIcon, DiscordIcon, TelegramIcon } from "@/components/social-icons"
import { BnbLogo } from "@/components/bnb-logo"

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
    { icon: <TwitterIcon className="w-4 h-4 sm:w-5 sm:h-5" />, href: "https://x.com/BNBMonster", label: "Twitter" },
    { icon: <DiscordIcon className="w-5 h-5 sm:w-6 sm:h-6" />, href: "https://discord.gg/8f35EBkX", label: "Discord" },
    {
      icon: <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      href: "https://web.telegram.org/a/#7923585285",
      label: "Telegram",
    },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-yellow-900/80 to-yellow-800/80 border-b border-white/10 shadow-lg">
      <div className="container mx-auto py-3 sm:py-4 px-3 sm:px-4">
        <div className="flex justify-between items-center">
          <motion.div initial="initial" animate="animate" whileHover="whileHover" variants={logoAnimation}>
            <Link href="/" className="flex items-center gap-2">
              <BnbLogo size={28} withText={false} />
              <span className="font-heading font-bold text-base sm:text-lg hidden md:inline-block text-yellow-400">
                BNBMonster
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
            {/* Социальные сети в хедере */}
            <div className="hidden md:flex items-center gap-2 sm:gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-yellow-400 transition-colors duration-200"
                  variants={socialIconAnimation}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  aria-label={social.label}
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-yellow-800/50 hover:bg-yellow-700/50 transition-colors duration-200 shadow-md hover:shadow-yellow-500/20">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>

            {showNavigation && (
              <>
                <nav className="hidden md:flex items-center gap-4 sm:gap-8">
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
                      className={`relative font-medium transition-colors duration-200 hover:text-yellow-400 text-sm sm:text-base ${
                        isActive(link.href) ? "text-yellow-400" : "text-white/90"
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <motion.span
                          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600"
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

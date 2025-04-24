"use client"

import { useState } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { TwitterIcon, DiscordIcon, TelegramIcon } from "@/components/social-icons"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { translations } = useI18n()
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Определяем активную ссылку
  const isActive = (path: string) => pathname === path

  // Социальные сети с правильными ссылками
  const socialLinks = [
    {
      icon: <TwitterIcon className="w-7 h-7" />,
      href: "https://x.com/MonadMonster",
      label: "Twitter",
      color: "bg-blue-600",
    },
    {
      icon: <DiscordIcon className="w-7 h-7" />,
      href: "https://discord.gg/8f35EBkX",
      label: "Discord",
      color: "bg-indigo-600",
    },
    {
      icon: <TelegramIcon className="w-7 h-7" />,
      href: "https://web.telegram.org/a/#7923585285",
      label: "Telegram",
      color: "bg-sky-500",
    },
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-md"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-lg shadow-lg z-50 border-b border-white/10"
          >
            <div className="container mx-auto p-4">
              <nav className="flex flex-col space-y-4">
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
                    onClick={closeMenu}
                    className={`py-2 px-4 rounded-md transition-colors ${
                      isActive(link.href) ? "bg-pink-500/20 text-pink-400" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Социальные сети в мобильном меню */}
                <div className="flex justify-center gap-6 pt-4 mt-4 border-t border-white/10">
                  {socialLinks.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full ${social.color} text-white/90 hover:text-white transition-all duration-200 shadow-md hover:shadow-pink-500/20`}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

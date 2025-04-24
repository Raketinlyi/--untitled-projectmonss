"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { DiscordIcon, TelegramIcon, TwitterIcon } from "./social-icons"

export function SocialSidebar() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  // Не показывать в игровом разделе
  const isGameSection = pathname?.includes("/game") || pathname?.includes("/play")

  useEffect(() => {
    const handleScroll = () => {
      // Показывать после прокрутки на 300px
      const scrollY = window.scrollY
      setVisible(scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isGameSection) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden md:block"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4 items-center bg-black/20 backdrop-blur-lg p-3 rounded-full shadow-lg border border-purple-500/30">
            <a
              href="https://discord.gg/8f35EBkX"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="Discord"
            >
              <div className="absolute inset-0 bg-[#5865F2] rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"></div>
              <div className="relative p-2 rounded-full bg-purple-900/50 hover:bg-purple-800 transition-colors duration-300 group-hover:text-white">
                <DiscordIcon className="w-6 h-6" />
              </div>
              <div className="absolute left-full ml-2 px-3 py-1 rounded-md bg-black/80 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300">
                Discord
              </div>
            </a>

            <a
              href="https://web.telegram.org/a/#7923585285"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="Telegram"
            >
              <div className="absolute inset-0 bg-[#0088cc] rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"></div>
              <div className="relative p-2 rounded-full bg-purple-900/50 hover:bg-purple-800 transition-colors duration-300 group-hover:text-white">
                <TelegramIcon className="w-6 h-6" />
              </div>
              <div className="absolute left-full ml-2 px-3 py-1 rounded-md bg-black/80 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300">
                Telegram
              </div>
            </a>

            <a
              href="https://x.com/MonadMonster"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="Twitter"
            >
              <div className="absolute inset-0 bg-black rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"></div>
              <div className="relative p-2 rounded-full bg-purple-900/50 hover:bg-purple-800 transition-colors duration-300 group-hover:text-white">
                <TwitterIcon className="w-6 h-6" />
              </div>
              <div className="absolute left-full ml-2 px-3 py-1 rounded-md bg-black/80 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300">
                Twitter
              </div>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"
import { motion } from "framer-motion"
import { ChevronRight, Info } from "lucide-react"
import Link from "next/link"

interface AboutSectionProps {
  title: string
  text1: string
  text2: string
  locale: string
}

export function AboutSection({ title, text1, text2, locale }: AboutSectionProps) {
  const { translations } = useI18n()

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

  return (
    <motion.section
      className="my-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-white/10 backdrop-blur-md overflow-hidden hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-500">
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20">
                  <Info className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-title gradient-text-secondary">{title}</h2>
              </div>

              <p className="text-body text-gray-200 mb-5 leading-relaxed">{text1}</p>
              <p className="text-body text-gray-200 mb-5 leading-relaxed">{text2}</p>

              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-4 rounded-lg mb-6">
                <p className="text-orange-300 font-medium text-body">
                  {locale === "ru"
                    ? "MOMON NFTs – это коллекция мем-монстров с реальной утилитой!"
                    : "MOMON NFTs – a collection of meme monsters with real utility!"}
                </p>
              </div>

              <Link href="/about">
                <Button className="bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-black font-bold shadow-lg shadow-lime-500/20 transition-all duration-300 transform hover:scale-105 group">
                  {translations.common?.learnMore || "Learn More"}
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="relative h-64 md:h-80 overflow-hidden rounded-xl group shadow-2xl shadow-purple-500/20"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 mix-blend-overlay z-10 rounded-xl"></div>

              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1234.jpg-XJYUoy5GV3fieKtUrRXoN9HxU6RfRE.jpeg"
                alt="Momon NFT Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-110"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-center font-medium">
                  {locale === "ru" ? "Безумный мир NFT ждет вас!" : "Crazy NFT world awaits you!"}
                </p>
              </div>

              {/* Декоративные элементы */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-70 blur-md"></div>
              <div className="absolute bottom-12 left-6 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-70 blur-md"></div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}

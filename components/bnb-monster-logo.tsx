import Image from "next/image"
import { cn } from "@/lib/utils"

interface BnbMonsterLogoProps {
  size?: number
  className?: string
}

export function BnbMonsterLogo({ size = 40, className }: BnbMonsterLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
          alt="BNB Logo"
          fill
          className="object-contain"
        />
      </div>
      <span className="font-bold text-yellow-400" style={{ fontSize: size * 0.5 }}>
        BNBMonster NFT
      </span>
    </div>
  )
}

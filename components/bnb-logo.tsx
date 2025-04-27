import Image from "next/image"

interface BnbLogoProps {
  size?: number
  className?: string
}

export function BnbLogo({ size = 40, className = "" }: BnbLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
        alt="BNB Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}

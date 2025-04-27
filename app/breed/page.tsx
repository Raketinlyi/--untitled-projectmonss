import { BreedingLab } from "@/components/breeding-lab"
import { NetworkInfo } from "@/components/network-info"
import Image from "next/image"
import Link from "next/link"

export default function BreedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-700 py-12">
      <header className="container mx-auto py-6 px-4 mb-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
              alt="Momon Logo"
              width={62}
              height={62}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-yellow-300">BNBMonster NFT</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-300">Лаборатория Разведения</h1>
        <p className="text-xl text-center text-yellow-200 mb-12 max-w-3xl mx-auto">
          Скрещивайте своих монстров для создания новых уникальных существ с комбинированными характеристиками.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <div className="bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
              <BreedingLab />
            </div>
          </div>
          <div>
            <NetworkInfo />
          </div>
        </div>
      </div>
    </div>
  )
}

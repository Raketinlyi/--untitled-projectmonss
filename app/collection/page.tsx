import { MonsterCollection } from "@/components/monster-collection"
import Image from "next/image"
import Link from "next/link"

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-700 py-12">
      <header className="container mx-auto py-6 px-4 mb-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
              alt="BNB Logo"
              width={62}
              height={62}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-yellow-400">BNBMonster NFT</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
              alt="BNB Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-4xl font-bold text-yellow-400">BNBMonster NFT</h1>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">Коллекция Монстров</h1>
        <p className="text-xl text-center text-yellow-200 mb-12 max-w-3xl mx-auto">
          Просмотрите вашу коллекцию уникальных BNB монстров. У каждого своя индивидуальность и характеристики.
        </p>

        <MonsterCollection />
      </div>
    </div>
  )
}

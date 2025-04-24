"use client"

import Image from "next/image"
import { MONAD_TESTNET_CONFIG } from "@/lib/wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function NetworkInfo() {
  return (
    <Card className="bg-black/30 border-none backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-d32hBpROUhubCe7Q2v3TjQIcJmDd8U.png"
          alt="Momon Logo"
          width={49}
          height={49}
          className="object-contain"
        />
        <div>
          <CardTitle>Network Information</CardTitle>
          <CardDescription>MonadMonster NFT runs on the Monad Testnet</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network:</span>
            <span className="font-medium text-white">{MONAD_TESTNET_CONFIG.chainName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Chain ID:</span>
            <span className="font-medium text-white">{Number.parseInt(MONAD_TESTNET_CONFIG.chainId, 16)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Currency:</span>
            <span className="font-medium text-white">{MONAD_TESTNET_CONFIG.nativeCurrency.symbol}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full text-gray-400 border-gray-700 hover:bg-gray-800"
            onClick={() => {
              try {
                window.open("https://docs.monad.xyz/network-information", "_blank")
              } catch (error) {
                console.error("Failed to open external link:", error)
              }
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

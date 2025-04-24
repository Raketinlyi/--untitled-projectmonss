"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-connect"
import { useI18n } from "@/lib/i18n-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function WalletConnect() {
  const { address, isConnecting, error, connectWallet, disconnectWallet, clearError } = useWallet()
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [truncatedAddress, setTruncatedAddress] = useState("")
  const { locale } = useI18n()

  // Локализованные тексты
  const texts = {
    connect: locale === "ru" ? "Подключить кошелек" : "Connect Wallet",
    connecting: locale === "ru" ? "Подключение..." : "Connecting...",
    connectionError: locale === "ru" ? "Ошибка подключения" : "Connection Error",
    errorDescription:
      locale === "ru"
        ? "Возникла проблема при подключении к вашему кошельку."
        : "There was a problem connecting to your wallet.",
    metamaskError:
      locale === "ru"
        ? "Пожалуйста, убедитесь, что MetaMask установлен и разблокирован."
        : "Please make sure MetaMask is installed and unlocked.",
    close: locale === "ru" ? "Закрыть" : "Close",
  }

  // Format address for display
  useEffect(() => {
    if (address) {
      setTruncatedAddress(`${address.substring(0, 6)}...${address.substring(address.length - 4)}`)
    } else {
      setTruncatedAddress("")
    }
  }, [address])

  // Show error dialog when error occurs
  useEffect(() => {
    if (error) {
      setIsErrorDialogOpen(true)
    }
  }, [error])

  // Handle connection with proper error handling
  const handleConnect = async () => {
    try {
      if (address) {
        disconnectWallet()
      } else {
        const result = await connectWallet()

        // Don't show any error if user rejected the request
        if (result && result.userRejected) {
          console.log("User rejected the connection - no action needed")
        }
      }
    } catch (error) {
      console.error("Unexpected error in wallet connection handler:", error)
      // We don't need to show this error to the user as the hook will handle it
    }
  }

  // Handle error dialog close
  const handleErrorDialogClose = () => {
    setIsErrorDialogOpen(false)
    clearError()
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        variant={address ? "default" : "outline"}
        className={
          address
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "border-purple-500 text-purple-300 hover:bg-purple-500/20"
        }
        disabled={isConnecting}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? texts.connecting : address ? truncatedAddress : texts.connect}
      </Button>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={handleErrorDialogClose}>
        <DialogContent className="bg-black/80 border border-red-500/50 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              {texts.connectionError}
            </DialogTitle>
            <DialogDescription className="text-gray-300">{texts.errorDescription}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-red-300">{error}</p>
            <p className="mt-2 text-sm text-gray-400">
              {error?.includes("rejected")
                ? locale === "ru"
                  ? "Вы отклонили запрос на подключение."
                  : "You rejected the connection request."
                : texts.metamaskError}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleErrorDialogClose}>{texts.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

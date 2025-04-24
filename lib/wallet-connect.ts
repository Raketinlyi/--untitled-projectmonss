"use client"

import { useState, useCallback } from "react"

// Monad Testnet configuration
export const MONAD_TESTNET_CONFIG = {
  chainId: "0x1657", // Chain ID in hex (5719 in decimal)
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.testnet.monad.xyz/"],
  blockExplorerUrls: ["https://explorer.testnet.monad.xyz/"],
}

export type WalletState = {
  address: string | null
  chainId: string | null
  isConnecting: boolean
  error: string | null
  ownedNFTs: string[]
}

export type ConnectWalletResult = {
  success: boolean
  userRejected?: boolean
  error?: string
}

// Wallet hook with MetaMask integration
export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,
    ownedNFTs: [],
  })

  // Connect wallet function
  const connectWallet = useCallback(async (): Promise<ConnectWalletResult> => {
    if (typeof window === "undefined") {
      return {
        success: false,
        error: "Browser environment required",
      }
    }

    if (!window.ethereum) {
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "MetaMask is not installed. Please install MetaMask to connect your wallet.",
      }))

      return {
        success: false,
        error: "MetaMask is not installed",
      }
    }

    setWalletState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }))

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned")
      }

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      })

      // For demo purposes, simulate owning some NFTs when connected
      const mockNFTs = ["1", "3"] // Simulate owning NFT IDs 1 and 3

      setWalletState({
        address: accounts[0],
        chainId,
        isConnecting: false,
        error: null,
        ownedNFTs: mockNFTs,
      })

      return { success: true }
    } catch (error: any) {
      // Don't show error for user rejection (code 4001)
      if (error.code === 4001) {
        console.log("User rejected the connection request - this is normal behavior")

        setWalletState((prev) => ({
          ...prev,
          isConnecting: false,
          error: null, // Don't set an error for user rejection
        }))

        return {
          success: false,
          userRejected: true,
        }
      }

      // For other errors, log and set the error state
      console.error("Wallet connection error:", error)
      const errorMessage = error.message || "Connection failed"

      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }))

      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [])

  // Disconnect function
  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      chainId: null,
      isConnecting: false,
      error: null,
      ownedNFTs: [],
    })
  }, [])

  // Clear error function
  const clearError = useCallback(() => {
    setWalletState((prev) => ({
      ...prev,
      error: null,
    }))
  }, [])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    clearError,
    isCorrectNetwork: walletState.chainId === MONAD_TESTNET_CONFIG.chainId,
  }
}

// Add type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, listener: (...args: any[]) => void) => void
      removeListener: (eventName: string, listener: (...args: any[]) => void) => void
    }
  }
}

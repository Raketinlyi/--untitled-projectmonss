"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

type PawPrint = {
  id: number
  x: number
  y: number
  rotation: number
  size: number
}

// Add global variable for controlling paw prints
// This allows other components to disable paw prints
let pawPrintsEnabled = true

// Export functions for controlling paw prints
export function disablePawPrints() {
  pawPrintsEnabled = false
}

export function enablePawPrints() {
  pawPrintsEnabled = true
}

export function PawPrints() {
  const [pawPrints, setPawPrints] = useState<PawPrint[]>([])
  const maxPrints = 15 // Reduced for better mobile performance
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle both mouse clicks and touch events
  const handleInteraction = useCallback((clientX: number, clientY: number, target: EventTarget | null) => {
    try {
      // Check if paw prints are enabled
      if (!pawPrintsEnabled) return

      // Don't add paw prints when interacting with buttons or interactive elements
      if (
        target instanceof HTMLButtonElement ||
        target instanceof HTMLAnchorElement ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.closest('[role="button"]'))
      ) {
        return
      }

      const newPawPrint: PawPrint = {
        id: Date.now(),
        x: clientX,
        y: clientY,
        rotation: Math.random() * 60 - 30, // Random rotation between -30 and 30 degrees
        size: Math.random() * 20 + 30, // Random size between 30 and 50px
      }

      setPawPrints((prev) => {
        // Add new paw print and remove oldest if we exceed the maximum
        const updated = [...prev, newPawPrint]
        if (updated.length > maxPrints) {
          return updated.slice(1)
        }
        return updated
      })
    } catch (error) {
      console.error("Error in paw print handler:", error)
    }
  }, [])

  // Mouse click handler
  const handleClick = useCallback(
    (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY, e.target)
    },
    [handleInteraction],
  )

  // Touch handler for mobile
  const handleTouch = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        handleInteraction(touch.clientX, touch.clientY, e.target)
      }
    },
    [handleInteraction],
  )

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("click", handleClick)
    window.addEventListener("touchstart", handleTouch)

    return () => {
      window.removeEventListener("click", handleClick)
      window.removeEventListener("touchstart", handleTouch)
    }
  }, [handleClick, handleTouch])

  // Remove paw prints after a delay and limit maximum number
  useEffect(() => {
    if (pawPrints.length === 0) return

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Remove oldest paw print after delay
    timerRef.current = setTimeout(() => {
      setPawPrints((prev) => {
        // Only remove if we still have paw prints
        if (prev.length > 0) {
          return prev.slice(1)
        }
        return prev
      })
    }, 3000)

    // Limit maximum number of paw prints for performance
    if (pawPrints.length > maxPrints) {
      setPawPrints((prev) => prev.slice(-maxPrints))
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [pawPrints, maxPrints])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {pawPrints.map((paw) => (
          <motion.div
            key={paw.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              left: `${paw.x - paw.size / 2}px`,
              top: `${paw.y - paw.size / 2}px`,
              width: `${paw.size}px`,
              height: `${paw.size}px`,
              transform: `rotate(${paw.rotation}deg)`,
            }}
            className="flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
              <circle cx="20" cy="15" r="10" fill="rgba(255, 204, 0, 0.6)" />
              <circle cx="40" cy="10" r="10" fill="rgba(255, 204, 0, 0.6)" />
              <circle cx="60" cy="15" r="10" fill="rgba(255, 204, 0, 0.6)" />
              <circle cx="80" cy="25" r="10" fill="rgba(255, 204, 0, 0.6)" />
              <ellipse cx="40" cy="70" rx="25" ry="25" fill="rgba(255, 204, 0, 0.6)" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

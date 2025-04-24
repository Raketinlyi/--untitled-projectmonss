"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useSound } from "./sound-manager"

export function SoundToggle() {
  const { toggleMute, isMuted } = useSound()

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
      aria-label={isMuted ? "Включить звук" : "Выключить звук"}
    >
      {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
    </button>
  )
}

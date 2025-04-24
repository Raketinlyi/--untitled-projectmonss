"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Smartphone, Battery, Vibrate, Volume, Music } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

// Добавляем новые пропсы для обработки открытия/закрытия меню
interface GameSettingsProps {
  onSettingsChange: (settings: GameSettings) => void
  initialSettings: GameSettings
  onSettingsOpen?: () => void
  onSettingsClose?: () => void
}

// Удаляем настройку hitboxSize из интерфейса GameSettings
export interface GameSettings {
  lowPerformanceMode: boolean
  vibrationEnabled: boolean
  soundEnabled: boolean
  volume: number
  musicVolume: number
  tactileFeedbackEnabled?: boolean
}

// Обновляем функцию GameSettings для использования новых пропсов
export function GameSettings({
  onSettingsChange,
  initialSettings,
  onSettingsOpen,
  onSettingsClose,
}: GameSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  // В функции GameSettings удаляем инициализацию hitboxSize
  const [settings, setSettings] = useState<GameSettings>(() => ({
    lowPerformanceMode: initialSettings.lowPerformanceMode ?? false,
    vibrationEnabled: initialSettings.vibrationEnabled ?? true,
    soundEnabled: initialSettings.soundEnabled ?? true,
    volume: initialSettings.volume ?? 0.5,
    musicVolume: initialSettings.musicVolume ?? 0.3,
    tactileFeedbackEnabled: initialSettings.tactileFeedbackEnabled ?? true,
  }))
  const { translations, locale } = useI18n()

  // Оптимизируем функцию getLocalizedText, используя объект с переводами:
  const getLocalizedText = () => {
    const translations = {
      ru: {
        title: "Настройки",
        volume: "Громкость",
        musicVolume: "Громкость музыки",
        lowPerformanceMode: "Режим экономии ресурсов",
        batterySaving: "Экономия заряда батареи",
        language: "Язык",
        russian: "Русский",
        english: "Английский",
        close: "Закрыть",
      },
      en: {
        title: "Settings",
        volume: "Volume",
        musicVolume: "Music Volume",
        lowPerformanceMode: "Low Performance Mode",
        batterySaving: "Saves battery power",
        language: "Language",
        russian: "Russian",
        english: "English",
        close: "Close",
      },
    }

    return translations[locale as keyof typeof translations] || translations.en
  }

  // Локализованные тексты
  const texts = {
    settings: getLocalizedText().title,
    gameSettings: locale === "ru" ? "Настройки игры" : "Game Settings",
    optimizeForMobile: locale === "ru" ? "Оптимизировать для мобильные устройства" : "Optimize for mobile devices",
    hitboxSize: locale === "ru" ? "Размер зоны нажатия" : "Hitbox Size",
    smaller: locale === "ru" ? "Меньше" : "Smaller",
    larger: locale === "ru" ? "Больше" : "Larger",
    lowPerformanceMode: getLocalizedText().lowPerformanceMode,
    saveBattery: getLocalizedText().batterySaving,
    vibration: locale === "ru" ? "Вибрация" : "Vibration",
    vibrationFeedback: locale === "ru" ? "Тактильная обратная связь" : "Tactile feedback",
    sound: locale === "ru" ? "Звук" : "Sound",
    gameSound: locale === "ru" ? "Звуки игры" : "Game sounds",
    volume: getLocalizedText().volume,
    musicVolume: getLocalizedText().musicVolume,
    quieter: locale === "ru" ? "Тише" : "Quieter",
    louder: locale === "ru" ? "Громче" : "Louder",
    apply: locale === "ru" ? "Применить" : "Apply",
    cancel: locale === "ru" ? "Отмена" : "Cancel",
    iosAudioFeedback:
      locale === "ru"
        ? "На iOS используется аудио-тактильная обратная связь"
        : "Audio-tactile feedback is used on iOS devices",
  }

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onSettingsChange(settings)
    setIsOpen(false)
  }

  // Обновляем обработчик открытия/закрытия диалога
  const handleOpenChange = (open: boolean) => {
    if (open && onSettingsOpen) {
      onSettingsOpen()
    } else if (!open && onSettingsClose) {
      onSettingsClose()
    }
    setIsOpen(open)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOpenChange(true)}
        className="bg-black/40 text-white hover:bg-black/60 w-10 h-10 p-0"
        aria-label={texts.settings}
      >
        <Settings className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-black/90 border border-purple-500/50 text-white max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-400" />
              {texts.gameSettings}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Громкость */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Volume className="w-4 h-4 text-blue-400" />
                  <Label className="text-white text-sm">{texts.volume}</Label>
                </div>
                <span className="text-xs text-gray-400">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={([value]) => handleSettingChange("volume", value)}
                className="flex-1"
              />
            </div>

            {/* Громкость музыки */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-green-400" />
                  <Label className="text-white text-sm">{texts.musicVolume}</Label>
                </div>
                <span className="text-xs text-gray-400">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <Slider
                value={[settings.musicVolume]}
                min={0}
                max={0.3}
                step={0.05}
                onValueChange={([value]) => handleSettingChange("musicVolume", value)}
                className="flex-1"
              />
            </div>

            {/* Переключатели в одну линию */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-green-400" />
                    <Label className="text-white text-xs">{texts.lowPerformanceMode}</Label>
                  </div>
                  <Switch
                    checked={settings.lowPerformanceMode}
                    onCheckedChange={(checked) => handleSettingChange("lowPerformanceMode", checked)}
                    className="scale-75"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Vibrate className="w-3 h-3 text-yellow-400" />
                    <Label className="text-white text-xs">{texts.vibration}</Label>
                  </div>
                  <Switch
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(checked) => handleSettingChange("vibrationEnabled", checked)}
                    className="scale-75"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
              {texts.cancel}
            </Button>
            <Button onClick={handleApply} className="bg-purple-600 hover:bg-purple-700" size="sm">
              {texts.apply}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

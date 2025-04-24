export interface GameSettings {
  lowPerformanceMode: boolean
  vibrationEnabled: boolean
  soundEnabled: boolean
  volume: number
  musicVolume: number
  tactileFeedbackEnabled?: boolean
  hitboxSize?: number // Добавляем это свойство, которое используется в других местах
}

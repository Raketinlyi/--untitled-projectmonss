/**
 * Утилиты для обработки ошибок в приложении
 */

// Логирование ошибок с дополнительным контекстом
export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  console.error(`[Error${context ? ` in ${context}` : ""}]: ${errorMessage}`, stack ? { stack } : "")
}

// Безопасное выполнение функции с обработкой ошибок
export async function safeExecute<T>(fn: () => Promise<T>, fallback: T, errorContext?: string): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    logError(error, errorContext)
    return fallback
  }
}

// Безопасное выполнение синхронной функции
export function safeExecuteSync<T>(fn: () => T, fallback: T, errorContext?: string): T {
  try {
    return fn()
  } catch (error) {
    logError(error, errorContext)
    return fallback
  }
}

// Проверка доступности браузерного API
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

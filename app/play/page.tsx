import { Button } from "@/components/ui/button"
import { CrazyGame } from "@/components/crazy-game"
import { BnbMonsterLogo } from "@/components/bnb-monster-logo"

export default function PlayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <BnbMonsterLogo className="h-16 w-auto mb-4" />
        <h1 className="text-3xl font-bold text-center text-yellow-400">Играйте и зарабатывайте BNB!</h1>
        <p className="text-center text-yellow-200 mt-2 max-w-2xl">
          Защитите свою базу от монстров, собирайте BNB-монеты и получайте реальные токены за свои достижения!
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <CrazyGame />
      </div>

      <div className="mt-12 max-w-2xl mx-auto bg-yellow-900/50 p-6 rounded-lg border border-yellow-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Как заработать BNB в игре</h2>
        <ul className="list-disc list-inside text-yellow-200 space-y-2">
          <li>Уничтожайте монстров золотыми снарядами - каждый монстр приносит BNB</li>
          <li>Собирайте бонусы-монеты, появляющиеся во время игры</li>
          <li>Побеждайте боссов для получения большего количества BNB</li>
          <li>Создавайте длинные комбо для увеличения множителя наград</li>
          <li>Достигайте высоких уровней для разблокировки специальных наград</li>
        </ul>

        <h2 className="text-2xl font-bold text-yellow-400 mt-6 mb-4">Вывод заработанных токенов</h2>
        <p className="text-yellow-200 mb-4">
          Подключите свой BNB кошелек, чтобы автоматически получать заработанные токены после каждой игры. Минимальная
          сумма для вывода составляет 0.01 BNB.
        </p>

        <div className="mt-4 text-center">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Подключить кошелек</Button>
        </div>
      </div>
    </div>
  )
}

import type React from "react"

interface Monster {
  id: number
  name: string
  description: string
  imageUrl: string
}

interface MonsterCardProps {
  monster: Monster
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center">
      <img
        src={monster.imageUrl || "/placeholder.svg"}
        alt={monster.name}
        className="w-32 h-32 rounded-full object-cover mb-4"
      />
      <h2 className="text-2xl font-bold text-center mb-2">{monster.name}</h2>
      <div className="text-lg text-center text-white">{monster.description}</div>
    </div>
  )
}

export default MonsterCard

import type React from "react"

interface MonsterDetailProps {
  monster: {
    name: string
    description: string
    imageUrl: string
  }
}

const MonsterDetail: React.FC<MonsterDetailProps> = ({ monster }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{monster.name}</h2>
      <img
        src={monster.imageUrl || "/placeholder.svg"}
        alt={monster.name}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <p className="text-lg md:text-xl">{monster.description}</p>
    </div>
  )
}

export default MonsterDetail

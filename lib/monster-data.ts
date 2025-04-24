import type { Locale } from "@/lib/i18n"

export interface Monster {
  id: string
  name: string
  image: string
  rarity: string
  price?: string
  traits: string[]
  description: Record<Locale, string>
}

export const monsters: Monster[] = [
  {
    id: "1",
    name: "Greeny",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c95ef971-ca36-4990-85f5-0964bdcfd12f-1xiPm83iAhP9X4ZXHqQcxK7qd8JhIh.png",
    rarity: "Common",
    price: "0.05 MON",
    traits: ["happy", "energetic", "friendly"],
    description: {
      en: "The happiest MonadMonster with lime energy and boundless enthusiasm!",
      ru: "Самый счастливый MonadMonster с лаймовой энергией и безграничным энтузиазмом!",
      es: "¡El MonadMonster más feliz con energía de lima y entusiasmo sin límites!",
      fr: "Le MonadMonster le plus heureux avec une énergie de citron vert et un enthousiasme sans limites !",
      de: "Das glücklichste MonadMonster mit Limettenenergie und grenzenlosem Enthusiasmus!",
      it: "Il MonadMonster più felice con energia lime ed entusiasmo senza limiti!",
      zh: "最快乐的MonadMonster，拥有青柠能量和无限热情！",
      uk: "Найщасливіший MonadMonster з лаймовою енергією та безмежним ентузіазмом!",
      ar: "أسعد MonadMonster مع طاقة الليمون وحماس لا حدود له!",
      hi: "सबसे खुश MonadMonster लाइम ऊर्जा और असीमित उत्साह के साथ!",
    },
  },
  {
    id: "2",
    name: "Aqua",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8ac455a5-48b0-48fc-b281-e0f65f7f2c6d-SNetSWqdmtDR4gISf6L1B2txMQdbEb.png",
    rarity: "Uncommon",
    price: "0.08 MON",
    traits: ["calm", "wise", "mysterious"],
    description: {
      en: "The chill MonadMonster with laid-back vibes and ocean wisdom.",
      ru: "Спокойный MonadMonster с расслабленной атмосферой и мудростью океана.",
      es: "El MonadMonster relajado con vibras tranquilas y sabiduría oceánica.",
      fr: "Le MonadMonster détendu avec des vibrations relaxantes et la sagesse de l'océan.",
      de: "Das entspannte MonadMonster mit lässigen Vibes und Ozeanweisheit.",
      it: "Il MonadMonster rilassato con vibrazioni tranquille e saggezza oceanica.",
      zh: "冷静的MonadMonster，带有轻松的氛围和海洋的智慧。",
      uk: "Спокійний MonadMonster з розслабленою атмосферою та мудрістю океану.",
      ar: "وحش MonadMonster الهادئ مع أجواء مريحة وحكمة المحيط.",
      hi: "शांत MonadMonster आराम से माहौल और समुद्र की बुद्धि के साथ।",
    },
  },
  // Add the rest of the monsters here...
]

export function getMonsterById(id: string): Monster | undefined {
  return monsters.find((monster) => monster.id === id)
}

export function getMonsterDescription(monster: Monster, locale: Locale): string {
  return monster.description[locale] || monster.description.en
}

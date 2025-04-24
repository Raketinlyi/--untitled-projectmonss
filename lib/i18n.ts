// Update the Locale type to match our language options
// Найдем и изменим тип Locale, чтобы русский был последним
export type Locale = "en" | "es" | "fr" | "de" | "it" | "zh" | "uk" | "ar" | "hi" | "ru"

// Структура переводов
export interface Translations {
  common: {
    connectWallet: string
    crazyGame: string
    home: string
    collection: string
    breed: string
    marketplace: string
    language: string
    learnMore: string
  }
  hero: {
    title: string
    subtitle: string
    exploreButton: string
    breedButton: string
  }
  sections: {
    featuredMonsters: string
    breedingLab: string
    aboutTitle: string
    aboutText1: string
    aboutText2: string
  }
  footer: {
    copyright: string
    warning: string
    poweredBy: string
    aboutProject: string
    links: string
    joinUs: string
    home: string
    game: string
    marketplace: string
    activateWindows: string
    activateWindowsHint: string
  }
  game: {
    title: string
    subtitle: string
    howToPlay: string
    tapMonsters: string
    tapProjectiles: string
    healthPoints: string
    startGame: string
    points: string
    boss: string
    bossDescription: string
  }
  tokenomics: {
    title: string
    quote1: string
    quote2: string
    collection: string
    token: string
    blockchain: string
    totalSupply: string
    fast: string
    burnMechanics: string
    mustBeBurned: string
    noNewNFTs: string
    deflationary: string
    lockedInside: string
    earnedThrough: string
    learnMore: string
  }
  breeding: {
    title: string
    demoMode: string
    connectWallet: string
    parent: string
    demoMonster: string
    rules: string
    rule1: string
    rule2: string
    rule3: string
    rule4: string
  }
  monsters: {
    viewDetails: string
    traits: {
      happy: string
      energetic: string
      friendly: string
      calm: string
      wise: string
      mysterious: string
      wild: string
      hungry: string
      chaotic: string
      sassy: string
      stylish: string
      smooth: string
      excited: string
      playful: string
      mischievous: string
    }
  }
}

// Английские переводы (базовые)
export const en: Translations = {
  common: {
    connectWallet: "Connect Wallet",
    crazyGame: "CRAZY GAME",
    home: "Home",
    collection: "Collection",
    breed: "Breed",
    marketplace: "Marketplace",
    language: "Language",
    learnMore: "Learn More",
  },
  hero: {
    title: "Collect, Breed & Trade Crazy MonadMonster NFTs",
    subtitle:
      "Enter the psychedelic world of MonadMonster monsters - unique NFTs powered by Monad blockchain technology.",
    exploreButton: "Explore Collection",
    breedButton: "Start Breeding",
  },
  sections: {
    featuredMonsters: "Featured MonadMonsters",
    breedingLab: "Breeding Lab",
    aboutTitle: "About MonadMonster NFTs",
    aboutText1:
      "MonadMonster is a collection of charismatic monster NFTs inspired by surrealism and street art. Each MonadMonster is a hybrid creature combining elements of the crypto world with cartoon chaos.",
    aboutText2:
      "Their bodies resemble inflated memcoins covered with graffiti, blockchain code, and Monad symbols. Their eyes glow with digital patterns, and their mouths are portals to the metaverse. MOMON is also a meme coin with real utility!",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. All rights reserved. Powered by",
    warning: "Warning: This site may cause excessive happiness and spontaneous dancing",
    poweredBy: "Monad",
    aboutProject: "About Project",
    links: "Links",
    joinUs: "Join Us",
    home: "Home",
    game: "Game",
    marketplace: "Marketplace",
    activateWindows: "Activate Windows",
    activateWindowsHint: "To activate Windows, go to 'Settings'",
  },
  game: {
    title: "Monster Catcher",
    subtitle: "Catch monsters to earn MOMON coins!",
    howToPlay: "How to Play",
    tapMonsters: "Tap monsters to catch them",
    tapProjectiles: "Tap slime projectiles to destroy them",
    healthPoints: "You have 3 health points - be careful!",
    startGame: "START GAME",
    points: "pts",
    boss: "MEGA MOMON BOSS",
    bossDescription: "This powerful boss requires multiple hits to defeat!",
  },
  tokenomics: {
    title: "Tokenomics",
    quote1: "Coins belong to monsters, but monsters are not eternal. Only those ready for sacrifice will gain power.",
    quote2:
      "Monsters guard the treasure, but they won't share it for free. Choose wisely – burn, play, or trade, for in the world of Momon, nothing lasts forever.",
    collection: "Collection: MonadMonsters",
    token: "Token: Momon (MOMON)",
    blockchain: "Blockchain: Monad",
    totalSupply: "total supply",
    fast: "Fast, secure, and scalable",
    burnMechanics: "Burn Mechanics",
    mustBeBurned: "To claim tokens, NFTs must be burned",
    noNewNFTs: "No new NFTs can be minted, only obtained through a bridge mechanism",
    deflationary: "Tokens will constantly burn for various actions, creating a deflationary economy",
    lockedInside: "Locked inside NFTs",
    earnedThrough: "Earned through gameplay",
    learnMore: "Learn More About Tokenomics",
  },
  breeding: {
    title: "Breeding Lab",
    demoMode: "Demo Mode",
    connectWallet: "Connect your wallet to breed with your own MonadMonster monsters.",
    parent: "Parent",
    demoMonster: "Demo Monster",
    rules: "Breeding Rules",
    rule1: "You must own at least 2 different MonadMonster monsters in your wallet to breed",
    rule2: "Breeding creates a new unique monster with traits from both parents",
    rule3: "Each breeding costs MOMON tokens (part of the deflationary mechanism)",
    rule4: "Rarer parents have a higher chance of producing rare offspring",
  },
  monsters: {
    viewDetails: "View Details",
    traits: {
      happy: "Happy",
      energetic: "Energetic",
      friendly: "Friendly",
      calm: "Calm",
      wise: "Wise",
      mysterious: "Mysterious",
      wild: "Wild",
      hungry: "Hungry",
      chaotic: "Chaotic",
      sassy: "Sassy",
      stylish: "Stylish",
      smooth: "Smooth",
      excited: "Excited",
      playful: "Playful",
      mischievous: "Mischievous",
    },
  },
}

// Hindi translations
export const hi: Translations = {
  common: {
    connectWallet: "वॉलेट कनेक्ट करें",
    crazyGame: "पागल गेम",
    home: "होम",
    collection: "संग्रह",
    breed: "प्रजनन",
    marketplace: "मार्केटप्लेस",
    language: "भाषा",
    learnMore: "और जानें",
  },
  hero: {
    title: "क्रेज़ी MonadMonster NFT इकट्ठा करें, प्रजनन करें और व्यापार करें",
    subtitle: "MonadMonster राक्षसों की मनोवैज्ञानिक दुनिया में प्रवेश करें - मोनाड ब्लॉकचेन तकनीक द्वारा संचालित अद्वितीय NFT।",
    exploreButton: "संग्रह का अन्वेषण करें",
    breedButton: "प्रजनन शुरू करें",
  },
  sections: {
    featuredMonsters: "विशेष MonadMonster",
    breedingLab: "प्रजनन प्रयोगशाला",
    aboutTitle: "MonadMonster NFT के बारे में",
    aboutText1:
      "MonadMonster अतियथार्थवाद और स्ट्रीट आर्ट से प्रेरित करिश्माई राक्षस NFT का एक संग्रह है। प्रत्येक MonadMonster एक हाइब्रिड प्राणी है जो क्रिप्टो दुनिया के तत्वों को कार्टून अराजकता के साथ जोड़ता है।",
    aboutText2:
      "उनके शरीर ग्राफिटी, ब्लॉकचेन कोड और मोनाड प्रतीकों से ढके हुए फूले हुए मेमकॉइन्स जैसे दिखते हैं। उनकी आंखें डिजिटल पैटर्न के साथ चमकती हैं, और उनके मुंह मेटावर्स के द्वार हैं।",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT। सर्वाधिकार सुरक्षित। द्वारा संचालित",
    warning: "चेतावनी: यह साइट अत्यधिक खुशी और स्वतःस्फूर्त नृत्य का कारण बन सकती है",
    poweredBy: "मोनाड",
    aboutProject: "परियोजना के बारे में",
    links: "लिंक",
    joinUs: "हमसे जुड़ें",
    home: "होम",
    game: "खेल",
    marketplace: "मार्केटप्लेस",
    activateWindows: "विंडोज सक्रिय करें",
    activateWindowsHint: "विंडोज सक्रिय करने के लिए, 'सेटिंग' पर जाएं",
  },
  game: {
    title: "मॉन्स्टर कैचर",
    subtitle: "MOMON सिक्के कमाने के लिए मॉन्स्टर पकड़ें!",
    howToPlay: "कैसे खेलें",
    tapMonsters: "उन्हें पकड़ने के लिए मॉन्स्टर पर टैप करें",
    tapProjectiles: "उन्हें नष्ट करने के लिए स्लाइम प्रोजेक्टाइल पर टैप करें",
    healthPoints: "आपके पास 3 स्वास्थ्य अंक हैं - सावधान रहें!",
    startGame: "गेम शुरू करें",
    points: "अंक",
    boss: "मेगा MOMON बॉस",
    bossDescription: "इस शक्तिशाली बॉस को हराने के लिए कई हिट की आवश्यकता होती है!",
  },
  tokenomics: {
    title: "टोकनॉमिक्स",
    quote1: "सिक्के राक्षसों के हैं, लेकिन राक्षस अनंत नहीं हैं। केवल वे ही शक्ति प्राप्त करेंगे जो बलिदान के लिए तैयार हैं।",
    quote2:
      "राक्षस खजाने की रक्षा करते हैं, लेकिन वे इसे मुफ्त में साझा नहीं करेंगे। बुद्धिमानी से चुनें - जलाएं, खेलें या व्यापार करें, क्योंकि Momon की दुनिया में, कुछ भी हमेशा के लिए नहीं रहता।",
    collection: "संग्रह: मोनादमॉन्स्टर्स",
    token: "टोकन: Momon (MOMON)",
    blockchain: "ब्लॉकचेन: मोनाड",
    totalSupply: "कुल आपूर्ति",
    fast: "तेज़, सुरक्षित और स्केलेबल",
    burnMechanics: "बर्न मैकेनिक्स",
    mustBeBurned: "टोकन का दावा करने के लिए, NFT को जलाया जाना चाहिए",
    noNewNFTs: "कोई नया NFT नहीं बनाया जा सकता है, केवल ब्रिज मैकेनिज्म के माध्यम से प्राप्त किया जा सकता है",
    deflationary: "टोकन विभिन्न कार्यों के लिए लगातार जलेंगे, जिससे अपस्फीतिकारी अर्थव्यवस्था बनेगी",
    lockedInside: "NFT के अंदर लॉक किया गया",
    earnedThrough: "गेमप्ले के माध्यम से अर्जित",
    learnMore: "टोकनॉमिक्स के बारे में और जानें",
  },
  breeding: {
    title: "प्रजनन प्रयोगशाला",
    demoMode: "डेमो मोड",
    connectWallet: "अपने स्वयं के MonadMonster राक्षसों के साथ प्रजनन करने के लिए अपना वॉलेट कनेक्ट करें।",
    parent: "माता-पिता",
    demoMonster: "डेमो मॉन्स्टर",
    rules: "प्रजनन नियम",
    rule1: "प्रजनन करने के लिए आपके वॉलेट में कम से कम 2 अलग-अलग MonadMonster राक्षस होने चाहिए",
    rule2: "प्रजनन दोनों माता-पिता के लक्षणों के साथ एक नया अद्वितीय राक्षस बनाता है",
    rule3: "प्रत्येक प्रजनन MOMON टोकन का खर्च करता है (अपस्फीतिकारी तंत्र का हिस्सा)",
    rule4: "दुर्लभ माता-पिता के दुर्लभ संतान पैदा करने की अधिक संभावना होती है",
  },
  monsters: {
    viewDetails: "विवरण देखें",
    traits: {
      happy: "खुश",
      energetic: "ऊर्जावान",
      friendly: "मित्रवत",
      calm: "शांत",
      wise: "बुद्धिमान",
      mysterious: "रहस्यमय",
      wild: "जंगली",
      hungry: "भूखा",
      chaotic: "अराजक",
      sassy: "चंचल",
      stylish: "स्टाइलिश",
      smooth: "चिकना",
      excited: "उत्साहित",
      playful: "खेल-खेल में",
      mischievous: "शरारती",
    },
  },
}

// Русские переводы
export const ru: Translations = {
  common: {
    connectWallet: "Подключить Кошелек",
    crazyGame: "БЕЗУМНАЯ ИГРА",
    home: "Главная",
    collection: "Коллекция",
    breed: "Разведение",
    marketplace: "Маркетплейс",
    language: "Язык",
    learnMore: "Узнать Больше",
  },
  hero: {
    title: "Собирай, Разводи и Торгуй Безумными NFT MonadMonster",
    subtitle: "Войдите в психоделический мир монстров MonadMonster - уникальных NFT на блокчейне Monad.",
    exploreButton: "Исследовать Коллекцию",
    breedButton: "Начать Разведение",
  },
  sections: {
    featuredMonsters: "Популярные MonadMonster",
    breedingLab: "Лаборатория Разведения",
    aboutTitle: "О MonadMonster NFT",
    aboutText1:
      "MonadMonster - это коллекция харизматичных монстров-NFT, вдохновленных сюрреализмом и уличным искусством. Каждый MonadMonster - это гибридное существо, сочетающее элементы крипто-мира с мультяшным хаосом.",
    aboutText2:
      "Их тела напоминают надутые мемкоины, покрытые граффити, блокчейн-кодом и символами Monad. Их глаза светятся цифровыми узорами, а рты - это порталы в метавселенную.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. Все права защищены. Работает на",
    warning: "Предупреждение: Этот сайт может вызвать чрезмерное счастье и спонтанные танцы",
    poweredBy: "Monad",
    aboutProject: "О проекте",
    links: "Ссылки",
    joinUs: "Присоединяйтесь к нам",
    home: "Главная",
    game: "Игра",
    marketplace: "Маркетплейс",
    activateWindows: "Активация Windows",
    activateWindowsHint: 'Чтобы активировать Windows, перейдите в раздел "Параметры"',
  },
  game: {
    title: "Ловец Монстров",
    subtitle: "Лови монстров, чтобы заработать монеты МОМОН!",
    howToPlay: "Как Играть",
    tapMonsters: "Нажимай на монстров, чтобы поймать их",
    tapProjectiles: "Нажимай на снаряды слизи, чтобы уничтожить их",
    healthPoints: "У тебя 3 очка здоровья - будь осторожен!",
    startGame: "НАЧАТЬ ИГРУ",
    points: "очк",
    boss: "МЕГА MOMON БОСС",
    bossDescription: "Этот могущественный босс требует нескольких ударов для победы!",
  },
  tokenomics: {
    title: "Токеномика",
    quote1: "Монеты принадлежат монстрам, но монстры не вечны. Только те, кто готов к жертве, обретут силу.",
    quote2:
      "Монстры охраняют сокровище, но не поделятся им бесплатно. Выбирай мудро – сжигай, играй или торгуй, ведь в мире Momon ничто не вечно.",
    collection: "Коллекция: МонадМонстры",
    token: "Токен: Momon (MOMON)",
    blockchain: "Блокчейн: Монад",
    totalSupply: "общий запас",
    fast: "Быстрый, безопасный и масштабируемый",
    burnMechanics: "Механика Сжигания",
    mustBeBurned: "Чтобы получить токены, NFT должны быть сожжены",
    noNewNFTs: "Новые NFT не могут быть созданы, только получены через механизм моста",
    deflationary: "Токены будут постоянно сжигаться для различных действий, создавая дефляционную экономику",
    lockedInside: "Заблокировано в NFT",
    earnedThrough: "Заработано через игровой процесс",
    learnMore: "Узнать Больше о Токеномике",
  },
  breeding: {
    title: "Лаборатория Разведения",
    demoMode: "Демо Режим",
    connectWallet: "Подключите кошелек, чтобы разводить своих монстров MonadMonster.",
    parent: "Родитель",
    demoMonster: "Демо Монстр",
    rules: "Правила Разведения",
    rule1: "Вы должны иметь как минимум 2 разных монстра MonadMonster в кошельке для разведения",
    rule2: "Разведение создает нового уникального монстра с чертами обоих родителей",
    rule3: "Каждое разведение стоит токены МОМОН (часть дефляционного механизма)",
    rule4: "Более редкие родители имеют больший шанс произвести редкое потомство",
  },
  monsters: {
    viewDetails: "Подробнее",
    traits: {
      happy: "Счастливый",
      energetic: "Энергичный",
      friendly: "Дружелюбный",
      calm: "Спокойный",
      wise: "Мудрый",
      mysterious: "Таинственный",
      wild: "Дикий",
      hungry: "Голодный",
      chaotic: "Хаотичный",
      sassy: "Дерзкий",
      stylish: "Стильный",
      smooth: "Гладкий",
      excited: "Возбужденный",
      playful: "Игривый",
      mischievous: "Озорной",
    },
  },
}

// Испанские переводы
export const es: Translations = {
  common: {
    connectWallet: "Conectar Billetera",
    crazyGame: "JUEGO LOCO",
    home: "Inicio",
    collection: "Colección",
    breed: "Criar",
    marketplace: "Mercado",
    language: "Idioma",
    learnMore: "Más Información",
  },
  hero: {
    title: "Colecciona, Cría e Intercambia NFTs Locos de MonadMonster",
    subtitle:
      "Entra en el mundo psicodélico de los monstruos MonadMonster - NFTs únicos impulsados por la tecnología blockchain Monad.",
    exploreButton: "Explorar Colección",
    breedButton: "Comenzar a Criar",
  },
  sections: {
    featuredMonsters: "MonadMonsters Destacados",
    breedingLab: "Laboratorio de Cría",
    aboutTitle: "Acerca de los NFTs MonadMonster",
    aboutText1:
      "MonadMonster es una colección de carismáticos monstruos NFT inspirados en el surrealismo y el arte callejero. Cada MonadMonster es una criatura híbrida que combina elementos del mundo cripto con caos de dibujos animados.",
    aboutText2:
      "Sus cuerpos se asemejan a memcoins infladas cubiertas de grafitis, código blockchain y símbolos de Monad. Sus ojos brillan con patrones digitales y sus bocas son portales al metaverso.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. Todos los derechos reservados. Impulsado por",
    warning: "Advertencia: Este sitio puede causar felicidad excesiva y bailes espontáneos",
    poweredBy: "Monad",
    aboutProject: "Sobre el proyecto",
    links: "Enlaces",
    joinUs: "Únete a nosotros",
    home: "Inicio",
    game: "Juego",
    marketplace: "Mercado",
    activateWindows: "Activar Windows",
    activateWindowsHint: "Para activar Windows, ve a 'Configuración'",
  },
  game: {
    title: "Cazador de Monstruos",
    subtitle: "¡Atrapa monstruos para ganar monedas MOMON!",
    howToPlay: "Cómo Jugar",
    tapMonsters: "Toca los monstruos para atraparlos",
    tapProjectiles: "Toca los proyectiles de limo para destruirlos",
    healthPoints: "Tienes 3 puntos de salud - ¡ten cuidado!",
    startGame: "INICIAR JUEGO",
    points: "pts",
    boss: "MEGA MOMON JEFE",
    bossDescription: "¡Este poderoso jefe requiere múltiples golpes para derrotarlo!",
  },
  tokenomics: {
    title: "Tokenomía",
    quote1:
      "Las monedas pertenecen a los monstruos, pero los monstruos no son eternos. Solo aquellos listos para el sacrificio ganarán poder.",
    quote2:
      "Los monstruos guardan el tesoro, pero no lo compartirán gratis. Elige sabiamente – quema, juega o comercia, porque en el mundo de Momon, nada dura para siempre.",
    collection: "Colección: MonadMonsters",
    token: "Token: Momon (MOMON)",
    blockchain: "Blockchain: Monad",
    totalSupply: "suministro total",
    fast: "Rápido, seguro y escalable",
    burnMechanics: "Mecánicas de Quema",
    mustBeBurned: "Para reclamar tokens, los NFTs deben ser quemados",
    noNewNFTs: "No se pueden acuñar nuevos NFTs, solo se obtienen a través de un mecanismo de puente",
    deflationary: "Los tokens se quemarán constantemente para varias acciones, creando una economía deflacionaria",
    lockedInside: "Bloqueado dentro de NFTs",
    earnedThrough: "Ganado a través del juego",
    learnMore: "Más Información Sobre Tokenomía",
  },
  breeding: {
    title: "Laboratorio de Cría",
    demoMode: "Modo Demo",
    connectWallet: "Conecta tu billetera para criar con tus propios monstruos MonadMonster.",
    parent: "Padre",
    demoMonster: "Monstruo Demo",
    rules: "Reglas de Cría",
    rule1: "Debes poseer al menos 2 monstruos MonadMonster diferentes en tu billetera para criar",
    rule2: "La cría crea un nuevo monstruo único con rasgos de ambos padres",
    rule3: "Cada cría cuesta tokens MOMON (parte del mecanismo deflacionario)",
    rule4: "Los padres más raros tienen una mayor probabilidad de producir descendencia rara",
  },
  monsters: {
    viewDetails: "Ver Detalles",
    traits: {
      happy: "Feliz",
      energetic: "Enérgico",
      friendly: "Amigable",
      calm: "Tranquilo",
      wise: "Sabio",
      mysterious: "Misterioso",
      wild: "Salvaje",
      hungry: "Hambriento",
      chaotic: "Caótico",
      sassy: "Atrevido",
      stylish: "Elegante",
      smooth: "Suave",
      excited: "Emocionado",
      playful: "Juguetón",
      mischievous: "Travieso",
    },
  },
}

// Французские переводы
export const fr: Translations = {
  common: {
    connectWallet: "Connecter le Portefeuille",
    crazyGame: "JEU FOU",
    home: "Accueil",
    collection: "Collection",
    breed: "Reproduction",
    marketplace: "Marché",
    language: "Langue",
    learnMore: "En Savoir Plus",
  },
  hero: {
    title: "Collectionnez, Reproduisez et Échangez des NFT MonadMonster Fous",
    subtitle:
      "Entrez dans le monde psychédélique des monstres MonadMonster - des NFT uniques propulsés par la technologie blockchain Monad.",
    exploreButton: "Explorer la Collection",
    breedButton: "Commencer la Reproduction",
  },
  sections: {
    featuredMonsters: "MonadMonsters en Vedette",
    breedingLab: "Laboratoire de Reproduction",
    aboutTitle: "À propos des NFT MonadMonster",
    aboutText1:
      "MonadMonster est une collection de NFT de monstres charismatiques inspirés par le surréalisme et l'art de rue. Chaque MonadMonster est une créature hybride combinant des éléments du monde crypto avec un chaos de dessin animé.",
    aboutText2:
      "Leurs corps ressemblent à des memcoins gonflés couverts de graffitis, de code blockchain et de symboles Monad. Leurs yeux brillent avec des motifs numériques, et leurs bouches sont des portails vers le métaverse.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. Tous droits réservés. Propulsé par",
    warning: "Avertissement: Ce site peut provoquer un bonheur excessif et des danses spontanées",
    poweredBy: "Monad",
    aboutProject: "À propos du projet",
    links: "Liens",
    joinUs: "Rejoignez-nous",
    home: "Accueil",
    game: "Jeu",
    marketplace: "Marché",
    activateWindows: "Activer Windows",
    activateWindowsHint: "Pour activer Windows, allez dans 'Paramètres'",
  },
  game: {
    title: "Attrapeur de Monstres",
    subtitle: "Attrapez des monstres pour gagner des pièces MOMON!",
    howToPlay: "Comment Jouer",
    tapMonsters: "Tapez sur les monstres pour les attraper",
    tapProjectiles: "Tapez sur les projectiles de slime pour les détruire",
    healthPoints: "Vous avez 3 points de vie - soyez prudent!",
    startGame: "COMMENCER LE JEU",
    points: "pts",
    boss: "MEGA BOSS MOMON",
    bossDescription: "Ce puissant boss nécessite plusieurs coups pour être vaincu!",
  },
  tokenomics: {
    title: "Tokenomie",
    quote1:
      "Les pièces appartiennent aux monstres, mais les monstres ne sont pas éternels. Seuls ceux prêts au sacrifice gagneront du pouvoir.",
    quote2:
      "Les monstres gardent le trésor, mais ne le partageront pas gratuitement. Choisissez judicieusement – brûlez, jouez ou échangez, car dans le monde de Momon, rien ne dure éternellement.",
    collection: "Collection: MonadMonsters",
    token: "Jeton: Momon (MOMON)",
    blockchain: "Blockchain: Monad",
    totalSupply: "offre totale",
    fast: "Rapide, sécurisé et évolutif",
    burnMechanics: "Mécanismes de Combustion",
    mustBeBurned: "Pour réclamer des jetons, les NFT doivent être brûlés",
    noNewNFTs: "Aucun nouveau NFT ne peut être créé, seulement obtenu via un mécanisme de pont",
    deflationary: "Les jetons seront constamment brûlés pour diverses actions, créant une économie déflationniste",
    lockedInside: "Verrouillé à l'intérieur des NFT",
    earnedThrough: "Gagné par le gameplay",
    learnMore: "En Savoir Plus sur la Tokenomie",
  },
  breeding: {
    title: "Laboratoire de Reproduction",
    demoMode: "Mode Démo",
    connectWallet: "Connectez votre portefeuille pour reproduire avec vos propres monstres MonadMonster.",
    parent: "Parent",
    demoMonster: "Monstre Démo",
    rules: "Règles de Reproduction",
    rule1: "Vous devez posséder au moins 2 monstres MonadMonster différents dans votre portefeuille pour reproduire",
    rule2: "La reproduction crée un nouveau monstre unique avec des traits des deux parents",
    rule3: "Chaque reproduction coûte des jetons MOMON (partie du mécanisme déflationniste)",
    rule4: "Les parents plus rares ont une plus grande chance de produire une progéniture rare",
  },
  monsters: {
    viewDetails: "Voir les Détails",
    traits: {
      happy: "Heureux",
      energetic: "Énergique",
      friendly: "Amical",
      calm: "Calme",
      wise: "Sage",
      mysterious: "Mystérieux",
      wild: "Sauvage",
      hungry: "Affamé",
      chaotic: "Chaotique",
      sassy: "Impertinent",
      stylish: "Élégant",
      smooth: "Doux",
      excited: "Excité",
      playful: "Joueur",
      mischievous: "Espiègle",
    },
  },
}

// Немецкие переводы
export const de: Translations = {
  common: {
    connectWallet: "Wallet Verbinden",
    crazyGame: "VERRÜCKTES SPIEL",
    home: "Startseite",
    collection: "Sammlung",
    breed: "Züchten",
    marketplace: "Marktplatz",
    language: "Sprache",
    learnMore: "Mehr Erfahren",
  },
  hero: {
    title: "Sammle, Züchte & Handle mit verrückten MonadMonster NFTs",
    subtitle:
      "Betritt die psychedelische Welt der MonadMonster-Monster - einzigartige NFTs, angetrieben von der Monad-Blockchain-Technologie.",
    exploreButton: "Sammlung Erkunden",
    breedButton: "Züchtung Starten",
  },
  sections: {
    featuredMonsters: "Ausgewählte MonadMonsters",
    breedingLab: "Zuchtlabor",
    aboutTitle: "Über MonadMonster NFTs",
    aboutText1:
      "MonadMonster ist eine Sammlung charismatischer Monster-NFTs, inspiriert von Surrealismus und Straßenkunst. Jedes MonadMonster ist eine Hybridkreatur, die Elemente der Kryptowelt mit Cartoon-Chaos verbindet.",
    aboutText2:
      "Ihre Körper ähneln aufgeblasenen Memcoins, bedeckt mit Graffiti, Blockchain-Code und Monad-Symbolen. Ihre Augen leuchten mit digitalen Mustern, und ihre Münder sind Portale ins Metaversum.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. Alle Rechte vorbehalten. Betrieben von",
    warning: "Warnung: Diese Seite kann übermäßiges Glück und spontanes Tanzen verursachen",
    poweredBy: "Monad",
    aboutProject: "Über das Projekt",
    links: "Links",
    joinUs: "Begleiten Sie uns",
    home: "Startseite",
    game: "Spiel",
    marketplace: "Marktplatz",
    activateWindows: "Windows aktivieren",
    activateWindowsHint: "Um Windows zu aktivieren, gehen Sie zu 'Einstellungen'",
  },
  game: {
    title: "Monsterfänger",
    subtitle: "Fange Monster, um MOMON-Münzen zu verdienen!",
    howToPlay: "Spielanleitung",
    tapMonsters: "Tippe auf Monster, um sie zu fangen",
    tapProjectiles: "Tippe auf Schleimprojektile, um sie zu zerstören",
    healthPoints: "Du hast 3 Lebenspunkte - sei vorsichtig!",
    startGame: "SPIEL STARTEN",
    points: "Pkt",
    boss: "MEGA MOMON BOSS",
    bossDescription: "Dieser mächtige Boss erfordert mehrere Treffer, um besiegt zu werden!",
  },
  tokenomics: {
    title: "Tokenomics",
    quote1:
      "Münzen gehören Monstern, aber Monster sind nicht ewig. Nur diejenigen, die zum Opfer bereit sind, werden Macht erlangen.",
    quote2:
      "Monster bewachen den Schatz, aber sie werden ihn nicht kostenlos teilen. Wähle weise – verbrenne, spiele oder handle, denn in der Welt von Momon hält nichts ewig.",
    collection: "Sammlung: MonadMonsters",
    token: "Token: Momon (MOMON)",
    blockchain: "Blockchain: Monad",
    totalSupply: "Gesamtangebot",
    fast: "Schnell, sicher und skalierbar",
    burnMechanics: "Burn-Mechanismen",
    mustBeBurned: "Um Tokens zu beanspruchen, müssen NFTs verbrannt werden",
    noNewNFTs: "Es können keine neuen NFTs geprägt werden, nur über einen Brückenmechanismus erhalten werden",
    deflationary: "Tokens werden ständig für verschiedene Aktionen verbrannt, was eine deflationäre Wirtschaft schafft",
    lockedInside: "In NFTs eingeschlossen",
    earnedThrough: "Durch Gameplay verdient",
    learnMore: "Mehr über Tokenomics erfahren",
  },
  breeding: {
    title: "Zuchtlabor",
    demoMode: "Demo-Modus",
    connectWallet: "Verbinde dein Wallet, um mit deinen eigenen MonadMonster-Monstern zu züchten.",
    parent: "Elternteil",
    demoMonster: "Demo-Monster",
    rules: "Zuchtregeln",
    rule1: "Du musst mindestens 2 verschiedene MonadMonster-Monster in deinem Wallet besitzen, um zu züchten",
    rule2: "Zucht erzeugt ein neues einzigartiges Monster mit Eigenschaften beider Eltern",
    rule3: "Jede Zucht kostet MOMON-Tokens (Teil des deflationären Mechanismus)",
    rule4: "Seltenere Eltern haben eine höhere Chance, seltenen Nachwuchs zu produzieren",
  },
  monsters: {
    viewDetails: "Details Anzeigen",
    traits: {
      happy: "Glücklich",
      energetic: "Energisch",
      friendly: "Freundlich",
      calm: "Ruhig",
      wise: "Weise",
      mysterious: "Geheimnisvoll",
      wild: "Wild",
      hungry: "Hungrig",
      chaotic: "Chaotisch",
      sassy: "Frech",
      stylish: "Stilvoll",
      smooth: "Sanft",
      excited: "Aufgeregt",
      playful: "Verspielt",
      mischievous: "Schelmisch",
    },
  },
}

// Итальянские переводы
export const it: Translations = {
  common: {
    connectWallet: "Connetti Portafoglio",
    crazyGame: "GIOCO PAZZO",
    home: "Home",
    collection: "Collezione",
    breed: "Allevamento",
    marketplace: "Mercato",
    language: "Lingua",
    learnMore: "Scopri di Più",
  },
  hero: {
    title: "Colleziona, Alleva e Scambia Pazzi NFT MonadMonster",
    subtitle:
      "Entra nel mondo psichedelico dei mostri MonadMonster - NFT unici alimentati dalla tecnologia blockchain Monad.",
    exploreButton: "Esplora Collezione",
    breedButton: "Inizia Allevamento",
  },
  sections: {
    featuredMonsters: "MonadMonster in Evidenza",
    breedingLab: "Laboratorio di Allevamento",
    aboutTitle: "Informazioni sugli NFT MonadMonster",
    aboutText1:
      "MonadMonster è una collezione di carismatici mostri NFT ispirati al surrealismo e all'arte di strada. Ogni MonadMonster è una creatura ibrida che combina elementi del mondo crypto con il caos dei cartoni animati.",
    aboutText2:
      "I loro corpi assomigliano a memcoin gonfiati coperti di graffiti, codice blockchain e simboli Monad. I loro occhi brillano con motivi digitali e le loro bocche sono portali verso il metaverso.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. Tutti i diritti riservati. Alimentato da",
    warning: "Attenzione: Questo sito può causare felicità eccessiva e balli spontanei",
    poweredBy: "Monad",
    aboutProject: "Sul progetto",
    links: "Link",
    joinUs: "Unisciti a noi",
    home: "Home",
    game: "Gioco",
    marketplace: "Mercato",
    activateWindows: "Attiva Windows",
    activateWindowsHint: "Per attivare Windows, vai su 'Impostazioni'",
  },
  game: {
    title: "Acchiappa Mostri",
    subtitle: "Acchiappa mostri per guadagnare monete MOMON!",
    howToPlay: "Come Giocare",
    tapMonsters: "Tocca i mostri per catturarli",
    tapProjectiles: "Tocca i proiettili di slime per distruggerli",
    healthPoints: "Hai 3 punti vita - fai attenzione!",
    startGame: "INIZIA GIOCO",
    points: "pti",
    boss: "MEGA BOSS MOMON",
    bossDescription: "Questo potente boss richiede più colpi per essere sconfitto!",
  },
  tokenomics: {
    title: "Tokenomics",
    quote1:
      "Le monete appartengono ai mostri, ma i mostri non sono eterni. Solo quelli pronti al sacrificio otterranno potere.",
    quote2:
      "I mostri custodiscono il tesoro, ma non lo condivideranno gratuitamente. Scegli saggiamente – brucia, gioca o scambia, perché nel mondo di Momon, nulla dura per sempre.",
    collection: "Collezione: MonadMonsters",
    token: "Token: Momon (MOMON)",
    blockchain: "Blockchain: Monad",
    totalSupply: "offerta totale",
    fast: "Veloce, sicuro e scalabile",
    burnMechanics: "Meccanismi di Bruciatura",
    mustBeBurned: "Per reclamare token, gli NFT devono essere bruciati",
    noNewNFTs: "Non possono essere coniati nuovi NFT, solo ottenuti tramite un meccanismo di bridge",
    deflationary: "I token verranno costantemente bruciati per varie azioni, creando un'economia deflazionistica",
    lockedInside: "Bloccati all'interno degli NFT",
    earnedThrough: "Guadagnati attraverso il gameplay",
    learnMore: "Scopri di Più sulla Tokenomics",
  },
  breeding: {
    title: "Laboratorio di Allevamento",
    demoMode: "Modalità Demo",
    connectWallet: "Connetti il tuo portafoglio per allevare con i tuoi mostri MonadMonster.",
    parent: "Genitore",
    demoMonster: "Mostro Demo",
    rules: "Regole di Allevamento",
    rule1: "Devi possedere almeno 2 diversi mostri MonadMonster nel tuo portafoglio per allevare",
    rule2: "L'allevamento crea un nuovo mostro unico con caratteristiche di entrambi i genitori",
    rule3: "Ogni allevamento costa token MOMON (parte del meccanismo deflazionistico)",
    rule4: "I genitori più rari hanno una maggiore probabilità di produrre prole rara",
  },
  monsters: {
    viewDetails: "Visualizza Dettagli",
    traits: {
      happy: "Felice",
      energetic: "Energico",
      friendly: "Amichevole",
      calm: "Calmo",
      wise: "Saggio",
      mysterious: "Misterioso",
      wild: "Selvaggio",
      hungry: "Affamato",
      chaotic: "Caotico",
      sassy: "Sfacciato",
      stylish: "Elegante",
      smooth: "Liscio",
      excited: "Eccitato",
      playful: "Giocoso",
      mischievous: "Birichino",
    },
  },
}

// Китайские переводы
export const zh: Translations = {
  common: {
    connectWallet: "连接钱包",
    crazyGame: "疯狂游戏",
    home: "首页",
    collection: "收藏",
    breed: "繁殖",
    marketplace: "市场",
    language: "语言",
    learnMore: "了解更多",
  },
  hero: {
    title: "收集、繁殖和交易疯狂的MonadMonster NFT",
    subtitle: "进入MonadMonster怪物的迷幻世界 - 由Monad区块链技术支持的独特NFT。",
    exploreButton: "探索收藏",
    breedButton: "开始繁殖",
  },
  sections: {
    featuredMonsters: "精选MonadMonster",
    breedingLab: "繁殖实验室",
    aboutTitle: "关于MonadMonster NFT",
    aboutText1:
      "MonadMonster是一系列受超现实主义和街头艺术启发的魅力怪物NFT。每个MonadMonster都是一种混合生物，结合了加密世界的元素和卡通混乱。",
    aboutText2:
      "它们的身体类似于被涂鸦、区块链代码和Monad符号覆盖的膨胀memcoin。它们的眼睛闪烁着数字图案，它们的嘴是通往元宇宙的门户。",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT。保留所有权利。由以下提供支持",
    warning: "警告：本网站可能导致过度快乐和自发舞蹈",
    poweredBy: "Monad",
    aboutProject: "关于项目",
    links: "链接",
    joinUs: "加入我们",
    home: "首页",
    game: "游戏",
    marketplace: "市场",
    activateWindows: "激活Windows",
    activateWindowsHint: "要激活Windows，请转到“设置”",
  },
  game: {
    title: "怪物捕手",
    subtitle: "捕捉怪物赚取MOMON币！",
    howToPlay: "如何玩",
    tapMonsters: "点击怪物捕捉它们",
    tapProjectiles: "点击粘液弹射物摧毁它们",
    healthPoints: "你有3点生命值 - 小心！",
    startGame: "开始游戏",
    points: "点",
    boss: "超级MOMON BOSS",
    bossDescription: "这个强大的boss需要多次攻击才能击败！",
  },
  tokenomics: {
    title: "代币经济学",
    quote1: "硬币属于怪物，但怪物并非永恒。只有那些准备好牺牲的人才会获得力量。",
    quote2: "怪物守护着宝藏，但它们不会免费分享。明智选择 – 燃烧、玩耍或交易，因为在Momon的世界里，没有什么是永恒的。",
    collection: "收藏：MonadMonsters",
    token: "代币：Momon (MOMON)",
    blockchain: "区块链：Monad",
    totalSupply: "总供应量",
    fast: "快速、安全和可扩展",
    burnMechanics: "燃烧机制",
    mustBeBurned: "要获取代币，NFT必须被燃烧",
    noNewNFTs: "不能铸造新的NFT，只能通过桥接机制获得",
    deflationary: "代币将不断为各种操作燃烧，创造通缩经济",
    lockedInside: "锁定在NFT内",
    earnedThrough: "通过游戏赚取",
    learnMore: "了解更多关于代币经济学",
  },
  breeding: {
    title: "繁殖实验室",
    demoMode: "演示模式",
    connectWallet: "连接你的钱包，用你自己的MonadMonster怪物繁殖。",
    parent: "父母",
    demoMonster: "演示怪物",
    rules: "繁殖规则",
    rule1: "你必须在钱包中拥有至少2个不同的MonadMonster怪物才能繁殖",
    rule2: "繁殖创造一个具有双亲特征的新独特怪物",
    rule3: "每次繁殖都需要MOMON代币（通缩机制的一部分）",
    rule4: "更稀有的父母有更高的机会产生稀有后代",
  },
  monsters: {
    viewDetails: "查看详情",
    traits: {
      happy: "快乐",
      energetic: "精力充沛",
      friendly: "友好",
      calm: "平静",
      wise: "智慧",
      mysterious: "神秘",
      wild: "野性",
      hungry: "饥饿",
      chaotic: "混乱",
      sassy: "时髦",
      stylish: "时尚",
      smooth: "光滑",
      excited: "兴奋",
      playful: "顽皮",
      mischievous: "淘气",
    },
  },
}

// Арабские переводы
export const ar: Translations = {
  common: {
    connectWallet: "ربط المحفظة",
    crazyGame: "لعبة مجنونة",
    home: "الرئيسية",
    collection: "المجموعة",
    breed: "التكاثر",
    marketplace: "السوق",
    language: "اللغة",
    learnMore: "معرفة المزيد",
  },
  hero: {
    title: "اجمع وكاثر وتداول وحوش MonadMonster المجنونة",
    subtitle: "ادخل إلى عالم وحوش MonadMonster النفسي - رموز NFT فريدة مدعومة بتقنية بلوكتشين موناد.",
    exploreButton: "استكشاف المجموعة",
    breedButton: "ابدأ التكاثر",
  },
  sections: {
    featuredMonsters: "وحوش MonadMonster المميزة",
    breedingLab: "مختبر التكاثر",
    aboutTitle: "حول رموز MonadMonster NFT",
    aboutText1:
      "MonadMonster هي مجموعة من وحوش NFT الكاريزمية المستوحاة من السريالية وفن الشارع. كل MonadMonster هو مخلوق هجين يجمع بين عناصر عالم العملات المشفرة وفوضى الرسوم المتحركة.",
    aboutText2:
      "أجسامهم تشبه عملات الميم المنتفخة المغطاة بالجرافيتي ورموز البلوكتشين ورموز موناد. تتوهج عيونهم بأنماط رقمية، وأفواههم هي بوابات إلى العالم الافتراضي.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. جميع الحقوق محفوظة. مدعوم بواسطة",
    warning: "تحذير: قد يسبب هذا الموقع سعادة مفرطة ورقص عفوي",
    poweredBy: "موناد",
    aboutProject: "عن المشروع",
    links: "روابط",
    joinUs: "انضم إلينا",
    home: "الرئيسية",
    game: "لعبة",
    marketplace: "السوق",
    activateWindows: "تفعيل ويندوز",
    activateWindowsHint: "لتفعيل ويندوز، انتقل إلى 'الإعدادات'",
  },
  game: {
    title: "صياد الوحوش",
    subtitle: "اصطد الوحوش لكسب عملات مومون!",
    howToPlay: "كيفية اللعب",
    tapMonsters: "انقر على الوحوش لاصطيادها",
    tapProjectiles: "انقر على قذائف اللزجة لتدميرها",
    healthPoints: "لديك 3 نقاط صحة - كن حذرًا!",
    startGame: "ابدأ اللعبة",
    points: "نقاط",
    boss: "زعيم MOMON الضخم",
    bossDescription: "يتطلب هذا الزعيم القوي ضربات متعددة لهزيمته!",
  },
  tokenomics: {
    title: "اقتصاديات العملة",
    quote1: "العملات تنتمي للوحوش، لكن الوحوش ليست أبدية. فقط أولئك المستعدون للتضحية سيكتسبون القوة.",
    quote2:
      "الوحوش تحرس الكنز، لكنها لن تشاركه مجانًا. اختر بحكمة - احرق، العب، أو تاجر، لأنه في عالم Momon، لا شيء يدوم للأبد.",
    collection: "المجموعة: وحوش موناد",
    token: "العملة: Momon (MOMON)",
    blockchain: "بلوكتشين: موناد",
    totalSupply: "العرض الإجمالي",
    fast: "سريع وآمن وقابل للتوسع",
    burnMechanics: "آليات الحرق",
    mustBeBurned: "للمطالبة بالعملات، يجب حرق رموز NFT",
    noNewNFTs: "لا يمكن سك رموز NFT جديدة، يتم الحصول عليها فقط من خلال آلية الجسر",
    deflationary: "سيتم حرق العملات باستمرار لإجراءات مختلفة، مما يخلق اقتصادًا انكماشيًا",
    lockedInside: "مقفلة داخل رموز NFT",
    earnedThrough: "تُكتسب من خلال اللعب",
    learnMore: "تعرف على المزيد حول اقتصاديات العملة",
  },
  breeding: {
    title: "مختبر التكاثر",
    demoMode: "وضع العرض التوضيحي",
    connectWallet: "اربط محفظتك للتكاثر مع وحوش MonadMonster الخاصة بك.",
    parent: "الوالد",
    demoMonster: "وحش العرض التوضيحي",
    rules: "قواعد التكاثر",
    rule1: "يجب أن تمتلك على الأقل وحشين MonadMonster مختلفين في محفظتك للتكاثر",
    rule2: "التكاثر يخلق وحشًا جديدًا فريدًا بسمات من كلا الوالدين",
    rule3: "كل تكاثر يكلف عملات مومون (جزء من آلية الانكماش)",
    rule4: "الآباء الأكثر ندرة لديهم فرصة أكبر لإنتاج نسل نادر",
  },
  monsters: {
    viewDetails: "عرض التفاصيل",
    traits: {
      happy: "سعيد",
      energetic: "نشيط",
      friendly: "ودود",
      calm: "هادئ",
      wise: "حكيم",
      mysterious: "غامض",
      wild: "بري",
      hungry: "جائع",
      chaotic: "فوضوي",
      sassy: "جريء",
      stylish: "أنيق",
      smooth: "ناعم",
      excited: "متحمس",
      playful: "مرح",
      mischievous: "شقي",
    },
  },
}

// Украинские переводы (новый язык)
export const uk: Translations = {
  common: {
    connectWallet: "Підключити гаманець",
    crazyGame: "БОЖЕВІЛЬНА ГРА",
    home: "Головна",
    collection: "Колекція",
    breed: "Розведення",
    marketplace: "Маркетплейс",
    language: "Мова",
    learnMore: "Дізнатися більше",
  },
  hero: {
    title: "Збирайте, розводьте та торгуйте божевільними NFT MonadMonster",
    subtitle:
      "Увійдіть у психоделічний світ монстрів MonadMonster - унікальних NFT, що працюють на технології блокчейну Monad.",
    exploreButton: "Дослідити колекцію",
    breedButton: "Почати розведення",
  },
  sections: {
    featuredMonsters: "Вибрані MonadMonster",
    breedingLab: "Лабораторія розведення",
    aboutTitle: "Про NFT MonadMonster",
    aboutText1:
      "MonadMonster - це колекція харизматичних монстрів NFT, натхненних сюрреалізмом та вуличним мистецтвом. Кожен MonadMonster - це гібридна істота, що поєднує елементи крипто-світу з мультяшним хаосом.",
    aboutText2:
      "Їхні тіла нагадують надуті мемкоїни, вкриті графіті, кодом блокчейну та символами Monad. Їхні очі світяться цифровими візерунками, а їхні роти - це портали до метавсесвіту.",
  },
  footer: {
    copyright: "© 2025 MonadMonster NFT. Усі права захищені. Працює на",
    warning: "Попередження: Цей сайт може викликати надмірне щастя та спонтанні танці",
    poweredBy: "Monad",
    aboutProject: "Про проект",
    links: "Посилання",
    joinUs: "Приєднуйтесь до нас",
    home: "Головна",
    game: "Гра",
    marketplace: "Маркетплейс",
    activateWindows: "Активувати Windows",
    activateWindowsHint: 'Щоб активувати Windows, перейдіть до розділу "Параметри"',
  },
  game: {
    title: "Ловець монстрів",
    subtitle: "Ловіть монстрів, щоб заробити монети МОМОН!",
    howToPlay: "Як грати",
    tapMonsters: "Натискайте на монстрів, щоб їх зловити",
    tapProjectiles: "Натискайте на слизові снаряди, щоб їх знищити",
    healthPoints: "У вас є 3 очки здоров'я - будьте обережні!",
    startGame: "ПОЧАТИ ГРУ",
    points: "очк",
    boss: "МЕГА MOMON БОС",
    bossDescription: "Цей могутній бос потребує кількох ударів для перемоги!",
  },
  tokenomics: {
    title: "Токеноміка",
    quote1: "Монети належать монстрам, але монстри не вічні. Тільки ті, хто готовий до жертви, отримають силу.",
    quote2:
      "Монстри охороняють скарб, але не поділяться ним безкоштовно. Вибирайте мудро – спалюйте, грайте або торгуйте, бо у світі Momon ніщо не триває вічно.",
    collection: "Колекція: МонадМонстри",
    token: "Токен: Momon (MOMON)",
    blockchain: "Блокчейн: Монад",
    totalSupply: "загальна пропозиція",
    fast: "Швидкий, безпечний та масштабований",
    burnMechanics: "Механіка спалювання",
    mustBeBurned: "Щоб отримати токени, NFT повинні бути спалені",
    noNewNFTs: "Нові NFT не можуть бути створені, лише отримані через механізм мосту",
    deflationary: "Токени будуть постійно спалюватися для різних дій, створюючи дефляційну економіку",
    lockedInside: "Заблоковано всередині NFT",
    earnedThrough: "Зароблено через геймплей",
    learnMore: "Дізнатися більше про токеноміку",
  },
  breeding: {
    title: "Лабораторія розведення",
    demoMode: "Демо режим",
    connectWallet: "Підключіть свій гаманець для розведення з вашими власними монстрами MonadMonster.",
    parent: "Батько",
    demoMonster: "Демо монстр",
    rules: "Правила розведення",
    rule1: "Ви повинні мати щонайменше 2 різних монстра MonadMonster у своєму гаманці для розведення",
    rule2: "Розведення створює нового унікального монстра з рисами обох батьків",
    rule3: "Кожне розведення коштує токени МОМОН (частина дефляційного механізму)",
    rule4: "Більш рідкісні батьки мають більший шанс створити рідкісне потомство",
  },
  monsters: {
    viewDetails: "Переглянути деталі",
    traits: {
      happy: "Щасливий",
      energetic: "Енергійний",
      friendly: "Дружній",
      calm: "Спокійний",
      wise: "Мудрий",
      mysterious: "Таємничий",
      wild: "Дикий",
      hungry: "Голодний",
      chaotic: "Хаотичний",
      sassy: "Зухвалий",
      stylish: "Стильний",
      smooth: "Гладкий",
      excited: "Захоплений",
      playful: "Грайливий",
      mischievous: "Пустотливий",
    },
  },
}

// In the translations object, include both Chinese and Hindi translations
const translations = {
  en,
  ru,
  es,
  zh,
  uk,
  ar,
  hi,
}

// Function to get translations for a specific locale
export function getTranslations(locale: Locale): Translations {
  return translations[locale] || en
}

export default translations

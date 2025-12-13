import { Feeling, ZodiacSign, Language, Element, Archetype } from './types';

export const TRANSLATIONS = {
  en: {
    // Onboarding
    identifyYourself: "Identify Yourself",
    starsNeedName: "The stars need your name to find you.",
    namePlaceholder: "Enter your name",
    nameLabel: "Name",
    dobLabel: "Date of Birth",
    revealSigns: "Reveal Signs",
    preciseMoment: "Precise Moment",
    calculateAscendant: "To calculate your ascendant path.",
    sunDetected: "Sun Detected",
    tobLabel: "Time of Birth",
    continue: "Continue",
    elementalCore: "Elemental Core",
    forceGov: "Which fundamental force anchors your spirit?",
    theMirror: "The Mirror",
    mirrorVoid: "In the reflection of the void, who stares back?",
    currentState: "Current State",
    spiritResonate: "How does your spirit resonate today?",
    consultStars: "Consult the Stars",
    // Loader
    messages: [
      "Aligning planetary positions...",
      "Analyzing Moon phase...",
      "Calculating numerology matrix...",
      "Reading energetic signature...",
      "Unveiling the veil...",
    ],
    // Card
    dailyGuidance: "Daily Guidance for",
    powerColor: "Power Color:",
    readAnother: "Read Another Soul",
    love: "Love",
    career: "Career",
    vitality: "Vitality",
    // Feelings
    [Feeling.Lost]: "Lost & Drifting",
    [Feeling.Energetic]: "Energetic & Bold",
    [Feeling.SeekingLove]: "Seeking Connection",
    [Feeling.FocusOnMoney]: "Focus on Wealth",
    // Elements
    [Element.Fire]: "Fire (Passion)",
    [Element.Earth]: "Earth (Stability)",
    [Element.Air]: "Air (Intellect)",
    [Element.Water]: "Water (Intuition)",
    // Archetypes
    [Archetype.Warrior]: "The Warrior",
    [Archetype.Healer]: "The Healer",
    [Archetype.Sage]: "The Sage",
    [Archetype.Creator]: "The Creator",
  },
  ru: {
    // Onboarding
    identifyYourself: "Представьтесь",
    starsNeedName: "Звездам нужно ваше имя, чтобы найти вас.",
    namePlaceholder: "Введите ваше имя",
    nameLabel: "Имя",
    dobLabel: "Дата рождения",
    revealSigns: "Раскрыть знаки",
    preciseMoment: "Точный момент",
    calculateAscendant: "Чтобы рассчитать ваш асцендент.",
    sunDetected: "Солнце в знаке",
    tobLabel: "Время рождения",
    continue: "Продолжить",
    elementalCore: "Стихия Души",
    forceGov: "Какая сила управляет вашим духом?",
    theMirror: "Зеркало",
    mirrorVoid: "В отражении пустоты, кто смотрит в ответ?",
    currentState: "Текущее состояние",
    spiritResonate: "Как резонирует ваш дух сегодня?",
    consultStars: "Спросить звезды",
    // Loader
    messages: [
      "Выравнивание положения планет...",
      "Анализ фазы Луны...",
      "Расчет нумерологической матрицы...",
      "Чтение энергетической подписи...",
      "Снятие завесы...",
    ],
    // Card
    dailyGuidance: "Дневное руководство для",
    powerColor: "Цвет силы:",
    readAnother: "Прочитать другую душу",
    love: "Любовь",
    career: "Карьера",
    vitality: "Жизненная сила",
    // Feelings
    [Feeling.Lost]: "Потерянность",
    [Feeling.Energetic]: "Энергичность",
    [Feeling.SeekingLove]: "Поиск любви",
    [Feeling.FocusOnMoney]: "Фокус на деньгах",
    // Elements
    [Element.Fire]: "Огонь (Страсть)",
    [Element.Earth]: "Земля (Стабильность)",
    [Element.Air]: "Воздух (Интеллект)",
    [Element.Water]: "Вода (Интуиция)",
    // Archetypes
    [Archetype.Warrior]: "Воин",
    [Archetype.Healer]: "Целитель",
    [Archetype.Sage]: "Мудрец",
    [Archetype.Creator]: "Творец",
  }
};

export const FEELING_ICONS = {
  [Feeling.Lost]: "🌫️",
  [Feeling.Energetic]: "🔥",
  [Feeling.SeekingLove]: "❤️",
  [Feeling.FocusOnMoney]: "💎",
};

export const ELEMENT_ICONS = {
  [Element.Fire]: "🔥",
  [Element.Earth]: "🌿",
  [Element.Air]: "💨",
  [Element.Water]: "💧",
};

export const ARCHETYPE_ICONS = {
  [Archetype.Warrior]: "⚔️",
  [Archetype.Healer]: "⚕️",
  [Archetype.Sage]: "📜",
  [Archetype.Creator]: "🎨",
};

export const ZODIAC_DATES: { sign: ZodiacSign; start: [number, number]; end: [number, number] }[] = [
  { sign: ZodiacSign.Aquarius, start: [1, 20], end: [2, 18] },
  { sign: ZodiacSign.Pisces, start: [2, 19], end: [3, 20] },
  { sign: ZodiacSign.Aries, start: [3, 21], end: [4, 19] },
  { sign: ZodiacSign.Taurus, start: [4, 20], end: [5, 20] },
  { sign: ZodiacSign.Gemini, start: [5, 21], end: [6, 20] },
  { sign: ZodiacSign.Cancer, start: [6, 21], end: [7, 22] },
  { sign: ZodiacSign.Leo, start: [7, 23], end: [8, 22] },
  { sign: ZodiacSign.Virgo, start: [8, 23], end: [9, 22] },
  { sign: ZodiacSign.Libra, start: [9, 23], end: [10, 22] },
  { sign: ZodiacSign.Scorpio, start: [10, 23], end: [11, 21] },
  { sign: ZodiacSign.Sagittarius, start: [11, 22], end: [12, 21] },
  { sign: ZodiacSign.Capricorn, start: [12, 22], end: [1, 19] },
];

export const ZODIAC_NAMES: Record<Language, Record<ZodiacSign, string>> = {
  en: {
    [ZodiacSign.Aries]: "Aries",
    [ZodiacSign.Taurus]: "Taurus",
    [ZodiacSign.Gemini]: "Gemini",
    [ZodiacSign.Cancer]: "Cancer",
    [ZodiacSign.Leo]: "Leo",
    [ZodiacSign.Virgo]: "Virgo",
    [ZodiacSign.Libra]: "Libra",
    [ZodiacSign.Scorpio]: "Scorpio",
    [ZodiacSign.Sagittarius]: "Sagittarius",
    [ZodiacSign.Capricorn]: "Capricorn",
    [ZodiacSign.Aquarius]: "Aquarius",
    [ZodiacSign.Pisces]: "Pisces",
  },
  ru: {
    [ZodiacSign.Aries]: "Овен",
    [ZodiacSign.Taurus]: "Телец",
    [ZodiacSign.Gemini]: "Близнецы",
    [ZodiacSign.Cancer]: "Рак",
    [ZodiacSign.Leo]: "Лев",
    [ZodiacSign.Virgo]: "Дева",
    [ZodiacSign.Libra]: "Весы",
    [ZodiacSign.Scorpio]: "Скорпион",
    [ZodiacSign.Sagittarius]: "Стрелец",
    [ZodiacSign.Capricorn]: "Козерог",
    [ZodiacSign.Aquarius]: "Водолей",
    [ZodiacSign.Pisces]: "Рыбы",
  }
};

// Cold Reading Templates
export const HEADLINES: Record<Language, string[]> = {
  en: [
    "A Day of Transformation",
    "The Stars Align for You",
    "Shadows Reveal Truths",
    "Cosmic Clarity Awaits",
    "A Moment of Awakening",
    "Silent Whispers of Fate",
    "Energy in Motion",
    "The Universe Speaks",
  ],
  ru: [
    "День трансформации",
    "Звезды выстраиваются для вас",
    "Тени открывают истину",
    "Космическая ясность ждет",
    "Момент пробуждения",
    "Тихий шепот судьбы",
    "Энергия в движении",
    "Вселенная говорит",
  ]
};

export const INSIGHTS: Record<Language, Record<Feeling, string[]>> = {
  en: {
    [Feeling.Lost]: [
      "Neptune shrouds your path today, but this fog is a protective veil. Stand still and let the answers come to you.",
      "The Moon suggests your intuition is your best compass right now. Ignore external noise.",
      "You feel untethered, but this is merely the universe preparing you for a new trajectory. Patience.",
      "Wandering is not wasting time. Today, the void offers you a chance to redefine who you are.",
    ],
    [Feeling.Energetic]: [
      "Mars is fueling your sector of action. Channel this fire into a singular goal to avoid burnout.",
      "The sun illuminates your ambition. Today is the day to push the boulder over the hill.",
      "Your aura is magnetic today. Use this surge to initiate difficult conversations you've been avoiding.",
      "Momentum is on your side, but Mercury warns: check the details before you leap.",
    ],
    [Feeling.SeekingLove]: [
      "Venus enters a playful alignment. Vulnerability is your strength today, not a weakness.",
      "A chance encounter may spark a karmic connection. Keep your heart open but your boundaries firm.",
      "The cosmos asks you to love yourself first. Only then will the mirror reflect what you seek.",
      "Communication in relationships is favored. Speak your truth, but listen with your soul.",
    ],
    [Feeling.FocusOnMoney]: [
      "Saturn favors discipline. A small sacrifice today yields a harvest tomorrow.",
      "Jupiter smiles upon calculated risks, but warns against gambling with what you cannot lose.",
      "Abundance flows when you declutter your financial house. Review your subscriptions and debts.",
      "An opportunity for growth lies hidden in a mundane task. Look closer at your work today.",
    ],
  },
  ru: {
    [Feeling.Lost]: [
      "Нептун скрывает ваш путь сегодня, но этот туман — защитная вуаль. Остановитесь и позвольте ответам прийти.",
      "Луна подсказывает, что ваша интуиция — лучший компас сейчас. Игнорируйте внешний шум.",
      "Вы чувствуете себя потерянным, но это просто вселенная готовит вас к новой траектории. Терпение.",
      "Блуждание — это не пустая трата времени. Сегодня пустота предлагает вам шанс переопределить себя.",
    ],
    [Feeling.Energetic]: [
      "Марс питает ваш сектор действий. Направьте этот огонь на одну цель, чтобы избежать выгорания.",
      "Солнце освещает ваши амбиции. Сегодня тот самый день, чтобы сдвинуть гору.",
      "Ваша аура магнетична сегодня. Используйте этот прилив, чтобы начать трудные разговоры.",
      "Импульс на вашей стороне, но Меркурий предупреждает: проверьте детали, прежде чем действовать.",
    ],
    [Feeling.SeekingLove]: [
      "Венера в игривом расположении. Уязвимость — ваша сила сегодня, а не слабость.",
      "Случайная встреча может зажечь кармическую связь. Держите сердце открытым, но границы твердыми.",
      "Космос просит вас сначала полюбить себя. Только тогда зеркало отразит то, что вы ищете.",
      "Общение в отношениях благоприятно. Говорите свою правду, но слушайте душой.",
    ],
    [Feeling.FocusOnMoney]: [
      "Сатурн благоволит дисциплине. Маленькая жертва сегодня принесет урожай завтра.",
      "Юпитер улыбается расчетливым рискам, но предостерегает от азартных игр с тем, что вы не можете потерять.",
      "Изобилие течет, когда вы наводите порядок в финансах. Пересмотрите свои подписки и долги.",
      "Возможность роста скрыта в рутинной задаче. Присмотритесь внимательнее к своей работе сегодня.",
    ],
  }
};

export const POWER_COLORS = [
  { name: { en: "Royal Amethyst", ru: "Королевский Аметист" }, hex: "#9966CC" },
  { name: { en: "Midnight Blue", ru: "Полуночный Синий" }, hex: "#191970" },
  { name: { en: "Celestial Gold", ru: "Небесное Золото" }, hex: "#FFD700" },
  { name: { en: "Deep Teal", ru: "Глубокий Бирюзовый" }, hex: "#008080" },
  { name: { en: "Crimson Velvet", ru: "Багровый Бархат" }, hex: "#DC143C" },
  { name: { en: "Silver Mist", ru: "Серебряный Туман" }, hex: "#C0C0C0" },
  { name: { en: "Obsidian", ru: "Обсидиан" }, hex: "#303030" },
];
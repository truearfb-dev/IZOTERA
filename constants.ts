import { Feeling, ZodiacSign, Element, Archetype } from './types';

export const TRANSLATIONS = {
  // Onboarding
  identifyYourself: "Добро пожаловать в Aetheria",
  starsNeedName: "Ваш персональный навигатор по судьбе. Искусственный интеллект анализирует положение звезд в момент вашего рождения, чтобы создать уникальный прогноз энергии, любви и карьеры на сегодня.",
  namePlaceholder: "Ваше Имя",
  nameLabel: "Как к вам обращаться?",
  dobLabel: "Дата вашего рождения",
  revealSigns: "Рассчитать натальную карту",
  preciseMoment: "Точный момент",
  calculateAscendant: "Время рождения необходимо для точного расчета Асцендента и положения домов.",
  sunDetected: "Солнце в знаке",
  tobLabel: "Время рождения",
  continue: "Продолжить",
  elementalCore: "Стихия Души",
  forceGov: "Какая сила управляет вашим духом?",
  theMirror: "Зеркало",
  mirrorVoid: "В отражении пустоты, кто смотрит в ответ?",
  currentState: "Текущее состояние",
  spiritResonate: "Как резонирует ваш дух сегодня?",
  consultStars: "Получить Предсказание",
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
  readAnother: "Спросить звезды снова",
  love: "Любовь",
  career: "Карьера",
  vitality: "Жизненная сила",
  // History
  historyTitle: "Гримуар Судеб",
  historyEmpty: "Страницы пусты. Звезды еще не шептали вам.",
  back: "Назад",
  openHistory: "Гримуар",
  
  // Paywall
  paywallTitle: "Вселенная требует обмена",
  paywallDesc: "Вы использовали 3 бесплатных предсказания. Чтобы продолжить получать мудрость звезд, откройте доступ к безграничному источнику.",
  premiumBenefit1: "Безлимитные ежедневные прогнозы",
  premiumBenefit2: "Расширенный анализ совместимости (Скоро)",
  premiumBenefit3: "Личный AI-астролог 24/7 (Скоро)",
  subscribeAction: "Открыть доступ за 299₽ / мес",
  restorePurchase: "Восстановить покупки",
  
  // Auth
  authTitle: "Печать Судьбы",
  authDesc: "Чтобы сохранить связь с космосом, назовите себя.",
  emailLabel: "Электронная почта",
  passwordLabel: "Тайный ключ (Пароль)",
  signIn: "Войти",
  signUp: "Зарегистрироваться",
  authSwitchToLogin: "Уже есть печать? Войти",
  authSwitchToRegister: "Нет печати? Создать",
  
  // Feelings
  [Feeling.Lost]: "Потерянность",
  [Feeling.Energetic]: "Энергичность",
  [Feeling.SeekingLove]: "Поиск любви",
  [Feeling.FocusOnMoney]: "Фокус на деньгах",
  // Elements
  [Element.Fire]: "Огонь",
  [Element.Earth]: "Земля",
  [Element.Air]: "Воздух",
  [Element.Water]: "Вода",
  // Archetypes
  [Archetype.Warrior]: "Воин",
  [Archetype.Healer]: "Целитель",
  [Archetype.Sage]: "Мудрец",
  [Archetype.Creator]: "Творец",
  
  // Descriptions for UI aesthetics
  elementDesc: {
    [Element.Fire]: "Страсть • Действие • Воля",
    [Element.Earth]: "Основа • Рост • Стабильность",
    [Element.Air]: "Мысль • Свобода • Связь",
    [Element.Water]: "Чувство • Поток • Интуиция",
  },
  archetypeDesc: {
    [Archetype.Warrior]: "Сила и Защита",
    [Archetype.Healer]: "Гармония и Свет",
    [Archetype.Sage]: "Знание и Истина",
    [Archetype.Creator]: "Видение и Форма",
  }
};

export const FEELING_ICONS = {
  [Feeling.Lost]: "🌫️",
  [Feeling.Energetic]: "⚡",
  [Feeling.SeekingLove]: "🌹",
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
  [Archetype.Healer]: "🪷",
  [Archetype.Sage]: "👁️",
  [Archetype.Creator]: "🔮",
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

export const ZODIAC_NAMES: Record<ZodiacSign, string> = {
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
};
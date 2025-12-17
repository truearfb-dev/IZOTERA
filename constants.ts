import { Feeling, ZodiacSign, Element, Archetype } from './types';

export const TRANSLATIONS = {
  // Onboarding
  identifyYourself: "Привет! Это Aetheria",
  starsNeedName: "Ваш личный астрологический помощник. Мы анализируем положение планет в момент вашего рождения, чтобы дать практические советы по энергии, отношениям и карьере на сегодня.",
  namePlaceholder: "Ваше Имя",
  nameLabel: "Как к вам обращаться?",
  dobLabel: "Дата вашего рождения",
  revealSigns: "Далее",
  preciseMoment: "Время рождения",
  calculateAscendant: "Нужно для расчета Асцендента и сетки домов. Если не знаете точно, укажите 12:00.",
  sunDetected: "Солнце в знаке",
  tobLabel: "Время рождения",
  continue: "Продолжить",
  elementalCore: "Ваша Стихия",
  forceGov: "К чему вы чувствуете большую предрасположенность?",
  theMirror: "Ваш Архетип",
  mirrorVoid: "Какая социальная роль вам ближе?",
  currentState: "Настроение",
  spiritResonate: "На чем вы сфокусированы сегодня?",
  consultStars: "Сформировать прогноз",
  
  // Loader
  messages: [
    "Анализ планетных транзитов...",
    "Расчет натальной карты...",
    "Проверка лунных фаз...",
    "Синтез данных...",
    "Формирование рекомендаций...",
  ],
  
  // Card
  dailyGuidance: "Прогноз для",
  powerColor: "Цвет дня:",
  readAnother: "Новый запрос",
  love: "Отношения",
  career: "Работа",
  vitality: "Энергия",
  
  // History
  historyTitle: "История",
  historyEmpty: "Здесь будут ваши сохраненные прогнозы.",
  back: "Назад",
  openHistory: "История",
  
  // Paywall
  paywallTitle: "Полный доступ",
  paywallDesc: "Вы использовали лимит бесплатных прогнозов. Оформите подписку, чтобы получать персональные рекомендации каждый день без ограничений.",
  premiumBenefit1: "Ежедневные персональные прогнозы",
  premiumBenefit2: "Анализ совместимости (Скоро)",
  premiumBenefit3: "Чат с астрологом (Скоро)",
  subscribeAction: "Подписаться за 299₽ / мес",
  restorePurchase: "Восстановить покупки",
  
  // Auth
  authTitle: "Вход в аккаунт",
  authDesc: "Войдите или зарегистрируйтесь, чтобы сохранять историю прогнозов.",
  emailLabel: "Email",
  passwordLabel: "Пароль",
  signIn: "Войти",
  signUp: "Регистрация",
  authSwitchToLogin: "Уже есть аккаунт? Войти",
  authSwitchToRegister: "Нет аккаунта? Создать",
  
  // Feelings
  [Feeling.Lost]: "Поиск себя",
  [Feeling.Energetic]: "Прилив сил",
  [Feeling.SeekingLove]: "Отношения",
  [Feeling.FocusOnMoney]: "Карьера и деньги",
  
  // Elements
  [Element.Fire]: "Огонь",
  [Element.Earth]: "Земля",
  [Element.Air]: "Воздух",
  [Element.Water]: "Вода",
  
  // Archetypes
  [Archetype.Warrior]: "Лидер / Воин",
  [Archetype.Healer]: "Помощник / Эмпат",
  [Archetype.Sage]: "Аналитик / Мудрец",
  [Archetype.Creator]: "Креатор / Творец",
  
  // Descriptions for UI aesthetics (Optional usage)
  elementDesc: {
    [Element.Fire]: "Активность • Инициатива",
    [Element.Earth]: "Практичность • Результат",
    [Element.Air]: "Коммуникация • Идеи",
    [Element.Water]: "Эмоции • Интуиция",
  },
  archetypeDesc: {
    [Archetype.Warrior]: "Достижение целей",
    [Archetype.Healer]: "Забота и поддержка",
    [Archetype.Sage]: "Поиск истины",
    [Archetype.Creator]: "Создание нового",
  }
};

export const FEELING_ICONS = {
  [Feeling.Lost]: "🧭",
  [Feeling.Energetic]: "⚡",
  [Feeling.SeekingLove]: "❤️",
  [Feeling.FocusOnMoney]: "💼",
};

export const ELEMENT_ICONS = {
  [Element.Fire]: "🔥",
  [Element.Earth]: "🌱",
  [Element.Air]: "💨",
  [Element.Water]: "💧",
};

export const ARCHETYPE_ICONS = {
  [Archetype.Warrior]: "🎯",
  [Archetype.Healer]: "🤝",
  [Archetype.Sage]: "📚",
  [Archetype.Creator]: "💡",
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
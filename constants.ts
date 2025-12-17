import { Focus, ZodiacSign } from './types';

export const TRANSLATIONS = {
  // Onboarding
  identifyYourself: "Настройка профиля",
  starsNeedName: "Введите данные рождения для расчета персональной стратегии дня. Мы используем астрологические алгоритмы для анализа ваших биоритмов.",
  namePlaceholder: "Ваше Имя",
  nameLabel: "Имя",
  dobLabel: "Дата рождения",
  revealSigns: "Далее",
  preciseMoment: "Время и Приоритет",
  calculateAscendant: "Время нужно для точной сетки домов гороскопа. Если не знаете — укажите 12:00.",
  sunDetected: "Знак",
  tobLabel: "Время рождения",
  continue: "Рассчитать план",
  
  currentState: "Главный приоритет",
  spiritResonate: "На чем вы хотите сфокусироваться сегодня?",
  consultStars: "Сформировать план",
  
  // Loader
  messages: [
    "Анализ планетных транзитов...",
    "Расчет аспектов дня...",
    "Синтез рекомендаций...",
    "Формирование списка задач...",
  ],
  
  // Card
  dailyGuidance: "Персональная стратегия •",
  powerColor: "Цвет удачи:",
  readAnother: "Изменить фокус",
  
  // Stats labels
  statFocus: "Фокус",
  statEnergy: "Энергия",
  statMood: "Настроение",
  
  // History
  historyTitle: "Архив прогнозов",
  historyEmpty: "История пуста.",
  back: "Назад",
  openHistory: "Архив",
  
  // Paywall
  paywallTitle: "Pro Доступ",
  paywallDesc: "Бесплатный лимит исчерпан. Оформите подписку для неограниченного доступа к ежедневным персональным стратегиям.",
  premiumBenefit1: "Ежедневный план действий",
  premiumBenefit2: "Глубокая аналитика трендов",
  premiumBenefit3: "Безлимитные запросы",
  subscribeAction: "Оформить за 299₽ / мес",
  restorePurchase: "Восстановить",
  
  // Auth
  authTitle: "Вход",
  authDesc: "Авторизуйтесь для сохранения истории.",
  emailLabel: "Email",
  passwordLabel: "Пароль",
  signIn: "Войти",
  signUp: "Регистрация",
  authSwitchToLogin: "Есть аккаунт? Войти",
  authSwitchToRegister: "Нет аккаунта? Создать",
  
  // Focuses
  [Focus.Productivity]: "Продуктивность и Работа",
  [Focus.Relationships]: "Отношения и Общение",
  [Focus.Wellbeing]: "Здоровье и Баланс",
  [Focus.Finance]: "Финансы и Покупки",
};

export const FOCUS_ICONS = {
  [Focus.Productivity]: "🚀",
  [Focus.Relationships]: "🤝",
  [Focus.Wellbeing]: "🧘",
  [Focus.Finance]: "💰",
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
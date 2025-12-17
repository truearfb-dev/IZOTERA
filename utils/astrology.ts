import { GoogleGenAI, Type } from "@google/genai";
import { ZODIAC_DATES } from '../constants';
import { UserData, ZodiacSign, DailyPrediction } from '../types';

// --- Хелперы ---

export const calculateZodiac = (dob: string): ZodiacSign => {
  if (!dob) return ZodiacSign.Aries;
  
  const date = new Date(dob);
  const month = date.getMonth() + 1; // 0-indexed
  const day = date.getDate();

  const found = ZODIAC_DATES.find(({ start, end }) => {
    if (start[0] === month && day >= start[1]) return true;
    if (end[0] === month && day <= end[1]) return true;
    // Special case for Capricorn spanning year end
    if (start[0] === 12 && month === 12 && day >= start[1]) return true;
    if (end[0] === 1 && month === 1 && day <= end[1]) return true;
    return false;
  });

  return found ? found.sign : ZodiacSign.Capricorn; // Fallback
};

// --- Демонстрационный Режим (Симуляция) ---

const getMockPrediction = (userData: UserData): DailyPrediction => {
  // Генерация псевдо-случайного ответа на основе имени и даты, чтобы он был стабильным для пользователя сегодня
  const seed = userData.name.length + new Date().getDate();
  
  const headlines = [
    "Эхо Древних Звезд",
    "Резонанс Эфира",
    "Шепот Вселенной",
    "Гармония Сфер",
    "Путь Света",
    "Зеркало Судьбы",
    "Танец Планет"
  ];
  
  const insights = [
    "Звезды указывают на скрытый потенциал. Ваша энергия сегодня способна менять реальность, если вы направите её в созидательное русло. Слушайте тишину.",
    "Сегодня день внутренней алхимии. То, что казалось свинцом, может стать золотом, если вы проявите терпение и мудрость. Не торопите события.",
    "Ветры перемен касаются вашего лица. Не бойтесь поднять паруса, даже если карта маршрута еще не до конца ясна. Доверьтесь потоку.",
    "Тишина — это тоже ответ. В паузах между действиями сегодня скрывается больше смысла, чем в самой суете. Найдите время для созерцания.",
    "Ваша аура сияет особенно ярко. Это время для того, чтобы делиться светом с другими, не ожидая ничего взамен. Вселенная вернет сторицей.",
    "Обратите внимание на знаки. Случайная встреча или забытая мелодия могут содержать ключ к вопросу, который давно вас волнует."
  ];

  const colors = [
    { name: "Astral Gold", hex: "#FFD700" },
    { name: "Mystic Purple", hex: "#8A2BE2" },
    { name: "Nebula Blue", hex: "#483D8B" },
    { name: "Cosmic Silver", hex: "#C0C0C0" },
    { name: "Ethereal Teal", hex: "#008080" },
    { name: "Crimson Void", hex: "#DC143C" }
  ];

  const getSeeded = (arr: any[]) => arr[seed % arr.length];
  const color = getSeeded(colors);
  const headline = getSeeded(headlines);
  const insight = getSeeded(insights);

  return {
    headline: headline,
    insight: insight + " (Примечание: Включен режим симуляции, так как связь с API нестабильна)",
    powerColor: color.name,
    powerColorHex: color.hex,
    stats: {
      love: 60 + (seed * 3 % 40),
      career: 50 + (seed * 7 % 50),
      vitality: 70 + (seed * 2 % 30),
    }
  };
};

// --- Основная функция ---

export const generatePrediction = async (userData: UserData): Promise<DailyPrediction> => {
  // Retrieve Key
  const apiKey = process.env.API_KEY;
  
  // Если ключа нет вообще — сразу демо режим, без ошибки, чтобы не блокировать UI
  if (!apiKey) {
    console.warn("API Key отсутствует. Включаю режим симуляции.");
    return getMockPrediction(userData);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  console.log("Generating prediction for:", userData.name);

  const prompt = `
    Role: Mystical Astrologer.
    Target: ${userData.name}, Born: ${userData.dob} (${userData.tob}).
    Traits: ${userData.zodiacSign}, ${userData.element}, ${userData.archetype}.
    State: ${userData.feeling}.
    Language: Russian.

    Generate a JSON response with:
    - headline (mystical, max 6 words)
    - insight (poetic advice, 2-3 sentences)
    - powerColor (name)
    - powerColorHex (hex code)
    - stats (love, career, vitality as integers 0-100)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            insight: { type: Type.STRING },
            powerColor: { type: Type.STRING },
            powerColorHex: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                love: { type: Type.INTEGER },
                career: { type: Type.INTEGER },
                vitality: { type: Type.INTEGER },
              },
              required: ['love', 'career', 'vitality'],
            },
          },
          required: ['headline', 'insight', 'powerColor', 'powerColorHex', 'stats'],
        }
      }
    });

    const text = response.text;

    if (!text) {
      throw new Error("Empty response from stars");
    }

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    try {
      return JSON.parse(cleanJson) as DailyPrediction;
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", text);
      return getMockPrediction(userData);
    }
  } catch (error: any) {
    console.error("Generation Error Full:", error);
    const msg = error.message || JSON.stringify(error);

    // ВАЖНО: Если ключ отозван (403/Leaked) или лимиты исчерпаны, 
    // мы НЕ роняем приложение, а отдаем симуляцию.
    // Это позволит пользователю взаимодействовать с UI, пока он чинит ключ.
    if (
        msg.includes('403') || 
        msg.includes('leaked') || 
        msg.includes('PERMISSION_DENIED') || 
        msg.includes('API_KEY_INVALID') ||
        msg.includes('400') ||
        msg.includes('429') || 
        msg.includes('500') ||
        msg.includes('503')
    ) {
       console.warn("API Error detected. Activating Simulation Protocol.");
       return getMockPrediction(userData);
    }

    // Любая другая ошибка — тоже симуляция для стабильности
    return getMockPrediction(userData);
  }
};
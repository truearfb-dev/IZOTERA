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
  // Генерация псевдо-случайного ответа на основе имени и даты
  const seed = userData.name.length + new Date().getDate();
  
  const headlines = [
    "Время действовать",
    "Фокус на главном",
    "День планирования",
    "Важный разговор",
    "Эмоциональный баланс",
    "Новые возможности",
    "Время для отдыха"
  ];
  
  const insights = [
    "Сегодня отличный день для завершения старых дел. Не беритесь за новое, пока не разберетесь с \"хвостами\". Ваша продуктивность сейчас на пике.",
    "Звезды советуют обратить внимание на финансы. Возможно, стоит пересмотреть бюджет или отложить крупную покупку на пару дней.",
    "В отношениях возможны небольшие разногласия. Постарайтесь слушать больше, чем говорить, и не принимайте критику близко к сердцу.",
    "Ваша энергия сегодня стабильна. Хорошее время для спорта или физической активности. Это поможет прочистить мысли.",
    "Интуиция подскажет правильное решение в рабочем вопросе. Доверяйте первому впечатлению, оно сегодня самое верное.",
    "Сделайте паузу. Вы много работали в последнее время, организму требуется перезагрузка. Вечер лучше провести в спокойной обстановке."
  ];

  const colors = [
    { name: "Золотистый", hex: "#FFD700" },
    { name: "Темно-синий", hex: "#1e3a8a" },
    { name: "Изумрудный", hex: "#047857" },
    { name: "Серый металлик", hex: "#9ca3af" },
    { name: "Бордовый", hex: "#9f1239" },
    { name: "Бежевый", hex: "#d6d3d1" }
  ];

  const getSeeded = (arr: any[]) => arr[seed % arr.length];
  const color = getSeeded(colors);
  const headline = getSeeded(headlines);
  const insight = getSeeded(insights);

  return {
    headline: headline,
    insight: insight + " (Примечание: Демо-режим. Проверьте соединение с сетью).",
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
  
  if (!apiKey) {
    console.warn("API Key отсутствует. Включаю режим симуляции.");
    return getMockPrediction(userData);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  console.log("Generating prediction for:", userData.name);

  // CHANGED PROMPT TO "MODERN PRACTICAL ASTROLOGER"
  const prompt = `
    Role: Modern Psychological Astrologer & Life Coach.
    Target: ${userData.name}, Born: ${userData.dob} (${userData.tob}).
    Traits: ${userData.zodiacSign}, ${userData.element}, ${userData.archetype}.
    State: ${userData.feeling}.
    Language: Russian.

    Generate a JSON response for a daily horoscope.
    Tone: Grounded, practical, psychological, realistic. Avoid mystical jargon, magic spells, or archaic fantasy language.
    Focus on: Productivity, mental health, relationships, and actionable advice.

    Structure:
    - headline (concise, clear, max 6 words, e.g. "Focus on Career", "Watch your Health")
    - insight (practical advice based on astrological energy, 2-3 sentences. Talk about real life situations.)
    - powerColor (name in Russian)
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

    return getMockPrediction(userData);
  }
};
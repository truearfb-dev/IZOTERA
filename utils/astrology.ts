import { GoogleGenAI, Type } from "@google/genai";
import { ZODIAC_DATES } from '../constants';
import { UserData, ZodiacSign, DailyPrediction } from '../types';

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

export const generatePrediction = async (userData: UserData): Promise<DailyPrediction> => {
  const apiKey = process.env.API_KEY;
  
  console.log("Generating prediction for:", userData.name);
  console.log("API Key present:", !!apiKey);

  if (!apiKey) {
    throw new Error("Ключ API отсутствует. Проверьте настройки .env");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Generate a mystical daily astrology reading for:
    Name: ${userData.name}
    Date of Birth: ${userData.dob}
    Time of Birth: ${userData.tob}
    Zodiac Sign: ${userData.zodiacSign}
    Elemental Core: ${userData.element}
    Archetype: ${userData.archetype}
    Current Feeling: ${userData.feeling}
    Language: Russian (MUST be in Russian language)

    I need:
    1. A short, mystical headline (max 6 words).
    2. A deep, poetic insight (2-3 sentences).
    3. A "Power Color" name and its hex code.
    4. Numeric stats (0-100) for "love", "career", and "vitality".

    The tone should be ethereal, slightly esoteric, but encouraging.
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
    console.log("AI Response received:", text ? "Yes" : "No");

    if (!text) {
      throw new Error("Звезды молчат (пустой ответ от API).");
    }

    // Robust JSON extraction: Find the first '{' and last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    try {
      return JSON.parse(cleanJson) as DailyPrediction;
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Не удалось расшифровать послание звезд (ошибка данных).");
    }
  } catch (error: any) {
    console.error("Generation Error:", error);
    // Enhance error message for user
    if (error.message?.includes('429')) {
       throw new Error("Слишком много запросов к космосу. Попробуйте позже.");
    }
    throw error;
  }
};
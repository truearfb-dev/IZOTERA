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
    if (start[0] === 12 && month === 12 && day >= start[1]) return true;
    if (end[0] === 1 && month === 1 && day <= end[1]) return true;
    return false;
  });

  return found ? found.sign : ZodiacSign.Capricorn; 
};

// --- Демонстрационный Режим (Симуляция) ---

const getMockPrediction = (userData: UserData): DailyPrediction => {
  const seed = userData.name.length + new Date().getDate();
  
  return {
    headline: "День высокой продуктивности",
    insight: "Текущее положение Марса способствует решению сложных задач. Не откладывайте важные звонки на вторую половину дня.",
    actionPlan: [
      "Составьте список из 3 главных задач до 10:00.",
      "Исключите отвлекающие факторы во время работы.",
      "Запланируйте 20 минут полной тишины вечером."
    ],
    powerColor: "Синий",
    powerColorHex: "#3b82f6",
    stats: {
      focus: 85,
      energy: 70,
      mood: 65,
    }
  };
};

// --- Основная функция ---

export const generatePrediction = async (userData: UserData): Promise<DailyPrediction> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API Key отсутствует. Включаю режим симуляции.");
    return getMockPrediction(userData);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  console.log("Generating prediction for:", userData.name);

  // STRICT PRAGMATIC PROMPT
  const prompt = `
    Role: Pragmatic Life Coach & Strategist using Astrological Data.
    Target: ${userData.name}, Born: ${userData.dob} (${userData.tob}).
    Zodiac: ${userData.zodiacSign}.
    Current Focus: ${userData.focus}.
    Language: Russian.

    Generate a daily plan in JSON.
    TONE: Professional, direct, actionable, realistic. NO mystical jargon, NO "cosmic energy flows", NO "whispers of the universe".
    
    Output requirements:
    1. headline: Short 3-5 word business-style summary (e.g. "Focus on Negotiations", "Analytical Work Day").
    2. insight: 2 sentences explaining WHY based on current transit (e.g. "Mercury retrograde may cause tech issues, double check emails.").
    3. actionPlan: Exactly 3 bullet points of CONCRETE actions to take today.
    4. stats: integers 0-100 for 'focus', 'energy', 'mood'.
    5. powerColor: A color name in Russian.
    6. powerColorHex: Hex code.
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
            actionPlan: {
               type: Type.ARRAY,
               items: { type: Type.STRING }
            },
            powerColor: { type: Type.STRING },
            powerColorHex: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                focus: { type: Type.INTEGER },
                energy: { type: Type.INTEGER },
                mood: { type: Type.INTEGER },
              },
              required: ['focus', 'energy', 'mood'],
            },
          },
          required: ['headline', 'insight', 'actionPlan', 'powerColor', 'powerColorHex', 'stats'],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    return JSON.parse(cleanJson) as DailyPrediction;
    
  } catch (error: any) {
    console.error("AI Error:", error);
    return getMockPrediction(userData);
  }
};
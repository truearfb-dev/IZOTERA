import { GoogleGenAI, Type } from "@google/genai";
import { ZODIAC_DATES } from '../constants';
import { UserData, ZodiacSign, DailyPrediction, Language } from '../types';

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

export const generatePrediction = async (userData: UserData, lang: Language): Promise<DailyPrediction> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please add API_KEY to your environment variables.");
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
    Language: ${lang} (Provide the content in this language)

    I need:
    1. A short, mystical headline (max 6 words).
    2. A deep, poetic insight (2-3 sentences).
    3. A "Power Color" name and its hex code.
    4. Numeric stats (0-100) for "love", "career", and "vitality".

    The tone should be ethereal, slightly esoteric, but encouraging.
  `;

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
    throw new Error("Failed to generate prediction: No content returned.");
  }

  // Sanitize Markdown code blocks if present (just in case)
  const cleanText = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanText) as DailyPrediction;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("The stars spoke in riddles (Invalid JSON response).");
  }
};
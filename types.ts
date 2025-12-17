export enum ZodiacSign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces"
}

export enum Focus {
  Productivity = "Productivity",
  Relationships = "Relationships",
  Wellbeing = "Wellbeing",
  Finance = "Finance"
}

export interface UserData {
  name: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  focus: Focus | null;
  zodiacSign?: ZodiacSign;
}

export interface DailyPrediction {
  headline: string; // "Strategy for the day"
  insight: string; // "General context"
  actionPlan: string[]; // 3 bullet points
  powerColor: string; // Kept as "Lucky Color" or similar
  powerColorHex: string;
  stats: {
    focus: number; // Replaces Career/Love/etc with generic productivity/energy metrics
    energy: number;
    mood: number;
  };
}
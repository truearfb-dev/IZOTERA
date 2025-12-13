export type Language = 'en' | 'ru';

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

export enum Feeling {
  Lost = "Lost",
  Energetic = "Energetic",
  SeekingLove = "Seeking Love",
  FocusOnMoney = "Focus on Money"
}

export enum Element {
  Fire = "Fire",
  Earth = "Earth",
  Air = "Air",
  Water = "Water"
}

export enum Archetype {
  Warrior = "Warrior",
  Healer = "Healer",
  Sage = "Sage",
  Creator = "Creator"
}

export interface UserData {
  name: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  element: Element | null;
  archetype: Archetype | null;
  feeling: Feeling | null;
  zodiacSign?: ZodiacSign;
}

export interface DailyPrediction {
  headline: string;
  insight: string;
  powerColor: string;
  powerColorHex: string;
  stats: {
    love: number;
    career: number;
    vitality: number;
  };
}
export type Source = "Anki" | "Immersion" | "Kanji" | "Matches";

export const glowColors: Record<Source, string> = {
  Anki: "rgba(255, 224, 102, 0.7)",
  Immersion: "rgba(201, 177, 255, 0.7)",
  Kanji: "rgba(79, 179, 232, 0.7)",
  Matches: "rgba(255, 154, 60, 0.7)",
};
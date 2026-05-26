export type Source = "Anki" | "Immersion" | "Kanji" | "Matches";

export const glowColors: Record<Source, string> = {
  Anki: "rgba(255, 224, 102, 0.7)",
  Immersion: "rgba(201, 177, 255, 0.7)",
  Kanji: "rgba(79, 179, 232, 0.7)",
  Matches: "rgba(255, 154, 60, 0.7)",
};
export const colors = {
  anki: "bg-[#ff9a3c] !border-[#e06500]",
  immersion: "bg-[#c9b1ff] !border-[#7c3aed]",
  kanji: "bg-[#4fb3e8] !border-[#0099d4]",
  matches: "bg-[#ffe066] !border-[#ffcb00]",
};

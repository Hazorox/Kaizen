import mongoose from "mongoose";

const schema = mongoose.Schema;
interface VocabEntry {
  Original: string;
  Furigana: string;
  English: string;
  Level: string;
}
interface kanjiRound {
  Kanji: string;
  Level: number;
}
interface vocabRound {
  correct: VocabEntry;
  distractors: VocabEntry[];
}

const MatchesModel = new schema({
  roomId: String,
  players: [String, String],
  jlptLevel: { type: String, enum: ["N5", "N4", "N3", "N2", "N1"] },
  mode: String,
  scores: { player1: Number, player2: Number },
  rounds: [mongoose.Schema.Types.Mixed],
  status: { type: String, enum: ["active", "finished", "waiting"] },
  createdAt: { type: Date, default: Date.now() },
  winner: String,
});

export const Matches = mongoose.model("matches", MatchesModel);

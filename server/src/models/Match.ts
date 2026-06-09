import mongoose from "mongoose";

const schema = mongoose.Schema;

const MatchesModel = new schema({
  roomId: String,
  players: [String, String],
  jlptLevel: { type: String, enum: ["N5", "N4", "N3", "N2", "N1"] },
  mode: String,
  scores: { player1: Number, player2: Number },
  rounds: [],
  status: { type: String, enum: ["active", "finished", "waiting"] },
  createdAt: { type: Date, default: Date.now() },
  winner: String,
});

export const Matches = mongoose.model("matches", MatchesModel);

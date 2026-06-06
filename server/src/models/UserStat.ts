import mongoose from "mongoose";
// TODO: Reconstruct Types better
const schema = mongoose.Schema;
const mining = [
  {
    word: String,
    reading: String,
    meaning: String,
    time: { type: Date, default: Date.now },
  },
];
const userStatModel = new schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
    ref: "User",
  },
  lastSeen: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  mining: mining,
  wordHistory: { type: [Object] },
  battleHistory: { type: [Object] },
});

export const UserStat = mongoose.model("user-stats", userStatModel);

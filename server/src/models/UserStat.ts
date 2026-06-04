import mongoose from "mongoose";
// TODO: Reconstruct Types better
const schema = mongoose.Schema;

const userStatModel = new schema({
  username: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  lastSeen: { type: Date },
  streak: { type: Number },
  minining: { type: [Object] },
  battleHistory: { type: [Object] },
});

export const UserStat = mongoose.model("UserStat", userStatModel);

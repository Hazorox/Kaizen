import mongoose from "mongoose";
// TODO: Reconstruct Types better
const schema = mongoose.Schema;

const userStatModel = new schema({
  username: { type: String, unique: true, sparse: true,required:true,ref:"User"},
  lastSeen: { type: Date },
  streak: { type: Number },
  mining : {type:[Object]},
  wordHistory:{type:[Object]},
  battleHistory: { type: [Object] },
});

export const UserStat = mongoose.model("UserStat", userStatModel);

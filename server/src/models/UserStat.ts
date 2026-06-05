import mongoose from "mongoose";
// TODO: Reconstruct Types better
const schema = mongoose.Schema;

const userStatModel = new schema({
  username: { type: String, unique: true, sparse: true,required:true,ref:"User"},
  lastSeen: { type: Date,default:Date.now() },
  streak: { type: Number, default:0, },
  mining : {type:[Object]},
  wordHistory:{type:[Object]},
  battleHistory: { type: [Object] },
});

export const UserStat = mongoose.model("user-stats", userStatModel);

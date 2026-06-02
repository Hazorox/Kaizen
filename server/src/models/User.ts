import mongoose from "mongoose";

const schema = mongoose.Schema;

const userModel = new schema({
  username: { type: String, unique: true, sparse: true },
  pass: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  profilePic:{type:String,default:""},
  cdnId:{type:String,default:""}
});

export const User = mongoose.model("User", userModel);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { getYtSub } from "./getYtSub";
dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Kaizen is Running :D");
});

app.get("/transcript/:videoId", async (req,res)=>{
    const id = req.params.videoId
    const sub = await getYtSub(id)
    res.json(sub)
})

mongoose.connect(process.env.MONGO_URI ?? "").then(() => {
  console.log("Connected to Mongoose !");
}).catch((err)=>{console.error(`Error while connecting to Database : \n${err}`)})

app.listen(process.env.PORT, () => {
  "Kaizen Running on port 9898";
});

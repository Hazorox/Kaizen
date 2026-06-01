import "dotenv/config"
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { getYtSub } from "./getYtSub";
import authRoutes from './routes/auth'
import googleRoutes from "./routes/google"
import session from "express-session"
import passport from "passport"
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET ?? 'secret', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use("/api/auth",authRoutes)
app.use('/api/auth', googleRoutes)

app.get("/", (req, res) => {
  res.json("Kaizen is Running :D");
});
app.get("/api/transcript/:videoId", async (req, res) => {
  const id = req.params.videoId;
  const sub = await getYtSub(id);
  res.json(sub);
});
mongoose
  .connect(process.env.MONGO_URI ?? "")
  .then(() => {
    console.log("Connected to Mongoose !");
  })
  .catch((err) => {
    console.error(`Error while connecting to Database : \n${err}`);
  });
  
  app.listen(process.env.PORT, () => {
    "Kaizen Running on port 9898";
  });


 
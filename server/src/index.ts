import "dotenv/config";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { getYtSub } from "./utils/getYtSub";
import authRoutes from "./routes/auth";
import googleRoutes from "./routes/google";
import session from "express-session";
import passport from "passport";
import { updatePFP } from "./utils/pfpUtils";
import { delAcc } from "./utils/deleteAcc";
import { ankiUtils } from "./utils/anki";
import { immersion } from "./utils/immersion";
import { getStats } from "./utils/getStats";
import { authMiddleware } from "./middleware/auth";
import { updateLastSeen } from "./middleware/updateLastSeen";
import { makeSocket } from "./socket";
import { matches } from "./utils/matches";
import { recents } from "./utils/recents";
const app = express();
const httpServer = createServer(app)
const io = makeSocket(httpServer)
app.use(cors({ origin: ["http://localhost:5173","https://admin.socket.io/"] }));
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET ?? "secret",
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(authMiddleware, updateLastSeen);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleRoutes);
app.use(recents)
app.use(delAcc);
app.use(updatePFP);
app.use(immersion);
app.use(ankiUtils);
app.use(getStats);
app.use(matches)
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
    console.log("Connected to MongoDB !");
  })
  .catch((err) => {
    console.error(`Error while connecting to Database : \n${err}`);
  });
httpServer.listen(process.env.PORT, () => {
  console.log("Server Running");
});

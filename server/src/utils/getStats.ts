import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { UserStat } from "../models/UserStat";
import { error } from "console";
import { Matches } from "../models/Match";
const router = Router();
const bothSameDay = (a: Date, b: Date) =>
  a.getMonth() === b.getMonth() &&
  a.getDay() === b.getDay() &&
  a.getFullYear() === b.getFullYear();
router.get("/api/getStats", async (req, res) => {
  const username = (req as any).user.username;
  const response = await UserStat.findOne({ username });
  if (!response) return res.json({ error: "404" });
  const today = new Date();
  const minedToday = response.mining.filter((entry: any) =>
    bothSameDay(today, entry.time),
  ).length;
  let matches = 0;
  const matchesTotal = await Matches.find({ players: { $in: [username] } });
  if (matchesTotal.length != 0)
    matches =
      matchesTotal.filter((entry) => bothSameDay(entry.createdAt, today))
        .length ?? 0;
  res.json({ mining: minedToday, matches: matches });
});

router.get("/api/getStats/total", async (req, res) => {
  const username = (req as any).user.username;
  const response = await UserStat.findOne({ username });
  if (!response) return res.json({ error: "404" });
  let won = 0,
    tie = 0,
    lost = 0;
  const matches = await Matches.find({ players: { $in: [username] } });
  if (matches.length != 0) {
    won = matches.filter((match) => match.winner == username).length;
    tie = matches.filter((match) => match.winner === "both").length;
    lost = matches.filter((match) => match.winner != "username").length;
  }
  res.json({ mining: response.mining.length, battle: { won, tie, lost } });
});

export const getStats = router;

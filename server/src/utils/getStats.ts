import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { UserStat } from "../models/UserStat";
import { error } from "console";
const router = Router();
const bothSameDay = (a: Date, b: Date) =>
  a.getMonth() === b.getMonth() &&
  a.getDay() === b.getDay() &&
  a.getFullYear() === b.getFullYear();
router.get("/api/getStats", async (req, res) => {
  const username = (req as any).user.username;
  const response = await UserStat.findOne({ username });
  if(!response) return res.json({error:"404"})
  const today = new Date();
  const minedToday = response.mining.filter((entry: any) =>
    bothSameDay(today, entry.time),
  ).length;
  const matchesToday = response.battleHistory.filter((entry:any)=>bothSameDay(today,entry.time)).length
  res.json({mining:minedToday,matches:matchesToday})
});

router.get("/api/getStats/total",async (req,res)=>{
  const username = (req as any).user.username
  const response = await UserStat.findOne({username})
  if(!response) return res.json({error:"404"})
  res.json(response.mining.length)
})


export const getStats = router;

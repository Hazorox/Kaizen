import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { User } from "../models/User";
import { UserStat } from "../models/UserStat";
const router = Router();

router.delete("/api/auth/deleteAcc", async (req, res) => {
  const requester = (req as any).user;
  const username = requester.username;
  await User.findOneAndDelete({ username });
  await UserStat.findOneAndDelete({username})
  res.json({ message: "Account deleted" });
});

export const delAcc = router;

import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { User } from "../models/User";
const router = Router();

router.delete("/api/auth/deleteAcc", authMiddleware, async (req, res) => {
  const requester = (req as any).user

  await User.findOneAndDelete({ requester });
  res.json({ message: "Account deleted" });
});

export const delAcc = router;

import { Request, Response, NextFunction } from "express";
import { UserStat } from "../models/UserStat";

export const updateLastSeen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.path.startsWith("/api/auth")) return next();
  const username = (req as any).user?.username;
  if (!username) return next();

  const stat = await UserStat.findOne({ username });
  if (!stat) return next();

  const now = new Date();
  const last = stat.lastSeen ? new Date(stat.lastSeen) : null;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = last
    ? new Date(last.getFullYear(), last.getMonth(), last.getDate())
    : null;

  const diffDays = lastDay
    ? Math.round((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24))
    : null;
//  More than 2 days spent
  if (diffDays === null || diffDays >= 2) {
    stat.streak = 1;
  } else if (diffDays === 1) {
    // One day diff
    stat.streak += 1;
  }
// If None no increase :P
  stat.lastSeen = now;
  await stat.save();

  next();
};

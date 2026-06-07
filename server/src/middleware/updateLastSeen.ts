import { Request, Response, NextFunction } from "express";
import { UserStat } from "../models/UserStat";

export const updateLastSeen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const username = (req as any).user?.username;
  if (username) {
    await UserStat.updateOne({ username }, { $set: { lastSeen: new Date() } });
  }
  next();
};

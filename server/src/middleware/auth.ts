import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No Token" });
  if(!process.env.JWT_SECRET) console.log("JWT SECRET NOT FOUND")
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "secret");
    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Request" });
  }
};

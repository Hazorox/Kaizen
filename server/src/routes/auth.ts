import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { UserStat } from "../models/UserStat";
const router = Router();
const SECRET = process.env.JWT_SECRET ?? "secret";
// Register
router.post("/register", async (req, res) => {
  try {
    const { username, pass } = req.body;
    const exists = await User.findOne({ username: username });
    if (exists) return res.json({ error: "409" });
    const hashed = bcrypt.hash(pass, 12);
    const user = await User.create({
      username,
      pass: (await hashed).toString(),
    });
    const stats = await UserStat.create({
      username,
    });
    const token = jwt.sign({ username: username }, SECRET, {
      expiresIn: "14d",
    });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json(`Error During Register : \n${err}`);
  }
});
// Login
router.post("/login", async (req, res) => {
  try {
    const { username, pass } = req.body;
    const user = await User.findOne({ username });
    if (!user || !user.pass) return res.json({ error: "400" });
    const match = await bcrypt.compare(pass, user.pass);
    if (!match) return res.json({ error: "400" });
    const token = jwt.sign({ username: username }, SECRET, {
      expiresIn: "14d",
    });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
export default router;

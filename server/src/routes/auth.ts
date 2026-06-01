import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
const router = Router();
const SECRET = process.env.JWT_SECRET ?? "secret";

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, pass } = req.body;
    const exists = await User.findOne({ username: username });
    if (exists) return res.status(400).json({ error: "User Exists" });
    const hashed = bcrypt.hash(pass, 12);
    const user = await User.create({ username, pass: (await hashed).toString() });
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "14d" });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json(`Error During Register : \n${err}`);
  }
});
// Login
router.post('/login', async (req, res) => {
  try {
    const { username, pass } = req.body
    const user = await User.findOne({ username })
    if (!user || !user.pass) return res.status(400).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(pass, user.pass)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' })
    res.json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})
export default router
import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import axios from "axios";
import { UserStat } from "../models/UserStat";

const router = Router();

router.get("/api/lookup/word/:word", async (req, res) => {
  const word = req.params.word;
  const result = await axios.get(
    `https://jisho.org/api/v1/search/words?keyword=${word}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    },
  );
  res.json(result.data.data);
});

router.post("/api/immersion/add", async (req, res) => {
  const { word, reading, meaning } = req.body;
  const username = (req as any).user.username;
  try {
    const stat = await UserStat.findOne({ username });
    if (!stat) return res.json({ error: "404" });
    const wordExists = stat.mining.find((entry: any) => entry.word === word);
    if (wordExists) {
      await UserStat.updateOne(
        {
          username,
          "mining.word": word,
        },
        {
          $set: { "mining.$.time": new Date() },
        },
      );
    } else {
      await UserStat.findOneAndUpdate(
        { username },
        { $push: { mining: { word, reading, meaning, time: new Date() } } },
      );
    }

    return res.status(200).json("Success");
  } catch (err) {
    res.status(400).json(`An Error Occured\n${err}`);
  }
});
export const immersion = router;

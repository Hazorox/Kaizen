import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import axios from "axios";
import { UserStat } from "../models/UserStat";

const router = Router();

router.get("/api/lookup/word/:word", authMiddleware, async (req, res) => {
  const word = req.params.word;
  const query = JSON.stringify({
    query: word.toString(),
    language: "English",
    no_english: false,
  });
  const result = await axios.post("https://jotoba.de/api/search/words", query, {
    headers: { "Content-Type": "application/json" },
  });
  res.json(result.data);
});
router.get("/api/lookup/kanji/:kanji", authMiddleware, async (req, res) => {
  const result = await axios.get(
    `https://kanjiapi.dev/v1/kanji/${req.params.kanji}`,
  );
  res.json(result.data);
});

router.post("/api/immersion/add", authMiddleware, async (req, res) => {
  const { word, reading, meaning } = req.body;
  const username = (req as any).user.username;
  try{await UserStat.findOneAndUpdate(
    { username },
    { $push: { mining: { word, reading, meaning } } },
    { new: true },
  );
  return res.status(200).json("Success")

}
  catch(err){
    res.status(400).json(`An Error Occured\n${err}`)
  }
  
});
export const immersion = router
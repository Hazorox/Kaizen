import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/api/lookup/word/:word", authMiddleware, async (req, res) => {
  const word = req.params.word;
  const query = {"query":word.toString(),"language":"English","no_english":false}
  const result = await fetch(
    "https://jotoba.de/api/search/words",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(query)}
  );
  const data = await result.json();
  res.json(data);
});
router.get("/api/lookup/kanji/:kanji", authMiddleware, async (req, res) => {
  const result = await fetch(
    `https://kanjiapi.dev/v1/kanji/${req.params.kanji}`,
  );
  const data = await result.json();
  res.json(data);
});
export const fetchWord = router;

import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/api/lookup/word/:word", authMiddleware, async (req, res) => {
  const word = req.params.word;
  const result = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${word}`,
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

import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import axios from "axios";

const router = Router();

router.get("/api/lookup/word/:word", authMiddleware, async (req, res) => {
  const word = req.params.word;
  const query = JSON.stringify({"query":word.toString(),"language":"English","no_english":false})
  const result = await axios.post("https://jotoba.de/api/search/words",query,{headers:{"Content-Type":"application/json"}})
  res.json(result.data)
});
router.get("/api/lookup/kanji/:kanji", authMiddleware, async (req, res) => {
  const result = await axios.get(`https://kanjiapi.dev/v1/kanji/${req.params.kanji}`)
  res.json(result.data)
});
export const fetchWord = router;
// const result = await fetch(
//     "https://jotoba.de/api/search/words",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(query)}
//   );
import {
  fetchTranscript,
  YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript";
import { Router } from "express";
const router = Router();
router.post("/api/transcript", async (req, res) => {
  const input = req.body.input;
  if (!input) return "invalid";
  try {
    const result = await fetchTranscript(input, { lang: "ja" });
    return res.json(result);
  } catch (err) {
    if (err instanceof YoutubeTranscriptNotAvailableLanguageError) {
      return res.json({ error: "404" });
    }
    return res.json({ error: "invalid" });
  }
});

export const getSub = router;

import {
  fetchTranscript,
  YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript";
import { Router } from "express";
const getYoutubeId = (input: string) =>
  input.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )?.[1] ?? null;

const router = Router();
router.post("/api/transcript", async (req, res) => {
  const input = req.body.input;
  if (!input) return "invalid";
  try {
    const id = getYoutubeId(input) ?? "";
    const result = await fetchTranscript(id, { lang: "ja" });

    return res.json(result);
  } catch (err) {
    if (err instanceof YoutubeTranscriptNotAvailableLanguageError) {
      return res.json({ error: "404" });
    }
    return res.json({ error: "invalid" });
  }
});

export const getSub = router;

import {
  fetchTranscript,
  YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript";
import { Supadata } from "@supadata/js";

// Copied this from utils folder in frontend hehe
const getYoutubeId = (input: string) =>
  input.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )?.[1] ?? null;

import { Router } from "express";
const router = Router();
const supadata = new Supadata({ apiKey: process.env.SUP_API_KEY ?? "" });
router.post("/api/transcript", async (req, res) => {
  const input = req.body.input;
  if (!input) return "invalid";
  try {
    const transcript = await supadata.transcript({
      url: `https://youtu.be/${getYoutubeId(input) ?? ""}`,lang:"ja"
    });
    // const result = await fetchTranscript(input, { lang: "ja" });
    return res.json(transcript);
  } catch (err) {
   
    return res.json({ error: "invalid" });
  }
});

export const getSub = router;

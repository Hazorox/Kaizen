import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import http from "http";
import axios from "axios";
const api = axios.create({
  httpAgent: new http.Agent({
    keepAlive: false,
  }),
});
const router = Router();
const ankiURL = "http://localhost:8765";
const anki = async (action: string, params = {}, version = 6) => {
  try {
    const result = await api.post(
      ankiURL,
      {
        action,
        version,
        params,
      },
      { headers: { Connection: "close" } },
    );
    if (result.data.error) return `An Error Occurred\n${result.data.error}`;
    return result.data;
  } catch (error) {
    return "ankiNotRunning";
  }
};

const checkKaizenDeck = (deckArr: string[]) => {
  let res = "";
  deckArr.map((deck) => {
    if (deck.toLowerCase().includes("kaizen")) {
      res = deck;
    }
  });
  return res;
};

router.post("/api/anki/connect", authMiddleware, async (req, res) => {
  const response = await anki("deckNames");
  if (response === "ankiNotRunning") return res.status(400).json(response);
  const kaizenDeck = checkKaizenDeck(response.result);
  if (!kaizenDeck) await anki("createDeck", { deck: "Kaizen" });
  return res.status(200).json("Anki Connected !");
});

router.post("/api/anki/getDue", authMiddleware, async (req, res) => {
  const response = await anki("findCards", { query: "is:due" });
  return res.status(200).json(response.result.length);
});
router.post("/api/anki/addCard", authMiddleware, async (req, res) => {
  const response = await anki("addNote", {
    note: {
      deckName: "Kaizen",
      modelName:"Basic",
      fields: {
        Front: "front content",
        Back: "back content",
      },
    },
  });
  return res.status(200).json(response.result)
});
export const ankiUtils = router;

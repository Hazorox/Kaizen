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

router.post("/api/anki/connect", async (req, res) => {
  const response = await anki("deckNames");
  if (response === "ankiNotRunning") return res.json({error:"400"});
  const kaizenDeck = checkKaizenDeck(response.result);
  if (!kaizenDeck) await anki("createDeck", { deck: "Kaizen" });
  return res.status(200).json(kaizenDeck);
});

router.post("/api/anki/getDue", async (req, res) => {
  const response = await anki("findCards", { query: "is:due" });
  if (response == "ankiNotRunning") return res.json({error:"400"});
  return res.status(200).json(response.result.length);
});
router.post("/api/anki/addCard", async (req, res) => {
  const { deckName, front, back } = req.body;
  const response = await anki("addNote", {
    note: {
      deckName,
      modelName: "Basic",
      fields: {
        Front: front,
        Back: back,
      },
      tags: ["Kaizen"],
    },
  });
  if (response == "ankiNotRunning") return res.status(200).json();
  return res.status(200).json(response.result);
});
export const ankiUtils = router;

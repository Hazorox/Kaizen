import axios from "axios";
import { getToken } from "../utils/token";
const api = axios.create({
  baseURL: "http://127.0.0.1:8765",
});
const checkKaizenDeck = (deckArr: string[]) => {
  let res = "";
  deckArr.map((deck) => {
    if (deck.toLowerCase().includes("kaizen")) {
      res = deck;
    }
  });
  return res;
};
const anki = async (action: string, params = {}, version = 6) => {
  try {
    const result = await api.post("/", {
      action,
      version,
      params,
    });
    if (result.data.error) return `An Error Occurred\n${result.data.error}`;
    return result.data;
  } catch (error) {
    return "ankiNotRunning";
  }
};
export const ankiConnect = async () => {
  const token = getToken();
  if (!token) return;
  const response = await anki("deckNames");
  if (response === "ankiNotRunning") return;
  const kaizenDeck = checkKaizenDeck(response.result);
  if (!kaizenDeck) await anki("createDeck", { deck: "Kaizen" });
  return kaizenDeck;
};
export const ankiGetDue = async () => {
  const response = await anki("findCards", { query: "is:due" });
  if (response == "ankiNotRunning") return;
  return response.result.length;
};
export const ankiAddCard = async (front: string, back: string) => {
  let deckName = await ankiConnect();
  if (deckName == "ankiNotRunning") return;

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
  if (response == "ankiNotRunning") return;
  return "success";
};

import API from "./baseAPI";

export const ankiConnect = async () => {
  const res = await API.post("/anki/connect");
  if (res.status == 400) return;
  if (res.status == 200) localStorage.setItem("deckName", res.data);
  return res.data;
};

export const ankiGetDue = async () => {
  const res = await API.post("/anki/getDue");
  if (res.status == 400) return;
  return res.data;
};
export const ankiAddCard = async (front: string, back: string) => {
  if (!localStorage.getItem("deckName")) {
    const ah = await ankiConnect();
    if (!ah) return;
  }
  const deckName = localStorage.getItem("deckName");
  const res = await API.post("/anki/addCard", {
    front,
    back,
    deckName,
  });
  if (res.status == 400) return;
  return res.data;
};

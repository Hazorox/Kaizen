import API from "./baseAPI";

export const getRecents = async () => {
  const res = await API.post("/recents", { five: false });
  if (res.data.error === "nothing") return;
  return res.data;
};
export const getRecentFive = async () => {
  const res = await API.post("/recents", { five: true });
  if (res.data.error === "nothing") return;
  return res.data;
};

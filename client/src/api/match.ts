import API from "./baseAPI";

export const createMatch = async (
  mode: string,
  jlptLevel: string,
  rounds: number,
) => {
  const res = await API.post("create_match", { mode, jlptLevel, rounds });

  return res.data;
};
export const getMatchData = async (id: string|undefined) => {
  if(!id) return "404"
  const res = await API.get(`/match_data/${id}`);
  if (res.data.error) return res.data.error;
  return res.data;
};

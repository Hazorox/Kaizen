import API from "./baseAPI";

export const createMatch = async (
  mode: string,
  jlptLevel: string,
  rounds: number,
) => {
  const res = await API.post("create_match",{mode,jlptLevel,rounds})
  
  return res.data
};

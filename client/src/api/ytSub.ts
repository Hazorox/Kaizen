import API from "./baseAPI";
export const getSub = async (ID: string) => {
  try {
    const res = await API.get(`/transcript/${ID}`);
    return res.data;
  } catch (err: any) {
    return "invalid";
  }
};

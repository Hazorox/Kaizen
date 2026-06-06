import { getToken } from "../utils/token";
import API from "./baseAPI";

export const login = async (username: string, pass: string) => {
  const res = await API.post("/auth/login", { username, pass });
  if (res.data.error === "400") return;
  return res.data;
};
export const register = async (username: string, pass: string) => {
  const res = await API.post("/auth/register", { username, pass });
  if (res.data.error === "409") return;
  return res.data;
};
export const delAcc = async () => {
  const token = getToken() ?? "";
  if (!token) return "Invalid Token";
  const res = await API.delete("/auth/deleteAcc");
  localStorage.removeItem("token");

  return res.data;
};

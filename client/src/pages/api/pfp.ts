import { getToken } from "../utils/token";
import { jwtDecode } from "jwt-decode";
import API from "./baseAPI";
export const updatePFP = async (blob: Blob) => {
  const token = getToken();
  if (token) {
    const username = jwtDecode<{ username: string }>(token).username;
    const form = new FormData();
    form.append("username", username);
    form.append("file", blob);
    const res = await API.put("/updatePFP", form);
    console.log(res);
    console.log("Upload Successful");
    return res.data;
  }
};

export const getPFP = async (user: string) => {
  const res = await API.get(`/pfp/${user}`);
  return res.data;
};

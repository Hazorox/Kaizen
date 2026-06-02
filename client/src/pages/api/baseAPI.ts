import axios from "axios";
import { getToken } from "../utils/token";
const API = axios.create({ baseURL: "http://localhost:9898/api" });
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
export default API
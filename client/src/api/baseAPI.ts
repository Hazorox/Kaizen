import axios from "axios";
import { getToken } from "../utils/token";
const API = axios.create({ baseURL: "http://localhost:9898/api" });
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  },
  (error) => Promise.resolve(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.resolve(error.response),
);
export default API;

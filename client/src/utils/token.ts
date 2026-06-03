import {jwtDecode} from "jwt-decode"
export const saveToken = (token: string) =>
  localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decoded = jwtDecode<{ exp: number}>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

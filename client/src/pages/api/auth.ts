import axios from "axios"
const API = axios.create({baseURL:"http://localhost:9898/api"})
export const login = async (username:string,pass:string) =>{
    const res = await API.post("/auth/login",{username,pass})
    return res.data
}
export const register = async (username:string,pass:string)=>{
    const res = await API.post("/auth/register",{username,pass})
    return res.data
}
import { jwtDecode } from "jwt-decode";
import { getToken } from "./token";
export const getUsername = ()=>{
    const token = getToken()
    if(token){
        const username = jwtDecode<{username:string}>(token).username
        return username
    }
    console.error("No Token Found")
    return "No User Found"
}

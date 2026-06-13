import API from "./baseAPI"

export const getStreak= async()=>{
    const res = await API.get("/streak")
    if(res.data.error) return 0;
    return res.data
}
import API from "./baseAPI"

export const getMined = async ()=>{
    const res = await API.get("/immersion/today")
    if(res.data.error) return;
    return res.data
}
export const getMatches = async ()=>{
    const res = await API.get("/battle/numToday")
    if (res.data.error) return;
    return res.data
}
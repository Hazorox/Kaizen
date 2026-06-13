import API from "./baseAPI"

export const getRecents = async ()=>{
    
    const res = await API.get("/recents")
    if (res.data.error) return;
    return res.data
}
import API from "./baseAPI"

export const getStats =async()=>{
    const res = await API.get("/getStats")
    if(res.data.error) return;
    return res.data
}
export const totalMined = async ()=>{
    const res = await API.get("/getStats/total")
    if(res.data.error) return;
    return res.data
}
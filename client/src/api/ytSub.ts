import API from "./baseAPI";
export const getSub = async (ID:string)=>{
    const res = await API.get(`/transcript/${ID}`)
    return res.data;
}
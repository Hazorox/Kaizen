import API from "./baseAPI";



export const compare_kanji = async (text:string,kanji)=>{
    const res = await API.post("/compare_kanji",{input:text,kanji})
    return res.data.result
}
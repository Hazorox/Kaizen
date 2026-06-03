import API from "./baseAPI";
export const lookupKanji =  async (kanji:string)=>{
    const res = await API.get(`/lookup/kanji/${kanji}`)
    return res.data
}
export const lookupWord = async (word:string)=>{
    
    const res = await API.get(`/lookup/word/${word}`)
    return res.data.words
}


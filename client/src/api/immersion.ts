import API from "./baseAPI";
export const lookupKanji =  async (kanji:string)=>{
    const res = await API.get(`/lookup/kanji/${kanji}`)
    return res.data
}


export const addMinedWord = async (word: string, reading: string, meaning: string) => {
  await API.post('/immersion/add', { word, reading, meaning })
}

export const lookupWord = async (word:string)=>{
    const res = await API.get(`/lookup/word/${word}`)
    return res.data.sort((a:any,b:any)=>(b.is_common?1:0)-(a.is_common?1:0))
}


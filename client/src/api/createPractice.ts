import API from "./baseAPI"

export const createPractce = async ({mode,rounds,level}:{mode:string,rounds:string,level:string})=>{
    try{
        const roundsInt = Number(rounds)
    if (roundsInt > 50 || !["vocab","kanji"].includes(mode)){
        return "invalid"
    }
    const res = await API.post("/create_match",{mode,jlptLevel:level,rounds,solo:true})
    if(res.data.error) return "error"
    return res.data
    }catch (err){
        console.error(err)
        return "error"
    }

}
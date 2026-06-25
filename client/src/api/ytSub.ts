import API from "./baseAPI";
export const getSub = async (input: string) => {
  
    const res = await API.post(`/transcript`,{input});
    if(!res.data.availableLangs.includes("ja")) return []
    if(res.data.error=="404") return []
    if(res.data.error=="invalid") return "invalid"
    return res.data.content.filter(cue=>cue.lang=="ja");
  
};

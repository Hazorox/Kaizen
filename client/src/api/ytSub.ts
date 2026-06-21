import API from "./baseAPI";
export const getSub = async (input: string) => {
  
    const res = await API.post(`/transcript`,{input});
    if(res.data.error) return "invalid"
    return res.data;
  
};

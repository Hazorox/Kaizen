import { YoutubeTranscript } from "youtube-transcript"

export  const getYtSub = async (id:string)=>{
    try{
        const result = await YoutubeTranscript.fetchTranscript(id)
        return result
    }catch(err){
        return "invalid"
    }
}
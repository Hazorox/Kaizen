import { YoutubeTranscript } from "youtube-transcript"

export  const getYtSub = async (id:string)=>{
    const result = await YoutubeTranscript.fetchTranscript(id)
    return result
}
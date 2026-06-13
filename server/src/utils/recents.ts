import { Router } from "express";
import { UserStat } from "../models/UserStat";

const router = Router()

router.get("/api/recents",async(req,res)=>{
    const username = (req as any).user.username
    const user = await UserStat.findOne({username})
    if(!user) return res.json({error:"404"})
    if(!user.mining) return res.json({error:"nothing"})
    console.log(user.mining)
})




export const recents = router
import { Router } from "express";
import multer from "multer";
import { User } from "../models/User";

const router = Router();
const upload = multer();

router.get("/api/pfp/:username",async (req,res)=>{
  const username = req.params.username
  const user = await User.findOne({username})
  if(!user) return res.status(404).json("User Not Found")
  return res.status(200).json(user.profilePic)
})

router.put("/api/updatePFP", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json("No File Uploaded");
    const formData = new FormData();

    const blob = new Blob([new Uint8Array(req.file.buffer)], {
      type: req.file.mimetype,
    });

    formData.append("file", blob, req.body.username);
    const result = await fetch("https://cdn.hackclub.com/api/v4/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CDN_KEY}`,
      },
      body: formData,
    });
    const data = await result.json();
    await User.updateOne(
      { username: req.body.username },
      { $set: { profilePic: data.url } },
    );
    res.json(data);
  } catch (error) {
    res.status(400).json(`An error occured \n${error}`);
  }
});

export const updatePFP = router;

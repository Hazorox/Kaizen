import { Router } from "express";
import { UserStat } from "../models/UserStat";
const router = Router();

router.post("/api/recents", async (req, res) => {
  const username = (req as any).user.username;
  const user = await UserStat.findOne({ username });
  if (!user) return res.json({ error: "404" });
  if (!user.mining) return res.json({ error: "nothing" });
  const miningSorted = user.mining.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );
  let five = false;
  try {
    five = req.body.five;
  } catch {}
  if (!five) {
    const grouped = miningSorted.reduce(
      (acc, item) => {
        const date = new Date(item.time);

        const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        const hour = date.toTimeString().split(" ")[0]; // HH:mm:ss

        if (!acc[day]) {
          acc[day] = [];
        }

        acc[day].push({
          word: item.word ?? "",
          reading: item.reading ?? "",
          meaning: item.meaning ?? "",
          hour,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          word: string;
          reading: string;
          meaning: string;
          hour: string;
        }[]
      >,
    );
    return res.json(grouped);
  }
  if (five) {
    return res.json(miningSorted.slice(0, 5));
  }
});

export const recents = router;

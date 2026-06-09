import { Router } from "express";
import { Matches } from "../models/Match";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
interface round {
  type: "vocab" | "kanji";
  kanji?: string;
  distractors?: string[];
}
interface VocabEntry {
  Original: string;
  Furigana: string;
  English: string;
  Level: string;
}
interface KanjiEntry {
  Kanji: string;
  Level: number;
}
interface vocabRound {
  correct: VocabEntry;
  distractors: VocabEntry[];
}
const loadVocab = (): VocabEntry[] => {
  const file = fs.readFileSync(
    path.join(__dirname, "../data/jlpt_vocab.csv"),
    "utf-8",
  );
  return parse(file, {
    columns: true,
    skip_empty_lines: true,
  });
};

const generateData = (mode: string, rounds: number, level: string) => {
  let data = [];
  const levelNum = level.slice(-1);
  if (mode == "both") {
    const kanjiData = loadKanji().filter(
      (entry) => entry.Level.toString() === levelNum,
    );
    const vocabData = loadVocab().filter((entry) => entry.Level === level);
    // return ["Hiiiii"];
  }
  if (mode == "kanji") {
    const kanjiData = loadKanji().filter(
      (entry) => entry.Level.toString() === levelNum,
    );
    for (let i = 0; i < rounds; i++) {
      const entry = kanjiData[Math.floor(Math.random() * kanjiData.length)];
      data.push(entry);
    }
    return data;
  }
  if (mode == "vocab") {
    const vocabData = loadVocab().filter((entry) => entry.Level === level);
    for (let i = 0; i < rounds; i++) {
      const correctEntry =
        vocabData[Math.floor(Math.random() * vocabData.length)];
      let distractors = [];
      for (let i = 0; i < 3; i++) {
        let entry = vocabData[Math.floor(Math.random() * vocabData.length)];
        while (entry == correctEntry) {
          entry = vocabData[Math.floor(Math.random() * vocabData.length)];
        }
        distractors.push(entry);
      }
      data.push({ correct: correctEntry, distractors });
    }
    return data;
  }
};

const loadKanji = (): KanjiEntry[] => {
  const file = fs.readFileSync(
    path.join(__dirname, "../data/JLPT_kanji_ALL.csv"),
    "utf-8",
  );
  return parse(file, {
    columns: true,
    skip_empty_lines: true,
  });
};
const router = Router();
// Original,Furigana,English,JLPT Level
type modeTypes = "vocab" | "kanji" | "both";
type jlptTypes = "N5" | "N4" | "N3" | "N2" | "N1";
router.post("/api/create_match", async (req, res) => {
  try {
    const roomId = Math.random().toString(36).slice(2, 8);
    const {
      mode,
      jlptLevel,
      rounds,
    }: { mode: modeTypes; jlptLevel: jlptTypes; rounds: number } = req.body;
    let roundsData: KanjiEntry[] | vocabRound[] | string[] = [];
    if (mode == "both") {
      roundsData = generateData("both", rounds, jlptLevel) ?? [];
    }
    if (mode == "vocab") {
      roundsData = generateData("vocab", rounds, jlptLevel) ?? [];
    }
    if (mode == "kanji") {
      roundsData = generateData("kanji", rounds, jlptLevel) ?? [];
    }
    await Matches.create({
      roomId,
      jlptLevel,
      mode,
      rounds: roundsData,
      status: "waiting",
    });

    return res.json(roomId);
  } catch (err) {
    return res.status(200).json({ error: err });
  }
});

export const matches = router;

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
type BothRound = [vocabRound, KanjiEntry];
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

const generateVocab = (level: number): vocabRound => {
  const vocabData = loadVocab().filter(
    (entry) => Number(entry.Level.slice(1)) >= level,
  );
  const correctEntry = vocabData[Math.floor(Math.random() * vocabData.length)];
  let distractors: VocabEntry[] = [];
  for (let i = 0; i < 3; i++) {
    let entry = vocabData[Math.floor(Math.random() * vocabData.length)];
    while (entry == correctEntry) {
      entry = vocabData[Math.floor(Math.random() * vocabData.length)];
    }
    distractors.push(entry);
  }
  return { correct: correctEntry, distractors };
};
const generateKanji = (level: number, rounds: number): KanjiEntry[] => {
  let data: KanjiEntry[] = [];
  const kanjiData = loadKanji().filter(
    (entry) => entry.Level.toString() >= level,
  );
  for (let i = 0; i < rounds; i++) {
    const entry = kanjiData[Math.floor(Math.random() * kanjiData.length)];
    data.push(entry);
  }
  return data;
};

const generateData = (
  mode: string,
  rounds: number,
  levelStr: string,
): KanjiEntry[] | vocabRound[] | BothRound[] | undefined => {
  const level = Number(levelStr.slice(1));

  if (mode == "both") {
    let data: BothRound[] = [];
    for (let i = 0; i < rounds; i++) {
      const kanjiRound = generateKanji(level, 1)[0];
      const vocabRound = generateVocab(level);
      data.push([vocabRound, kanjiRound]);
    }
    return data;
  }
  if (mode == "kanji") {
    return generateKanji(level, rounds);
  }
  if (mode == "vocab") {
    let data: vocabRound[] = [];
    for (let i = 0; i < rounds; i++) {
      const returned = generateVocab(level);
      data.push(returned);
    }
    return data;
  }
  return;
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
    let roundsData: KanjiEntry[] | vocabRound[] | BothRound[] | undefined =
      generateData(mode, rounds, jlptLevel);
    await Matches.create({
      roomId,
      jlptLevel,
      mode,
      rounds: roundsData ?? [],
      status: "waiting",
    });

    return res.json(roomId);
  } catch (err) {
    return res.status(200).json({ error: err });
  }
});

export const matches = router;

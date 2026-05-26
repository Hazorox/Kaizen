import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { glowColors } from "../constants";
import Nav from "../components/Nav";
import { useState } from "react";
import {colors} from "../constants"
const Recents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("type") ?? "all";
  const filterStyles = colors
  const open = useState(false);
  const filterKey = (wordRows: { source: string }[]) => {
    if (filter === "all") return true;
    return wordRows.some(({ source }) => source.toLowerCase() === filter);
  };
  const recents = {
    "2026-5-25": [
      {
        word: "読む",
        reading: "よむ",
        meaning: "to read",
        source: "Anki",
        hour: "00:05:04",
      },
      {
        word: "鶏肉",
        reading: "とりにく",
        meaning: "chiken meat",
        source: "Kanji",
        hour: "18:45:30",
      },
    ],
    "2026-5-24": [
      {
        word: "犬",
        reading: "いぬ",
        meaning: "dog",
        source: "Anki",
        hour: "12:00:01",
      },
      {
        word: "本",
        reading: "ほん",
        meaning: "book",
        source: "Matches",
        hour: "16:40:55",
      },
    ],
    "2026-5-23": [
      {
        word: "遊ぶ",
        reading: "あそぶ",
        meaning: "to play, to have fun, to spend time pleasurely",
        source: "Immersion",
        hour: "04:05:04",
      },
      {
        word: "高校",
        reading: "こうこう",
        meaning: "school",
        source: "Kanji",
        hour: "13:45:30",
      },
    ],
  };
  return (
    <AnimatePresence>
      <motion.div
        layout
        key={open ? "open" : "closed"}
        exit={{ opacity: 0, scale: 0.01 }}
        initial={{ opacity: 0, scale: 0.01 }}
        animate
      ></motion.div>
      <div className="w-full relative h-full bg-[#fffbe6] flex justify-center items-center">
        <Nav />
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.01 }}
          transition={{ duration: 0.8, ease: "anticipate" }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[70%] relative mt-12 flex flex-col gap-4 border-4 items-center h-[80%] p-12 bg-[#4ecdc4] rounded-xl"
        >
          <motion.div
            layout
            className="w-full h-[8%] items-center text-4xl flex justify-between"
          >
            <span>
              最近の言葉 • <b className="select-none">Recent Words</b>
            </span>
            <span className="w-fit select-none h-full text-[#fffbe6] text-base flex justify-between items-center font-bold rounded-xl">
              <motion.span
                layout
                whileHover={{
                  scale: 1.15,
                  boxShadow: "0 0 8px 3px rgba(10,10,10,0.4)",
                }}
                initial={{ scale: 1, boxShadow: "none" }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSearchParams({});
                }}
                className={
                  "bg-[#1a1a2e] border-black text-[#fffbe6]" +
                  " rounded-full cursor-pointer border-2 px-4 py-2 mx-2 my-1"
                }
              >
                All
              </motion.span>
              <motion.span
                layout
                initial={{ scale: 1, boxShadow: "none" }}
                onClick={() => {
                  setSearchParams({ type: "anki" });
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: `0 0 8px 3px ${glowColors["Anki"]}`,
                }}
                transition={{ duration: 0.2 }}
                className={
                  filterStyles.anki +
                  " rounded-full cursor-pointer border-2 text-[#1a1a2e] px-4 py-2 mx-2 my-1"
                }
              >
                Anki
              </motion.span>
              <motion.span
                layout
                initial={{ scale: 1, boxShadow: "none" }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: `0 0 8px 3px ${glowColors["Immersion"]}`,
                }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSearchParams({ type: "immersion" });
                }}
                className={
                  filterStyles.immersion +
                  " rounded-full cursor-pointer border-2 text-[#1a1a2e] px-4 py-2 mx-2 my-1"
                }
              >
                Immersion
              </motion.span>
              <motion.span
                layout
                initial={{ scale: 1, boxShadow: "none" }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: `0 0 8px 3px ${glowColors["Kanji"]}`,
                }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSearchParams({ type: "kanji" });
                }}
                className={
                  filterStyles.kanji +
                  " rounded-full cursor-pointer border-2 text-[#1a1a2e] px-4 py-2 mx-2 my-1"
                }
              >
                Kanji
              </motion.span>
              <motion.span
                layout
                initial={{ scale: 1, boxShadow: "none" }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: `0 0 8px 3px ${glowColors["Matches"]}`,
                }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSearchParams({ type: "matches" });
                }}
                className={
                  filterStyles.matches +
                  " rounded-full cursor-pointer border-2 text-[#1a1a2e] px-4 py-2 mx-2 my-1"
                }
              >
                Matches
              </motion.span>
            </span>
          </motion.div>
          <motion.div
            layout
            className="bg-[#fffbe6] scrollable overflow-y-auto overflow-x-hidden rounded-xl border-8 w-full h-full"
          >
            {Object.entries(recents).map(([key, wordRows]) => {
              const dayName = new Date(key).toLocaleDateString("en-US", {
                weekday: "long",
              });
              if (!filterKey(wordRows)) return;
              return (
                <AnimatePresence>
                  <motion.div layout>
                    {/* Day */}
                    <motion.div
                      layout
                      className="sticky z-100 py-2 flex items-center text-[#fffbe6] px-8 h-fit top-0 bg-[#1a1a2e] w-full rounded-top-xl"
                    >
                      {key} • {dayName}
                    </motion.div>
                    {/* Contents */}
                    <motion.div layout className="flex flex-col gap-1">
                      {wordRows.map(
                        ({ word, meaning, reading, source, hour }) => {
                          const styles =
                            source == "Anki"
                              ? filterStyles.anki
                              : source == "Immersion"
                                ? filterStyles.immersion
                                : source == "Kanji"
                                  ? filterStyles.kanji
                                  : filterStyles.matches;
                          if (filter != source.toLowerCase() && filter != "all")
                            return;
                          return (
                            <motion.div
                              onClick={() => {
                                window.open(
                                  `https://jisho.org/search/${word}`,
                                  "_blank",
                                );
                              }}
                              layout
                              className="flex border-b-2 py-3 justify-between px-8"
                            >
                              <span className="w-fit flex justify-around items-center">
                                <span className="w-24 text-center text-2xl">
                                  {word}
                                </span>
                                <span className="text-xl opacity-85 mr-12 w-50 text-center">
                                  {reading}
                                </span>
                                <span className="font-extrabold">
                                  {meaning[0].toUpperCase() + meaning.slice(1)}
                                </span>
                              </span>
                              <span className="flex items-center gap-8">
                                <span
                                  className={
                                    styles +
                                    " border-2 rounded-full w-28 py-1 text-center font-bold block"
                                  }
                                >
                                  {source}
                                </span>
                                <span className="w-16 text-right">{hour}</span>
                              </span>
                            </motion.div>
                          );
                        },
                      )}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              );
            })}
          </motion.div>
          <motion.span layout className="absolute bottom-1">
            Psst, click on a row to check definiton on{" "}
            <a
              className="underline text-blue-900"
              href="https://jisho.org"
              target="_blank"
            >
              Jisho
            </a>
          </motion.span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Recents;

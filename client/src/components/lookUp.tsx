import { AnimatePresence, motion } from "motion/react";
import { addMinedWord, lookupWord } from "../api/immersion";
import { useEffect, useState } from "react";
import { IoBookOutline } from "react-icons/io5";
import { PiSpeakerHighBold } from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import { colors } from "../constants";
import { ankiAddCard } from "../api/anki";
import toast, { Toaster } from "react-hot-toast";
const LookUp = ({
  text,
  sub = true,
  shown = true,
}: {
  sub?: boolean;
  shown: boolean;
  text: string;
}) => {
  // Defining the type of entries to make a type of list of them would be long and not really important, so ditched it
  const [data, setData] = useState(null);
  const [audio, setAudio] = useState("");
  const failedAddCard = () => {
    toast.error("Failed. Check if Anki is open or the card already exists.", {
      icon: <img src="/anki.svg" />,
      style: {
        background: "#e87d81",
        color: "#fffbe6",
      },
    });
  };
  useEffect(() => {
    async function fetchStuff() {
      if (!text) return;

      const result = await lookupWord(text);

      setData(result);
      setAudio(result?.[0]?.audio ?? "");
      if (result?.[0]) {
        const entry = result[0];
        addMinedWord(
          entry.reading.kanji || entry.reading.kana,
          entry.reading.kanji ? entry.reading.kana : "",
          entry.senses?.[0]?.glosses?.join(", ") ?? "",
        );
      }
    }

    fetchStuff();
  }, [text]);
  return (
    <AnimatePresence>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2500, removeDelay: 750 }}
      />
      {data && (
        <motion.div
          // initial={{ scaleY: 0, opacity: 0 }}
          // animate={{ scaleY: 1, opacity: 1 }}
          // exit={{ scaleY: 0, opacity: 0 }}

          style={{ transformOrigin: "bottom" }}
          exit={{ scaleY: 0, opacity: 0 }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ ease: "linear", duration: 0.3 }}
          key={shown ? (data ? "Lookup" : "NoLookup") : "hiddenLookup"}
          layout
          className={`flex relative flex-col gap-2 bg-[#032d66] ${sub ? "h-[55%]" : "h-[95%]"}`}
        >
          {/* Content */}
          <motion.div
            className={`flex overflow-y-auto overflow-x-hidden scrollable  gap-4 text-[#fffbe6] flex-col`}
          >
            {/* Got some help for this with Claude, it was annoying... */}
            {data.map((entry, entryIndex) => {
              const front = `
<div style="text-align:center; font-family:sans-serif;">
  <h1 style="font-size:2em; margin:0;">${entry.reading.kanji || entry.reading.kana}</h1>
  ${entry.reading.kanji ? `<h2 style="font-size:1.3em; opacity:0.7; margin:4px 0;">${entry.reading.kana}</h2>` : ""}
</div>`;

              const back = `
<div style="font-family:sans-serif; padding:8px;">
  ${entry.senses
    .slice(0, 3)
    .map(
      (sense, i) => `
    <div style="margin-bottom:8px;">
      <div style="font-size:0.75em; color:#888;">
        ${sense.pos?.map((p) => (typeof p === "string" ? p : Object.keys(p)[0])).join(", ")}
      </div>
      <div>${i + 1}. ${sense.glosses.join(", ")}</div>
    </div>
  `,
    )
    .join("")}
  ${
    entry.pitch?.length > 0
      ? `
    <div style="margin-top:8px; font-size:0.9em; opacity:0.7;">
      Pitch: ${entry.pitch.map((p) => (p.high ? `<u>${p.part}</u>` : p.part)).join("")}
    </div>
  `
      : ""
  }
</div>`;
              return (
                <div
                  key={entryIndex}
                  className="p-4 relative flex flex-col gap-3"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {entry.reading.kanji || entry.reading.kana}
                    </span>

                    {entry.reading.kanji && (
                      <span className="text-lg opacity-70">
                        {entry.reading.kana}
                      </span>
                    )}

                    {entry.common && (
                      <span className="px-2 py-1 rounded bg-green-700 text-xs">
                        Common
                      </span>
                    )}
                    <motion.button
                      onClick={async () => {
                        const res = await ankiAddCard(front, back);
                        if (!res) failedAddCard();
                        if (res) toast.success("Successfully Added the Card !");
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.15 }}
                      className={`${colors.anki} cursor-pointer rounded-full border-2 text-[#1a1a2e] font-bold flex gap-2 p-2`}
                    >
                      <img src="/anki.svg" className="h-6 w-6" /> Add to Anki
                    </motion.button>
                  </div>

                  {/* Meanings */}
                  <div className="flex flex-col gap-2">
                    {entry.senses.slice(0, 5).map((sense, index) => (
                      <div key={index}>
                        <div className="text-sm text-yellow-300">
                          {sense.pos
                            ?.map((p) =>
                              typeof p === "string" ? p : Object.keys(p)[0],
                            )
                            .join(", ")}
                        </div>

                        <div>• {sense.glosses.join(", ")}</div>

                        {sense.information && (
                          <div className="text-xs opacity-60">
                            {sense.information}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pitch Accent */}
                  {entry.pitch?.length > 0 && (
                    <div className="text-lg opacity-80">
                      Pitch:{" "}
                      {entry.pitch.map((part) => (
                        <span
                          key={part.part}
                          className={part.high ? "underline" : ""}
                        >
                          {part.part}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-full bg-[#1a1a2e] h-1" />
                </div>
              );
            })}
          </motion.div>
          <motion.div
            layout
            className={`absolute right-4 top-2 p-2 flex justify-center items-center gap-4${!sub && " flex-col"}`}
          >
            {audio && (
              <>
                <Tooltip id="audio" />
                <motion.button
                  onClick={() => {
                    if (!audio) return;
                    new Audio(`https://jotoba.de${audio}`).play();
                  }}
                  className={`flex justify-center items-center p-1 rounded-full border-2 w-12 h-12 bg-[#ff9a3c] ${audio ? "cursor-pointer" : "cursor-not-allowed"}`}
                  initial={{ scale: 0, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.01, opacity: 0 }}
                  whileHover={{ scale: 1.15 }}
                  data-tooltip-id="audio"
                  data-tooltip-content="Play Available Audio"
                  data-tooltip-place="bottom"
                  key={audio ? "audioKey" : "Not Audio Key hehe"}
                >
                  <PiSpeakerHighBold size={28} />
                </motion.button>
              </>
            )}
            <Tooltip id="jisho" />
            <motion.button
              data-tooltip-content="Lookup on Jisho.org"
              data-tooltip-id="jisho"
              data-tooltip-place="bottom-start"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#ff9a3c] rounded-full p-1 flex justify-center items-center border-2 w-12 h-12 cursor-pointer"
              onClick={() => {
                open(`https://jisho.org/search/${text}`);
              }}
            >
              <IoBookOutline size={28} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      {!data && (
        <motion.div
          style={{ transformOrigin: "bottom" }}
          exit={{ scaleY: 0, opacity: 0 }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ ease: "linear", duration: 0.4 }}
          key={shown ? (data ? "Lookup" : "NoLookup") : "hiddenLookup"}
          layout
          className={`${sub ? "h-[55%]" : "h-full"} flex justify-center items-center text-center text-xl text-[#fffbe6]/90 bg-[#032d66] w-full`}
        >
          Select Text To Lookup
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LookUp;

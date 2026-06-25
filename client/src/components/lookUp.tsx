import { AnimatePresence, motion } from "motion/react";
import { addMinedWord, lookupWord } from "../api/immersion";
import { useEffect, useRef, useState } from "react";
import { IoBookOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { colors } from "../constants";
import { ankiAddCard } from "../api/anki";
import toast, { Toaster } from "react-hot-toast";
import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import Split from "split.js";
const LookUp = ({
  sub = null,
  time = 0,
  shown,
}: {
  time?: number;
  sub?: any[] | null;
  shown: boolean;
}) => {
  if (!shown) return;
  const lookupRef = useRef<HTMLInputElement>(null);
  const subBarRef = useRef<HTMLDivElement>(null);
  const activeCueIDRef = useRef<string>("");

  const [text, setText] = useState("");
  const [lookupInput, setLookupInput] = useState("");
  // Defining the type of entries to make a type of list of them would be long and not really important, so ditched it
  const [data, setData] = useState(null);
  // const [audio, setAudio] = useState("");
  const failedAddCard = () => {
    toast.error(
      "Failed. Check if Anki is running and the card doesn't exit.\nAlso try resyncing the deck from UserProfile",
      {
        icon: <img src="/anki.svg" />,
        style: {
          background: "#e87d81",
          color: "#fffbe6",
        },
      },
    );
  };
  useEffect(() => {
    async function fetchStuff() {
      if (!text) return;

      const result = await lookupWord(text);
      document
        .getElementById("SCROLLME")
        ?.scrollTo({ top: 0, behavior: "smooth" });
      setData(result);
      // setAudio(result?.[0]?.audio ?? "");
      if (result?.[0]) {
        const entry = result[0];
        addMinedWord(
          entry.japanese[0].word || entry.japanese[0].reading,
          entry.japanese[0].word ? entry.japanese[0].reading : "",
          entry.senses?.[0]?.english_definitions?.join(", ") ?? "",
        );
      }
    }

    fetchStuff();
  }, [text]);
  useEffect(() => {
    if (!sub) return;
    const activeIndex = sub.findIndex((cue: any) => {
      if (cue.from !== undefined) {
        return time >= cue.from / 1000 && time <= cue.to / 1000;
      } else {
        return (
          time >= cue.offset / 1000 &&
          time <= (cue.offset + cue.duration) / 1000
        );
      }
    });
    if (activeIndex === -1 || activeIndex === Number(activeCueIDRef.current))
      return;

    activeCueIDRef.current = String(activeIndex);

    requestAnimationFrame(() => {
      subBarRef.current
        ?.querySelector(`[data-cue-id="${activeIndex}"]`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });
  }, [time, sub]);

  // Lookup
  useEffect(() => {
    if (!sub) return;
    const handleMouseUp = () => {
      const word = window.getSelection()?.toString().trim();
      if (!word || word === text) return;
      setText(word);
    };
    document
      .getElementById("subBar")
      ?.addEventListener("mouseup", handleMouseUp);
    return () =>
      document
        .getElementById("subBar")
        ?.removeEventListener("mouseup", handleMouseUp);
  }, [sub, time]);

  //Got some help from claude coz split.js kept remaking instances on every lookup :melt:

  const splitRef = useRef<ReturnType<typeof Split> | null>(null);

  useEffect(() => {
    if (!sub || sub.length === 0) return;

    const timeout = setTimeout(() => {
      const subBar = document.getElementById("subBar");
      const lookup = document.getElementById("lookup");
      if (!subBar || !lookup) return;

      // Only initialize if not already running
      if (splitRef.current) return;

      splitRef.current = Split(["#subBar", "#lookup"], {
        sizes: [45, 55],
        minSize: [100, 100],
        gutterSize: 8,
        cursor: "row-resize",
        direction: "vertical",
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [sub, data]);

  // Separate cleanup only when sub goes away
  useEffect(() => {
    if (!sub) {
      splitRef.current?.destroy();
      splitRef.current = null;
    }
  }, [sub]);
  return (
    <AnimatePresence>
      <motion.div
        layout
        id="side"
        className={`flex-col bg-[#032d66] h-full flex`}
      >
        <Toaster
          toasterId="side"
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2500, removeDelay: 750 }}
        />
        {/* PDF, Video No Sub, YT No Sub Found */}
        {(!sub || sub.length == 0) && (
          <motion.div className="w-full h-[10%] py-2 flex items-center justify-center">
            <motion.span className="flex items-center text-[#fffbe6]/80 relative w-[85%] self-center mt-2">
              <motion.input
                ref={lookupRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setText(lookupInput);
                  }
                }}
                onChange={(e) => {
                  setLookupInput(e.target.value);
                }}
                className="w-full h-full  p-4 placeholder:text-[#fffbe6]/90 border-4 border-[#fffbe6]/20! text-lg pl-16 rounded-full px-14  bg-[#1a1a2e]/70"
                placeholder="Text to Lookup"
              />
              <FaSearch size={36} className="inline absolute left-2" />
              <motion.span
                initial={{ opacity: "85%" }}
                transition={{ duration: 0.15 }}
                whileTap={{ x: 10 }}
                onClick={() => {
                  setText(lookupRef.current?.value ?? "");
                }}
                whileHover={{ opacity: "100%", scale: 1.1 }}
                className="flex cursor-pointer text-[#fffbe6] absolute right-2 justify-center items-center w-fit h-fit"
              >
                <FaArrowCircleRight size={40} />
              </motion.span>
            </motion.span>
          </motion.div>
        )}
        {/* Vid or YT with Sub */}
        {sub && sub.length != 0 && (
          <motion.div
            ref={subBarRef}
            id="subBar"
            layout
            className={`h-full overflow-x-clip flex-wrap overflow-y-scroll scrollable bg-[#fffbe6]/50`}
          >
            {sub.map((cue, index) => {
              let focused = false;
              if (cue.to) {
                focused = time < cue.to / 1000 && time > cue.from / 1000;
              } else {
                const start = cue.offset / 1000;
                const end = start + cue.duration / 1000;
                focused = time < end && time > start;
              }
              return (
                <motion.span
                  key={index}
                  data-cue-id={index}
                  className="w-full pt-4 relative block"
                >
                  <motion.span
                    key={index + " text"}
                    animate={{
                      fontSize: focused ? "36px" : "30px",
                      opacity: focused ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.2 }}
                    className="pl-4 block"
                  >
                    {cue.text}
                  </motion.span>
                  <motion.div
                    key={index + " divider"}
                    className="h-1.5 mt-4 bg-black/70 w-full"
                  />
                </motion.span>
              );
            })}
          </motion.div>
        )}

        {/* Lookup data */}

        <motion.div
          // initial={{ scaleY: 0, opacity: 0 }}
          // animate={{ scaleY: 1, opacity: 1 }}
          // exit={{ scaleY: 0, opacity: 0 }}

          style={{ transformOrigin: "bottom" }}
          exit={{ scaleY: 0, opacity: 0 }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ ease: "linear", duration: 0.3 }}
          key={shown ? "lookup": "hiddenLookup"}
          layout
          id="lookup"
          className={`flex relative flex-col gap-2 h-full`}
        >
          {!data && (
            <motion.div
              className={`h-full flex justify-center items-center text-center text-xl text-[#fffbe6]/90 w-full`}
            >
              Select Text To Lookup
            </motion.div>
          )}
          {/* Content */}
          {data && (
            <>
              {" "}
              <motion.div
                id="SCROLLME"
                className={`flex overflow-y-auto overflow-x-hidden scrollable  gap-4 text-[#fffbe6] flex-col`}
              >
                {/* Got some help for this with Claude, it was annoying... */}
                {data.map((entry, entryIndex) => {
                  const word = entry.japanese[0].word ?? null;
                  const reading = entry.japanese[0].reading;
                  const front = `
<div style="text-align:center; font-family:sans-serif;">
  <h1 style="font-size:2em; margin:0;">${word || reading}</h1>
  ${word ? `<h2 style="font-size:1.3em; opacity:0.7; margin:4px 0;">${reading}</h2>` : ""}
</div>`;

                  const back = `
<div style="font-family:sans-serif; padding:8px;">
  ${entry.senses
    .slice(0, 3)
    .map(
      (sense, i) => `
    <div style="margin-bottom:8px;">
      <div style="font-size:0.75em; color:#888;">
        ${sense.parts_of_speech?.map((p) => (typeof p === "string" ? p : Object.keys(p)[0])).join(", ")}
      </div>
      <div>${i + 1}. ${sense.english_definitions.join(", ")}</div>
    </div>
  `,
    )
    .join("")}
  
</div>`;

                  //TODO: when jotoba is back turn this back above in the string
                  // ${
                  //     entry.pitch?.length > 0
                  //       ? `
                  //     <div style="margin-top:8px; font-size:0.9em; opacity:0.7;">
                  //       Pitch: ${entry.pitch.map((p) => (p.high ? `<u>${p.part}</u>` : p.part)).join("")}
                  //     </div>
                  //   `
                  //       : ""
                  //   }
                  return (
                    <div
                      key={entryIndex}
                      className="p-4 relative flex flex-col gap-3"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-3xl">
                          {entry.japanese[0].word || entry.japanese[0].reading}
                        </span>

                        {entry.japanese[0].word && (
                          <span className="text-lg opacity-70">
                            {entry.japanese[0].reading}
                          </span>
                        )}

                        {!entry.is_common && (
                          <span className="px-2 py-1 rounded bg-green-700 text-xs">
                            Uncommon
                          </span>
                        )}
                        <motion.button
                          onClick={async () => {
                            const res = await ankiAddCard(front, back);
                            if (!res) failedAddCard();
                            if (res)
                              toast.success("Successfully Added the Card !");
                          }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.15 }}
                          className={`${colors.anki} cursor-pointer rounded-full border-2 text-[#1a1a2e] font-bold flex gap-2 p-2`}
                        >
                          <img src="/anki.svg" className="h-6 w-6" /> Add to
                          Anki
                        </motion.button>
                      </div>

                      {/* Meanings */}
                      <div className="flex flex-col gap-2">
                        {entry.senses.slice(0, 5).map((sense, index) => (
                          <div key={index}>
                            <div className="text-sm text-yellow-300">
                              {sense.parts_of_speech
                                ?.map((p) =>
                                  typeof p === "string" ? p : Object.keys(p)[0],
                                )
                                .join(", ")}
                            </div>

                            <div>• {sense.english_definitions.join(", ")}</div>

                            {/* {sense.information && (
                          <div className="text-xs opacity-60">
                            {sense.information}
                          </div>
                        )} */}
                          </div>
                        ))}
                      </div>

                      {/* Pitch Accent */}
                      {/* {entry.pitch?.length > 0 && (
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
                  )} */}
                      <div className="absolute bottom-0 right-0 w-full bg-[#1a1a2e] h-1" />
                    </div>
                  );
                })}
              </motion.div>
              <motion.div
                layout
                className={`absolute right-4 top-2 p-2 flex justify-center items-center gap-4${!sub && " flex-col"}`}
              >
                {/* {audio && (
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
            )} */}
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
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LookUp;

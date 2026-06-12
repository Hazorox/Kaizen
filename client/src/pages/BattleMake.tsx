import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { MdInfoOutline, MdMeetingRoom } from "react-icons/md";
import { FaArrowCircleRight } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { LuSwords } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { createMatch } from "../api/match";
const Battle = () => {
  const nav = useNavigate();
  const idRef = useRef<HTMLInputElement>(null);
  const [idInput, setIdInput] = useState("");
  const [makerShown, setMakerShown] = useState(false);
  const [selections, setSelections] = useState<{
    mode: string;
    jlptLevel: string;
    rounds: number;
  }>({ mode: "vocab", jlptLevel: "N5", rounds: 3 });
  useEffect(() => {
    const listenForEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (idInput.length != 6)
          return toast.error("Room ID must be 6 characters long");
        if (idInput) return nav(`/battle/${idInput}`);
      }
    };

    idRef.current?.addEventListener("keypress", listenForEnter);
    return () => idRef.current?.removeEventListener("keypress", listenForEnter);
  });
  return (
    <AnimatePresence>
      <Toaster key={"toaster"} />
      <motion.div
        onClick={() => {
          setMakerShown(false);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "linear" }}
        key={makerShown ? "makerShown" : "makerHidden"}
        layout
        className={`${!makerShown && "hidden"} w-full font-bold h-full z-100 absolute bg-[#1a1a2e]/55 flex justify-center items-center`}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.01, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backInOut" }}
          exit={{ scale: 0.01, opacity: 0 }}
          layout
          className="bg-[#fffbe6] flex flex-col justify-around gap-12 relative border-2 w-[50%] h-[60%] p-8 rounded-xl"
        >
          <span
            key={"title"}
            className="w-full flex justify-center items-center gap-6 text-4xl"
          >
            {" "}
            <LuSwords size={"48"} className="mt-2" />
            Match Creator <LuSwords size={"48"} className="mt-2" />{" "}
          </span>
          <span
            className="w-full flex justify-around items-center"
            key={"JLPT"}
          >
            <Tooltip id="jlpt" />
            <span
              className="text-2xl"
              data-tooltip-id="jlpt"
              data-tooltip-content={
                "Contains from JLPT N5 to the chosen JLPT level"
              }
            >
              JLPT Level
            </span>
            <span className="flex w-1/2 justify-between items-center gap-6">
              {["N5", "N4", "N3", "N2", "N1"].map((jlptLevel) => (
                <motion.div
                  key={jlptLevel}
                  onClick={() => {
                    setSelections((prev) => {
                      return {
                        ...prev,
                        jlptLevel,
                      };
                    });
                  }}
                  className={`${selections.jlptLevel == jlptLevel ? "bg-[#1a1a2e] text-[#fffbe6]" : "bg-[#fffbe6] text-[#1a1a2e]"} cursor-pointer border-2 p-2 px-4 tracking-widest rounded-full  flex justify-center items-center`}
                >
                  {jlptLevel}
                </motion.div>
              ))}
            </span>
          </span>
          <span className="w-full flex justify-between px-12 items-center">
            <span className="text-3xl">Rounds</span>
            <motion.span
              layout
              className="min-w-[36%] max-h-fit overflow-clip max-w-fit relative border-2 flex justify-center items-center text-4xl rounded-full py-4"
            >
              <motion.button
                key={"-"}
                onClick={() =>
                  setSelections((prev) => {
                    if (!prev) return;
                    return {
                      ...prev,
                      rounds: Math.max(1, (prev?.rounds ?? 1) - 1),
                    };
                  })
                }
                whileTap={{ scale: 1.1 }}
                initial={{ opacity: 0.95 }}
                whileHover={{ opacity: 1 }}
                className="absolute  cursor-pointer text-[#fffbe6] text-6xl left-0  cursor-pointerflex items-center justify-center bg-[#1a1a2e] w-16 h-full rounded-full border"
              >
                -
              </motion.button>
              {selections?.rounds}
              <motion.button
                key={"+"}
                onClick={() =>
                  setSelections((prev) => {
                    if (!prev) return;
                    return {
                      ...prev,
                      rounds: Math.min(7, (prev?.rounds ?? 1) + 1),
                    };
                  })
                }
                whileTap={{ scale: 1.1 }}
                initial={{ opacity: 0.95 }}
                whileHover={{ opacity: 1 }}
                className="absolute text-[#fffbe6]  cursor-pointer text-6xl right-0 cursor-pointer flex items-center justify-center bg-[#1a1a2e] w-16 h-full rounded-full border"
              >
                +
              </motion.button>
            </motion.span>
          </span>
          <span className="w-full flex justify-around items-center">
            <span className="text-3xl">Mode</span>
            <span className="w-1/2 flex justify-between items-center">
              <Tooltip id="both" />
              {["Both", "Vocab", "Kanji"].map((modeStr) => (
                <motion.div
                  data-tooltip-id={modeStr == "Both" ? "both" : ""}
                  data-tooltip-content={"This will result in Double Rounds"}
                  data-tooltip-place="top"
                  onClick={() => {
                    setSelections((prev) => ({
                      ...prev,
                      mode: modeStr.toLowerCase(),
                    }));
                  }}
                  className={`${selections.mode === modeStr.toLowerCase() ? "bg-[#1a1a2e] text-[#fffbe6]" : "bg-[#fffbe6] text-[#1a1a2e]"} flex justify-center items-center gap-4 cursor-pointer border-2 rounded-full p-4 text-xl`}
                  key={modeStr}
                >
                  {modeStr} {modeStr == "Both" && <MdInfoOutline size={24} />}
                </motion.div>
              ))}
            </span>
          </span>
          <span className="flex justify-center items-center">
            <motion.button
              onClick={async () => {
                toast.promise(
                  async () => {
                    const id = await createMatch(
                      selections.mode,
                      selections.jlptLevel,
                      selections.rounds,
                    );
                    if (!id) return;
                    nav(`/battle/${id}`);
                  },
                  {
                    loading: "Creating Match...",
                    error: "An Error Occurred",
                  },
                );
              }}
              className="flex text-2xl border-4 p-2 py-4 cursor-pointer rounded-full w-1/3 bg-[#3dce3d] justify-center gap-6 items-center"
            >
              Create Match
            </motion.button>
          </span>
        </motion.div>
      </motion.div>

      <div className="w-full select-none h-full text-[#1a1a2e] bg-[#fffbe6] font-extrabold flex justify-center items-center">
        {" "}
        <Nav showBattle={false} />
        <motion.div
          layout
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="w-[60%] h-[70%] bg-[#4ecdc4] justify-between  items-center p-8 rounded-xl border-4 flex flex-col"
        >
          <span key={"title"} className="text-7xl">
            Matches
          </span>
          <span
            key={"contents"}
            className="w-full flex flex-col gap-8 justify-around h-fit items-center"
          >
            <motion.button
              onClick={() => {
                setMakerShown(true);
              }}
              whileTap={{ scale: 1.2 }}
              whileHover={{ scale: 1.15 }}
              key={"createMatch"}
              className="text-4xl p-8 cursor-pointer rounded-full border-3 bg-[#3dce3d]"
            >
              Create Match
            </motion.button>
            <div className="flex flex-col rounded-2xl w-fit p-8 border-3 bg-[#ff9a3c] gap-12 justify-center items-center">
              <span key={"text"} className="text-4xl">
                Join Match
              </span>
              <span
                key={"input"}
                className="relative w-full flex justify-center items-center"
              >
                <MdMeetingRoom
                  className="absolute left-4 text-[#fffbe6]/90"
                  size={48}
                />
                <motion.input
                  ref={idRef}
                  whileFocus={{
                    boxShadow: "0 0 0 3px rgba(0,0,0, 0.2)",
                    borderColor: "#FF9A3C",
                  }}
                  onChange={(e) => {
                    setIdInput(e.target.value);
                  }}
                  placeholder="Room ID"
                  className="w-full placeholder:text-[#fffbe6]/75 text-[#fffbe6]/90 py-6 bg-[#1a1a2e]/85 pl-20 rounded-full"
                  maxLength={6}
                />
                <motion.span
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ opacity: 1, x: 20 }}
                  className="absolute cursor-pointer text-[#fffbe6] right-4"
                >
                  <FaArrowCircleRight
                    onClick={() => {
                      if (idInput.length != 6)
                        toast.error("Room ID must be 6 characters long");
                      if (idInput) nav(`/battle/${idInput}`);
                    }}
                    size={48}
                  />
                </motion.span>
              </span>
            </div>
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Battle;

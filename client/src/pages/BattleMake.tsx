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
import { FaX } from "react-icons/fa6";
const Battle = () => {
  const nav = useNavigate();
  const idRef = useRef<HTMLInputElement>(null);
  const [idInput, setIdInput] = useState("");
  const [makerShown, setMakerShown] = useState(false);
  const [practiceShown, setPracticeShown] = useState(false);
  const [practice, setPractice] = useState<{
    mode:string,jlptLevel: string;rounds:number
  }>({ mode:"vocab",jlptLevel: "N5",rounds:1});
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
      <Toaster key={"toaster"} position="bottom-center" />
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
          className="bg-[#fffbe6] flex flex-col justify-around gap-12 relative border-2 w-[80%] lg:w-[55%] h-[60%] p-8 rounded-xl"
        >
          <FaX
            onClick={() => {
              setMakerShown(false);
            }}
            className="inline absolute top-8 cursor-pointer right-8"
            size={36}
          />
          <span
            key={"title"}
            className="w-full flex justify-center items-center text-center gap-6 text-4xl"
          >
            {" "}
            <LuSwords size={"48"} className="mt-2" />
            Match Creator{" "}
            <LuSwords size={"48"} className="mt-2 hidden lg:inline" />{" "}
          </span>
          <span
            className="w-full flex justify-around items-center"
            key={"JLPT"}
          >
            <Tooltip id="jlpt" />
            <span
              className="text-2xl flex justify-center items-center gap-3"
              data-tooltip-id="jlpt"
              data-tooltip-content={
                "Contains from JLPT N5 to the chosen JLPT level"
              }
            >
              JLPT Level <MdInfoOutline size={36} className="inline mt-1" />
            </span>
            <span className="flex w-3/4 mx-2 lg:w-1/2 justify-between items-center gap-1 lg:gap-6">
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
          <span className="w-full flex justify-between px-4 lg:px-12 items-center">
            <span className="text-3xl">Rounds</span>
            <motion.span
              layout
              className="min-w-1/2 lg:min-w-[36%] max-h-fit overflow-clip max-w-fit relative border-2 flex justify-center items-center text-4xl rounded-full py-4"
            >
              <motion.button
                key={"-"}
                onClick={() =>
                  setSelections((prev) => {
                    return {
                      ...prev,
                      rounds: Math.max(1, (prev?.rounds ?? 1) - 1),
                    };
                  })
                }
                whileTap={{ scale: 1.1 }}
                initial={{ opacity: 0.95 }}
                whileHover={{ opacity: 1 }}
                className="absolute  cursor-pointer text-[#fffbe6] text-6xl left-0 flex items-center justify-center bg-[#1a1a2e] w-16 h-full rounded-full border"
              >
                -
              </motion.button>
              {selections?.rounds}
              <motion.button
                key={"+"}
                onClick={() =>
                  setSelections((prev) => {
                    return {
                      ...prev,
                      rounds: Math.min(7, (prev?.rounds ?? 1) + 1),
                    };
                  })
                }
                whileTap={{ scale: 1.1 }}
                initial={{ opacity: 0.95 }}
                whileHover={{ opacity: 1 }}
                className="absolute text-[#fffbe6]  cursor-pointer text-6xl right-0 flex items-center justify-center bg-[#1a1a2e] w-16 h-full rounded-full border"
              >
                +
              </motion.button>
            </motion.span>
          </span>
          <span className="w-full flex justify-around items-center">
            <span className="text-3xl">Mode</span>
            <span className="min-w-2/3 px-2 gap-2 lg:w-1/2 flex  justify-between items-center">
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
                  className={`${selections.mode === modeStr.toLowerCase() ? "bg-[#1a1a2e] text-[#fffbe6]" : "bg-[#fffbe6] text-[#1a1a2e]"} flex justify-center items-center gap-4 cursor-pointer border-2 rounded-full p-4 lg:text-xl`}
                  key={modeStr}
                >
                  {modeStr} {modeStr == "Both" && <MdInfoOutline size={24} />}
                </motion.div>
              ))}
            </span>
          </span>
          <span className="flex justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.25 }}
              onClick={async () => {
                toast.promise(
                  async () => {
                    await createMatch(
                      selections.mode,
                      selections.jlptLevel,
                      selections.rounds,
                    )
                      .then((id) => {
                        nav(`/battle/${id}`);
                      })
                      .catch((err) => {
                        console.error(err);
                      });
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
      <motion.div
        onClick={() => {
          setPracticeShown(false);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "linear" }}
        key={practiceShown ? "practiceShown" : "makerHidden"}
        layout
        className={`${!practiceShown && "hidden"} w-full font-bold h-full z-100 absolute bg-[#1a1a2e]/55 flex justify-center items-center`}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.01, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backInOut" }}
          exit={{ scale: 0.01, opacity: 0 }}
          layout
          className="bg-[#fffbe6] flex flex-col justify-around gap-12 relative border-2 w-[80%] lg:w-[55%] h-[60%] p-8 rounded-xl"
        >
          <FaX
            onClick={() => {
              setPracticeShown(false);
            }}
            className="inline absolute top-8 cursor-pointer right-8"
            size={36}
          />
          <span
            key={"title"}
            className="w-full flex justify-center items-center text-center gap-6 text-4xl"
          >
            Practice Creator{" "}
          </span>
          <span
            className="w-full flex justify-around items-center"
            key={"JLPT"}
          >
            <Tooltip id="jlpt" />
            <span
              className="text-2xl flex justify-center items-center gap-3"
              data-tooltip-id="jlpt"
              data-tooltip-content={
                "Contains from JLPT N5 to the chosen JLPT level"
              }
            >
              JLPT Level <MdInfoOutline size={36} className="inline mt-1" />
            </span>
            <span className="flex w-3/4 mx-2 lg:w-1/2 justify-between items-center gap-1 lg:gap-6">
              {["N5", "N4", "N3", "N2", "N1"].map((jlptLevel) => (
                <motion.div
                  key={jlptLevel}
                  onClick={() => {
                    setPractice((prev) => {
                      return {
                        ...prev,
                        jlptLevel,
                      };
                    });
                  }}
                  className={`${practice.jlptLevel == jlptLevel ? "bg-[#1a1a2e] text-[#fffbe6]" : "bg-[#fffbe6] text-[#1a1a2e]"} cursor-pointer border-2 p-2 px-4 tracking-widest rounded-full  flex justify-center items-center`}
                >
                  {jlptLevel}
                </motion.div>
              ))}
            </span>
          </span>
          <span className="w-full flex justify-between px-4 lg:px-12 items-center">
            <span className="text-3xl w-1/4">Mode</span>
            <div className="flex border-2 hover:cursor-pointer rounded-lg overflow-hidden w-1/2 relative">
                   
                    <motion.div
                      animate={{ x: practice.mode=="vocab" ? 0 : "100%" }}
                      transition={{ duration: 0.15, ease: "linear" }}
                      className="absolute  top-0 left-0 w-1/2 h-full bg-[#FF9A3C] z-0"
                    />
                    <span
                      onClick={() => {setPractice(prev=>{ return {...prev,mode:"vocab"}})}}
                      className="relative select-none z-10 flex justify-center items-center py-2 w-1/2 px-5 lg:px-10"
                    >
                      Vocab
                    </span>
                    <div
                      key="divider"
                      className="w-0.5 bg-[#1a1a2e] z-10 relative"
                    />
                    <span
                      onClick={() => {setPractice(prev=>{ return {...prev,mode:"kanji"}})}}
                      className="relative select-none z-10 flex justify-center items-center py-2 w-1/2 px-5 lg:px-10"
                    >
                      Kanji
                    </span>
                  </div>
          </span>
          <span className="w-full flex justify-between px-4 lg:px-12 items-center">
            <span className="text-3xl">Rounds</span>
            <motion.span
              layout
              className="min-w-1/2 lg:min-w-[36%] max-h-fit overflow-clip max-w-fit relative border-2 flex justify-center items-center text-4xl rounded-full py-4"
            >
              <motion.button
                key={"-rounds"}
                onClick={() =>
                  setPractice((prev) => {
                    return {
                      ...prev,rounds:Math.max(1,prev.rounds-1)
                    };
                  })
                }
                whileTap={{ scale: 1.1 }}
                initial={{ opacity: 0.95 }}
                whileHover={{ opacity: 1 }}
                className="absolute  cursor-pointer text-[#fffbe6] text-6xl left-0 flex items-center justify-center bg-[#1a1a2e] w-16 h-full rounded-full border"
              >
                -
              </motion.button>
              <input
                className="w-[20%] self-center flex justify-center text-center border-2 rounded-2xl"
                type="number"
                onChange={(e) => {
                  setPractice((prev) => {
                    return { ...prev, rounds: Number(e.target.value) };
                  });
                }}
                value={practice.rounds}
              />
              <motion.button
                key={"+rounds"}
                onClick={() =>
                  setPractice((prev) => {
                    return {
                      ...prev,
                     rounds:Math.min(50,prev.rounds+1)
                    };
                  })
                }
                whileTap={{ scale: 1.1 }}
                initial={{ opacity: 0.95 }}
                whileHover={{ opacity: 1 }}
                className="absolute text-[#fffbe6]  cursor-pointer text-6xl right-0 flex items-center justify-center bg-[#1a1a2e] w-16 h-full rounded-full border"
              >
                +
              </motion.button>
            </motion.span>
          </span>
          <span className="flex justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.25 }}
              onClick={async () => {
                if(practice.rounds>50) return toast.error("Rounds should be between 1 and 50")
                nav(
                  `/battle/practice?jlpt=${practice.jlptLevel}${practice.vocab ? `&vocab=${practice.vocab}` : ""}${practice.kanji ? `&kanji=${practice.kanji}` : ""}`,
                );
              }}
              className="flex text-2xl border-4 p-2 py-4 cursor-pointer rounded-full w-1/3 bg-[#3dce3d] justify-center gap-6 items-center"
            >
              Start Practice
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
            <span className="w-[90%] md:w-[70%] gap-4 flex justify-between">
              <motion.button
                onClick={() => {
                  setPracticeShown(true);
                }}
                whileTap={{ scale: 1.2 }}
                whileHover={{ scale: 1.15 }}
                key={"startPractice"}
                className="text-4xl p-8 cursor-pointer rounded-full border-3 bg-[#3dce3d]"
              >
                Practice
              </motion.button>
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
            </span>
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

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { MdMeetingRoom } from "react-icons/md";
import { FaArrowCircleRight } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const Battle = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const idRef = useRef<HTMLInputElement>(null);
  const [idInput, setIdInput] = useState("");
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
      <div className="w-full select-none h-full text-[#1a1a2e] bg-[#fffbe6] font-extrabold flex justify-center items-center">
        {!id && (
          <>
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
          </>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Battle;

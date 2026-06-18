import { LuPickaxe, LuSwords } from "react-icons/lu";
import {
  MdLocalFireDepartment,
  MdOutlineLocalFireDepartment,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "motion/react";
import { getStreak } from "../api/getStreak";
import { useEffect, useState } from "react";
const Nav = ({
  shown = true,
  showImmerse = true,
  showBattle = true,
}: {
  shown?: boolean;
  showImmerse?: boolean;
  showBattle?: boolean;
}) => {
  const [streak, setStreak] = useState<number | "">("");
  const nav = useNavigate();
  useEffect(() => {
    const fetchStreak = async () => {
      await getStreak().then(setStreak);
    };
    fetchStreak();
  });
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key={shown ? "Nav" : "HiddenNav"}
          exit={{ y: -40, opacity: 0 }}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "linear" }}
          className={`nav h-[6%]  items-center font-bold justify-around bg-[#ff6b6b] mt-2 mx-2 w-[94%] rounded-3xl absolute p-2 text-3xl top-0 flex ${shown ? "" : "hidden"}`}
        >
          <motion.span
            key={"streak"}
            initial={{ color: "#1a1a2e" }}
            whileHover={{ color: "#fffbe6", opacity: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {streak && streak > 0 ? (
              <MdLocalFireDepartment className="inline mb-1 mx-1" />
            ) : (
              <MdOutlineLocalFireDepartment className="inline mb-1 mx-1" />
            )}
            {streak}
          </motion.span>
          <motion.span
            key={"title"}
            initial={{ color: "#1a1a2e" }}
            whileHover={{ color: "#fffbe6", opacity: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute cursor-pointer left-1/2 -translate-x-1/2"
            onClick={() => {
              nav("/");
            }}
          >
            改善 • Kaizen
          </motion.span>
          <span className="flex-1 flex items-center gap-4 mr-2 justify-end">
            {showImmerse && (
              <motion.span
                initial={{ color: "#1a1a2e" }}
                whileHover={{ color: "#fffbe6", opacity: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="cursor-pointer"
                onClick={() => {
                  nav("/immerse");
                }}
              >
                <LuPickaxe className="inline bottom-1 relative" /> Immerse
              </motion.span>
            )}
            {showImmerse && showBattle && (
              <span className="border h-10 mx-2 w-0.75 rounded-4xl bg-[#1a1a2e]"></span>
            )}
            {showBattle && (
              <motion.span
                initial={{ color: "#1a1a2e" }}
                whileHover={{ color: "#fffbe6", opacity: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="cursor-pointer"
                onClick={() => {
                  nav("/battle");
                }}
              >
                <LuSwords className="inline relative bottom-1" /> Battle
              </motion.span>
            )}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Nav;

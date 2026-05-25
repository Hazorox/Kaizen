import { LuPickaxe, LuSwords } from "react-icons/lu";
import {
  MdLocalFireDepartment,
  MdOutlineLocalFireDepartment,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { motion } from "motion/react";
const Nav = () => {
  const streak = 3;
  const nav = useNavigate();

  return (
    <motion.div
      initial={{ y: -40, opacity: 0.1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "linear" }}
      className="nav h-16  items-center justify-around bg-[#ff6b6b] mt-2 mx-2 w-[94%] rounded-3xl absolute p-2 text-3xl top-0 flex"
    >
      <motion.span
        initial={{ color: "#1a1a2e" }}
        whileHover={{ color: "#fffbe6", opacity: 0.9 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {streak > 0 ? (
          <MdLocalFireDepartment className="inline mb-1 mx-1" />
        ) : (
          <MdOutlineLocalFireDepartment className="inline mb-1 mx-1" />
        )}
        {streak}
      </motion.span>
      <motion.span
        initial={{ color: "#1a1a2e" }}
        whileHover={{ color: "#fffbe6", opacity: 0.9 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute cursor-pointer left-1/2 -translate-x-1/2"
        onClick={()=>{nav("/")}}
      >
        改善 • Kaizen
      </motion.span>
      <span className="flex-1 flex items-center mr-2 justify-end">
        <motion.span
          initial={{ color: "#1a1a2e" }}
          whileHover={{ color: "#fffbe6", opacity: 0.9 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cursor-pointer"
          onClick={() => {
            nav("/immerse");
          }}
        >
          <LuPickaxe className="inline bottom-1 relative" /> Immerse
        </motion.span>
        <span className="border h-10 mx-2 w-0.75 rounded-4xl bg-[#1a1a2e]"></span>
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
      </span>
    </motion.div>
  );
};

export default Nav;

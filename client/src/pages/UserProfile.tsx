import { AnimatePresence, motion } from "motion/react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { FaEdit } from "react-icons/fa";
import { colors } from "../constants";
import { LuPickaxe, LuSwords } from "react-icons/lu";

const UserProfile = () => {
  const { id } = useParams();
  console.log(id);
  const userPic = "/hazoro.png";
  const username = "Hazoro";
  const ankiConnected = false;
  const ankiClickable = ankiConnected ? "" : "cursor-pointer ";
  return (
    <AnimatePresence>
      <div className="w-full select-none h-full relative bg-[#fffbe6] justify-center items-center flex">
        <Nav />
        <motion.div
          layout
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="main h-[80%] px-4 font-bold flex flex-col border-2  p-4 justify-around items-center rounded-md w-[70%] bg-[#4ecdc4]"
        >
          <span className="flex flex-col gap-8 font-extrabold text-4xl justify-center items-center">
            <div className="relative">
              <img src={userPic} className="h-48 w-48 rounded-full" />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="cursor-pointer absolute top-0 flex justify-center items-center z-100 rounded-full bg-gray-400 opacity-80 h-48 w-48"
              >
                <FaEdit size={64} className="relative left-1" />
              </motion.div>
            </div>
            <span>{username}</span>
          </span>
          <span className="flex w-full justify-center">
            <span className="flex w-fit flex-wrap items-center justify-center gap-6">
              <motion.span
                className={
                  ankiClickable +
                  colors.anki +
                  " flex justify-center w-fit relative flex-col items-center rounded-full h-24 border-4 pl-20 pr-4 py-4"
                }
              >
                <img
                  src="/anki.svg"
                  className="absolute left-1 mr-2 h-16 w-16"
                />
                <span className="text-3xl">Anki</span>
                <span>{ankiConnected ? "Connected" : "Not Connected"}</span>
              </motion.span>

              <motion.span
                className={
                  colors.matches +
                  " border-4 w-fit px-4 py-4 rounded-full flex flex-col gap-4 text-2xl"
                }
              >
                <span className="flex justify-center gap-2 items-center">
                  <LuSwords size={24} className="inline" />
                  1029 Matches Played
                </span>
                <span className="flex gap-3 items-center justify-around">
                  <span className="text-green-700">4</span>
                  <div className="w-1 rounded-full h-8 bg-[#1a1a2e]" />
                  <span className="text-gray-500">2</span>
                  <div className="w-1 rounded-full h-8 bg-[#1a1a2e]" />
                  <span className="text-red-500">3</span>
                </span>
              </motion.span>

              <motion.span
                className={
                  colors.immersion +
                  " w-fit flex justify-center items-center p-4 gap-4 text-2xl border-4 rounded-full"
                }
              >
                <LuPickaxe className="inline" size={24} />
                102099 Words Mined
              </motion.span>
            </span>
          </span>
          <span className="flex gap-8 justify-center items-center">
            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.25 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-64 bg-[#fffbe6] cursor-pointer text-3xl rounded-full border-2 h-16"
            >
              Logout
            </motion.button>
            <motion.button
              initial={{ scale: 1 }}
              whileTap={{ scale: 1.25 }}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-64 cursor-pointer text-2xl bg-[#ff6b6b] rounded-full border-2 h-16"
            >
              Delete Account
            </motion.button>
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserProfile;

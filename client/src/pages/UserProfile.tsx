import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { FaEdit } from "react-icons/fa";
import { colors } from "../constants";
import { LuPickaxe, LuSwords } from "react-icons/lu";
import Guide from "../components/Guide";
import { delAcc } from "../api/auth";
import { getPFP, updatePFP } from "../api/pfp";
import { useEffect, useRef, useState } from "react";
import { getUsername } from "../utils/getUsername";
import { ankiConnect } from "../api/anki";
import { IoRefresh } from "react-icons/io5";
import { getStatsTotal } from "../api/getStats";
import { Tooltip } from "react-tooltip";

const UserProfile = () => {
  const pfpRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const [stats, setStats] = useState({
    mining: 0,
    matches: { total: 0, won: 0, tie: 0, lost: 0 },
  });
  const { id } = useParams();
  let username;
  if (!id) {
    username = getUsername();
  } else {
    username = id;
  }
  const [userPic, setUserPic] = useState<string | null>("/idk.jpg");
  useEffect(() => {
    const fetchStuff = async () => {
      await getPFP(username).then((data) => {
        if (data) setUserPic(data);
      });
      await getStatsTotal().then(setStats);
    };
    fetchStuff();
  }, [username]);
  const [ankiDeck, setAnkiDeck] = useState(
    localStorage.getItem("deckName") ?? "",
  );
  return (
    <AnimatePresence>
      <div className="w-full select-none h-full relative bg-[#fffbe6] justify-center items-center flex">
        <Guide />

        <Nav />
        <input
          type="file"
          ref={pfpRef}
          key="pfp"
          id="pfp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            updatePFP(file);
          }}
        />
        <motion.div
          layout
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="main h-[80%] px-4 font-bold flex flex-col border-2  p-4 justify-around items-center rounded-md w-[70%] bg-[#4ecdc4]"
        >
          <span className="flex flex-col gap-8 font-extrabold text-4xl justify-center items-center">
            <div className="relative h-48 w-48">
              {userPic ? (
                <img
                  src={userPic}
                  referrerPolicy="no-referrer"
                  className="h-48 w-48 rounded-full"
                />
              ) : (
                <div className="h-48 w-48 rounded-full bg-[#1a1a2e]/20 animate-pulse" />
              )}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.2, ease: "linear" }}
                onClick={() => {
                  pfpRef.current?.click();
                }}
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
                  colors.anki +
                  " flex cursor-pointer justify-center w-fit relative flex-col items-center rounded-full h-24 border-4 pl-20 pr-16 py-4"
                }
              >
                <img
                  src="/anki.svg"
                  className="absolute left-1 mr-2 h-16 w-16"
                />
                <span className="text-3xl">Anki</span>
                <span>{ankiDeck ?? "Not Connected"}</span>
                <motion.span
                  onClick={async () => {
                    const res = await ankiConnect();
                    setAnkiDeck(res?.toString() ?? "");
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ rotate: 45 }}
                  transition={{ ease: "linear", duration: 0.1 }}
                  className="absolute right-1"
                >
                  <IoRefresh size={48} />
                </motion.span>
              </motion.span>

              <motion.span
                data-tooltip-id="matches"
                className={
                  colors.matches +
                  " border-4 w-fit px-4 py-4 rounded-full flex flex-col gap-4 text-2xl"
                }
              >
                <Tooltip
                  id="matches"
                  content={`${stats.matches.won} Wins | ${stats.matches.tie} Ties | ${stats.matches.lost} Losses`}
                  place="bottom"
                />
                <span className="flex justify-center gap-2 items-center">
                  <LuSwords size={24} className="inline" />
                  {stats.matches.total} Matches Played
                </span>
                <span className="flex gap-3 items-center justify-around">
                  <span className="text-green-700">{stats.matches.won}</span>
                  <div className="w-1 rounded-full h-8 bg-[#1a1a2e]" />
                  <span className="text-gray-500">{stats.matches.tie}</span>
                  <div className="w-1 rounded-full h-8 bg-[#1a1a2e]" />
                  <span className="text-red-500">{stats.matches.lost}</span>
                </span>
              </motion.span>

              <motion.span
                className={
                  colors.immersion +
                  " w-fit flex justify-center items-center p-4 gap-4 text-2xl border-4 rounded-full"
                }
              >
                <LuPickaxe className="inline" size={24} />
                {stats.mining ?? "0"} Words Mined
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
              onClick={() => {
                localStorage.removeItem("token");
                nav("/login");
              }}
            >
              Logout
            </motion.button>
            <motion.button
              onClick={() => {
                delAcc();
                localStorage.removeItem("deckName");
                nav("/login");
              }}
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

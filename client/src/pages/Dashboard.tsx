import Card from "../components/Card";
import { IoDiamondOutline } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";
import WordRow from "../components/WordRow";
import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import Guide from "../components/Guide";
import { useEffect, useState } from "react";
import { ankiGetDue } from "../api/anki";
import { getUsername } from "../utils/getUsername";
import { getStats } from "../api/getStats";
import { getRecentFive } from "../api/getRecents";

const Dashboard = () => {
  const nav = useNavigate();
  const time = new Date().getHours();
  const username = getUsername();
  const [recents, setRecents] = useState(null);
  const [ankiDue, setAnkiDue] = useState<number | null>(null);
  const [stats, setStats] = useState<{ mining: number; matches: number }>({
    mining: 0,
    matches: 0,
  });
  useEffect(() => {
    const fetchStuff = async () => {
      await getRecentFive().then((res)=>{
        if(window.innerWidth<1000){
          setRecents(res.slice(0,3))
        }else{setRecents(res)}
      });
      await ankiGetDue().then(setAnkiDue);
      await getStats().then(setStats);
    };
    fetchStuff();
  }, []);
  return (
    // Dashboard
    <AnimatePresence>
      <div className="w-full select-none h-full text-[#1a1a2e] bg-[#fffbe6] font-extrabold flex justify-center items-center">
        <Guide />
        {/* Navbar : Streak, Title, Immerse | Battle */}
        <Nav />
        {/* Main Content : User Welcome, Stats, And Recent Words */}
        <motion.div
          key={"dashboard"}
          layout
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="main h-[80%] flex flex-col border-2  p-4 justify-center items-center rounded-md w-[70%] bg-[#4ecdc4]"
        >
          <span
            className={`mt-4 justify-center text-center flex-wrap ${username.length > 14 ? "text-4xl lg:text-6xl" : "text-5xl lg:text-7xl"}`}
          >
            {time >= 5 && time < 12
              ? "おはよう"
              : 12 <= time && time < 18
                ? "こんにちは"
                : "こんばんは"}
            , {username} !
          </span>
          {/* Cards */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 place-content-center justify-items-center items-center h-full">
            <Card
              style={"bg-[#ff9a3c] !border-[#e06500]"}
              title={"Anki"}
              txt={
                !ankiDue
                  ? "Anki Not Connected"
                  : ankiDue == 1
                    ? "1 Card Due"
                    : `${ankiDue} Cards Due`
              }
              icon={"anki.svg"}
            />
            <Card
              style={"bg-[#c9b1ff] !border-[#7c3aed]"}
              title={"Immersion"}
              txt={stats.mining + " Words Mined Today"}
              icon={<IoDiamondOutline className="h-26 w-30" />}
            />

            <Card
              style={
                "bg-[#ffe066] col-span-2 flex justify-center !border-[#ffcb00]"
              }
              title={"Matches"}
              txt={stats.matches + " Matches Today"}
              icon={<RiSwordFill className="h-26 w-30" />}
            />
          </div>
          {/* Recent Words */}
          <div className="h-1/2 w-[60%] rounded-xl bg-[#fffbe6]">
            {/* Header */}
            <div className="bg-[#1a1a2e] rounded-t-xl text-[#fffbe6] py-1.5 px-6 flex justify-between">
              <span>Recent Words</span>
              <motion.span
                whileTap={{ x: 20 }}
                whileHover={{ opacity: "100%" }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                initial={{ x: 0, opacity: "60%" }}
                className="cursor-pointer"
                onClick={() => {
                  nav("/recents");
                }}
              >
                もっと最近の言葉 <FaArrowRight className="inline -mt-1" />{" "}
              </motion.span>
            </div>
            {/* Body */}
            <div className="select-text h-full">
              {recents?.length == 0 && (
                <div className="w-full h-full flex justify-center items-center text-2xl">
                  No Data Found, Start Mining
                </div>
              )}
              {recents?.length != 0 &&
                recents &&
                recents?.map(({ word, reading, meaning }) => (
                  <WordRow
                    content={word}
                    furigana={reading}
                    meaning={meaning}
                  />
                ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          key={"profileBtn"}
          onClick={() => {
            nav("/profile/");
          }}
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          whileHover={{ scale: 1.15, boxShadow: "0 0 0 2px rgba(0,0,0,0.9)" }}
          transition={{ duration: 0.2, ease: "linear" }}
          className="footer w-fit p-4 hover:cursor-pointer flex font-extrabold text-xl justify-center items-center fixed bottom-2 bg-[#032d66] text-[#eb6614] rounded-full"
        >
          Profile
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Dashboard;

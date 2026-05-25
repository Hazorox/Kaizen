
import Card from "../components/Card";
import { IoDiamondOutline } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";
import WordRow from "../components/WordRow";
import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav"
const Dashboard = () => {
  const time = new Date().getHours();
  const username = "Hazoro";
  const ankiCards = 1;
  return (
    // Dashboard
    <AnimatePresence>
      {/* Navbar : Streak, Title, Immerse | Battle */}
      <Nav />
      {/* Main Content : User Welcome, Stats, And Recent Words */}
      <motion.div
        layout
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="main h-[80%] flex flex-col border-2  p-4 justify-center items-center rounded-md w-[70%] bg-[#4ecdc4]"
      >
        <span className="text-8xl flex-1 mt-6 justify-center">
          {time >= 5 && time < 12
            ? "おはよう"
            : 12 <= time && time < 18
              ? "こんにちは"
              : "こんばんは"}
          , {username.length > 14 ? "" : username} !
        </span>
        {/* Cards */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 place-content-center justify-items-center items-center h-full">
          <Card
            style={"bg-[#ff9a3c] !border-[#e06500]"}
            title={"Anki"}
            txt={ankiCards == 1 ? "1 Card Due" : `${ankiCards} Cards Due`}
            icon={"anki.svg"}
          />
          <Card
            style={"bg-[#c9b1ff] !border-[#7c3aed]"}
            title={"Immersion"}
            txt={0 + " Words Mined Today"}
            icon={<IoDiamondOutline className="h-26 w-30" />}
          />
          <Card
            style={"bg-[#4fb3e8] !border-[#0099d4]"}
            title={"Kanji"}
            txt={0 + " Kanji Practised Today"}
            icon={"字"}
          />
          <Card
            style={"bg-[#ffe066] !border-[#ffcb00]"}
            title={"Matches"}
            txt={0 + " Wins Today"}
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
            >
              もっと最近の言葉 <FaArrowRight className="inline -mt-1" />{" "}
            </motion.span>
          </div>
          {/* Body */}
          <div className="select-text">
            <WordRow
              content="犬"
              furigana="いぬ"
              meaning="Dog"
              source="Anki"
              learntDate={1779291006000}
            />
            <WordRow
              content="本"
              furigana="ほん"
              meaning="Book"
              source="Immersion"
              learntDate={1779405341000}
            />
            <WordRow
              content="勉強する"
              furigana="べんきょうする"
              meaning="To Study"
              source="Kanji"
              learntDate={1770405311000}
            />
            <WordRow
              content="改善"
              furigana="かいぜん"
              meaning="Self Improvement"
              source="Matches"
              learntDate={1779391006000}
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        whileHover={{ scale: 1.15, boxShadow: "0 0 0 2px rgba(0,0,0,0.9)" }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="footer w-fit p-4 hover:cursor-pointer flex font-extrabold text-xl justify-center items-center fixed bottom-4 bg-[#032d66] text-[#eb6614] rounded-full"
      >
        Profile
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;

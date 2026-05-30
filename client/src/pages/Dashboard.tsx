import Card from "../components/Card";
import { IoDiamondOutline } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";
import WordRow from "../components/WordRow";
import { FaArrowRight, FaBook, FaDiscord, FaGithub, FaQuestion } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { FaX } from "react-icons/fa6";
import { colors } from "../constants";
import { PiBookOpenText } from "react-icons/pi";
const Dashboard = () => {
  const [guide, setGuide] = useState<string>("hidden ");
  const guideRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const time = new Date().getHours();
  const username = "Hazoro";
  const ankiCards = 99;
  return (
    // Dashboard
    <AnimatePresence>
      <motion.div
        onClick={() => {
          setGuide("hidden ");
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "linear" }}
        key={guide ? "guideOpen" : "guideClosed"}
        layout
        className={
          guide +
          "w-full h-full z-50 absolute bg-[#1a1a2e]/55 flex justify-center items-center"
        }
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.01, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "anticipate" }}
          exit={{ scale: 0.01, opacity: 0 }}
          layout
          className="bg-[#fffbe6] overflow-y-auto scrollable justify-between relative border-2 w-[50%] h-[70%] p-8 rounded-xl"
        >
          <FaX
            onClick={() => {
              setGuide("hidden ");
            }}
            className="inline absolute top-8 cursor-pointer right-8"
            size={36}
          />
          <span className="text-3xl w-full flex justify-center items-center">
            User Guide
          </span>
          <motion.ul
            id=""
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl gap-6 list-disc flex flex-col mt-12 ml-4 text-justify text-[#1a1a2e]"
          >
            <li>
              Make sure to have{" "}
              <motion.a
                whileHover={{ textShadow: "0 0 8px rgba(56, 189, 248, 0.5)" }}
                transition={{ duration: 0.2 }}
                href="https://ankiweb.net/shared/info/2055492159"
                className="underline underline-offset-2 decoration-sky-400"
                target="_blank"
              >
                Anki
              </motion.a>{" "}
              installed. It's a flashcards app.
            </li>
            <li>
              Install{" "}
              <motion.a
                whileHover={{ textShadow: "0 0 8px rgba(56, 189, 248, 0.5)" }}
                transition={{ duration: 0.2 }}
                href="https://ankiweb.net/shared/info/2055492159"
                className="underline underline-offset-2 decoration-sky-400"
                target="_blank"
              >
                AnkiConnect
              </motion.a>{" "}
              Addon. It creates a communication interface with the anki system.
            </li>
            <li>
              [OPTIONAL]{" "}
              <motion.a
                whileHover={{ textShadow: "0 0 8px rgba(56, 189, 248, 0.5)" }}
                transition={{ duration: 0.2 }}
                href="https://yomitan.wiki/"
                className="underline underline-offset-2 decoration-sky-400"
                target="_blank"
              >
                Yomitan
              </motion.a>{" "}
              is a popup dictionary that helps make the immersion process
              smoother.
            </li>
            <li>
              <span>For the </span>
              <span
                className={
                  colors.anki +
                  " border-2 rounded-full inline-flex gap-1 px-3 py-1 items-center"
                }
              >
                <img className="w-5 h-5" src="/anki.svg" /> Add To Anki
              </span>
              <span>
                {" "}
                function to work, Anki must be running in the background for the
                AnkiConnect service to function.
              </span>
            </li>
            <li>
              For productive immersion, You must firstly now the Japanese
              Language {"(日本語)"} basics.{" "}
              <motion.a
                whileHover={{ textShadow: "0 0 8px rgba(56, 189, 248, 0.5)" }}
                transition={{ duration: 0.2 }}
                href="https://www.tofugu.com/japanese/"
                className="underline underline-offset-2 decoration-sky-400"
                target="_blank"
              >
                Tofugu
              </motion.a>{" "}
              and{" "}
              <motion.a
                whileHover={{ textShadow: "0 0 8px rgba(56, 189, 248, 0.5)" }}
                transition={{ duration: 0.2 }}
                href="https://genki3.japantimes.co.jp/en/"
                className="underline underline-offset-2 decoration-sky-400"
                target="_blank"
              >
                Genki
              </motion.a>{" "}
              are highly recommended.
            </li>
          </motion.ul>
          <span
              className={
                colors.immersion +
                " w-1/3 flex-col absolute bottom-2 text-3xl left-1/2 -translate-x-1/2 justify-center items-center rounded-2xl border-2 p-4"
              }
            >
              <span className="flex gap-4 w-full justify-center items-center">
                <img
                  className="inline w-12 h-12 rounded-full"
                  src="https://avatars.githubusercontent.com/u/126866424?s=400&u=5c6f6adc1f1e116fe81b1a55d78ffd10f2d1b907&v=4"
                />{" "}
                Hazoro
              </span>
              <span className="w-full flex mt-4 gap-4 justify-center items-center">
                <FaGithub onClick={()=>{open("https://github.com/hazorox")}} className="cursor-pointer" size={36} />
              </span>
            </span>
        </motion.div>
      </motion.div>
      <motion.div
        key={"guideBtn"}
        initial={{ scale: 0.01, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        whileHover={{
          y: -10,
          x: -10,
          boxShadow: "0 0 0 2px rgba(0,0,0,0.3)",
          scale: 1.1,
        }}
        onClick={() => {
          setGuide("");
        }}
        className="bg-[#032d66] border-2 rounded-full w-16 h-16 absolute right-1 bottom-1 flex justify-center items-center cursor-pointer"
      >
        <FaQuestion size={40} className="text-[#eb6614]/90 inline" />
      </motion.div>
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
              onClick={() => {
                nav("/recents");
              }}
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
        key={"profileBtn"}
        onClick={() => {
          nav("/profile/");
        }}
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

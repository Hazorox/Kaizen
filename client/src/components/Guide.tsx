import {motion} from "motion/react"
import { FaGithub, FaQuestion } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { colors } from "../constants";
import {  useState } from "react";
const Guide = () => {
  const [guide, setGuide] = useState<string>("hidden ");
  return (
    <>
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
          "w-full font-bold h-full z-50 absolute bg-[#1a1a2e]/55 flex justify-center items-center"
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
                function to work, Anki must be running in background with "https://kaizen.appwrite.network" in the CORS config list in AnkiConnect.
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
      
    </>
  )
}

export default Guide
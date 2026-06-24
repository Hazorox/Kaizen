import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { Slab } from "react-loading-indicators";
import { getRecents } from "../api/getRecents";
import { LuPickaxe } from "react-icons/lu";
const Recents = () => {
  const nav = useNavigate();
  const open = useState(false);

  const [recents, setRecents] = useState<object | null>(null);
  const [recentsLoading, setRecentsLoading] = useState(true);
  useEffect(() => {
    const fetchRecents = async () => {
      if (!recentsLoading) return;
      await getRecents().then(setRecents);
      setRecentsLoading(false);
    };
    fetchRecents();
  });
  return (
    <AnimatePresence>
      {!recentsLoading && (
        <>
          {" "}
          <motion.div
            layout
            key={open ? "open" : "closed"}
            exit={{ opacity: 0, scale: 0.01 }}
            initial={{ opacity: 0, scale: 0.01 }}
            animate
          ></motion.div>
          <div className="w-full relative h-full bg-[#fffbe6] flex justify-center items-center">
            <Nav />
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.01 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-[70%] relative mt-12 flex flex-col gap-4 border-4 items-center h-[80%] p-12 bg-[#4ecdc4] rounded-xl"
            >
              <motion.div
                layout
                className="w-full h-[8%] items-center text-4xl flex justify-center"
              >
                <span>
                  最近の言葉 • <b className="select-none">Recent Words</b>
                </span>
              </motion.div>
              <motion.div
                layout
                className="bg-[#fffbe6] scrollable overflow-y-auto overflow-x-hidden rounded-xl border-8 w-full h-full"
              >
                {recents && (
                  <>
                    {Object.entries(recents).map(([key, wordRows]) => {
                      const dayName = new Date(key).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                        },
                      );
                      return (
                        <AnimatePresence>
                          <motion.div layout>
                            {/* Day */}
                            <motion.div
                              layout
                              className="sticky z-100 py-2 flex items-center text-[#fffbe6] px-8 h-fit top-0 bg-[#1a1a2e] w-full rounded-top-sm"
                            >
                              {key} • {dayName}
                            </motion.div>
                            {/* Contents */}
                            <motion.div layout className="flex flex-col gap-1">
                              {wordRows.map(
                                ({ word, meaning, reading, hour }) => {
                                  return (
                                    <motion.div
                                      onClick={() => {
                                        window.open(
                                          `https://jisho.org/search/${word}`,
                                          "_blank",
                                        );
                                      }}
                                      layout
                                      className="flex border-b-2 w-full py-3 justify-between px-8"
                                    >
                                      <span className="w-1/6 font-normal text-center text-2xl">
                                        {word}
                                      </span>


                                      <span
                                        className={`text-xl w-1/6 opacity-85 text-center`}
                                      >
                                        {reading}
                                      </span>
                                      
                                      
                                      <span className="font-bold text-center flex justify-center w-2/3">
                                        {meaning[0].toUpperCase() +
                                          meaning.slice(1)}
                                      </span>
                                      
                                      
                                      <span className="w-1/8 text-right">
                                        {hour}
                                      </span>
                                    </motion.div>
                                  );
                                },
                              )}
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      );
                    })}
                  </>
                )}
                {!recents && (
                  <div className="w-full h-full text-4xl flex justify-center items-center font-bold flex-col">
                    {" "}
                    No Immersion data found{" "}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 1.25 }}
                      className="flex justify-center items-center p-4 cursor-pointer gap-4 border-2 mt-12 rounded-full bg-[#c9b1ff]"
                      onClick={() => {
                        nav("/immerse");
                      }}
                    >
                      <LuPickaxe size={36} /> Start Mining !
                    </motion.button>
                  </div>
                )}
              </motion.div>
              {recents && (
                <motion.span layout className="absolute bottom-1">
                  Psst, click on a row to check definiton on{" "}
                  <a
                    className="underline text-blue-900"
                    href="https://jisho.org"
                    target="_blank"
                  >
                    Jisho
                  </a>
                </motion.span>
              )}
            </motion.div>
          </div>
        </>
      )}
      {recentsLoading && (
        <div className="w-full bg-[#fffbe6] text-[#1a1a2e] flex font-bold h-full justify-center items-center">
          <motion.div className="text-4xl flex flex-col gap-8">
            <Slab color={"#1a1a2e"} size="large" />
            Loading...
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Recents;

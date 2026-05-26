import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav";
import { useState } from "react";
import { PiFilePdfDuotone, PiFileVideoFill } from "react-icons/pi";
import { FaArrowCircleRight, FaYoutube } from "react-icons/fa";
import { MyPlayer } from "../components/player";

const Immerse = () => {
  const [preUpload, setPreUpload] = useState(true);
  const fileType: "pdf" | "video" = "video";
  const dimensions = preUpload
    ? "w-[50%] h-[60%]"
    : fileType == "video"
      ? "w-[90%] h-[90%] mt-16"
      : "w-[90%] h-[90%] mt-16";
  return (
    <AnimatePresence>
      <div className="w-full h-full bg-[#fffbe6] flex justify-center items-center">
        <Nav showImmerse={false} />
        <motion.div
          layout
          className={
            dimensions +
            " flex-col gap-16 rounded-3xl flex justify-around border-4 items-center bg-[#4ecdc4] overflow-hidden"
          }
        >
          {/* Upload */}
          {preUpload && (
            <>
              <motion.div className="w-full mt-4 select-none text-center font-bold text-4xl">
                Upload Contents
              </motion.div>
              <div className="flex select-none justify-center gap-16 w-full">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: "0 0 0 2px rgba(255,251,230,0.3)",
                  }}
                  onClick={()=>{setPreUpload(false)}}
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 1.25 }}
                  className="flex bg-[#fffbe6] px-2 py-4 border-4 cursor-pointer rounded-3xl w-[30%] flex-col gap-2 justify-around items-center"
                >
                  <PiFilePdfDuotone size={64} />
                  <span className="font-bold">Upload PDF</span>
                  <span className="opacity-90 text-center">
                    Upload a book, an article, or a scanned manga
                  </span>
                </motion.div>
                <motion.div
                  initial={{ scale: 1 }}
                  whileTap={{ scale: 1.25 }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: "0 0 0 2px rgba(255,251,230,0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex bg-[#fffbe6] px-2 py-4 border-4 cursor-pointer rounded-3xl w-[30%] flex-col gap-2 justify-around items-center"
                >
                  <PiFileVideoFill size={64} />
                  <span className="font-bold">Upload Video + Subtitles</span>
                  <span className="opacity-90 text-center">
                    Upload a video with a supported subtitles file
                  </span>
                </motion.div>
              </div>
              <motion.div className="flex select-none gap-4 flex-col justify-center items-center w-full">
                <span className="opacity-70 text-xl font-bold">
                  Or Upload YouTube Video Link
                </span>
                <span className="relative bg-[#1a1a2e]/80 h-16 w-[60%] flex items-center px-4 mb-4 rounded-full">
                  <motion.span
                    initial={{ x: 120 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-full w-16 h-16 bg-red-600 flex absolute left-0 items-center justify-center mr-3"
                  >
                    <FaYoutube size={36} />
                  </motion.span>
                  <motion.input
                    initial={{}}
                    type="url"
                    className="h-full flex-1 select-text bg-transparent text-[#fffbe6] rounded-full px-14 placeholder:text-[#fffbe6]/60 outline-none"
                    placeholder="YouTube Video Link"
                  />
                  <motion.span
                    whileTap={{ x: 10 }}
                    whileHover={{ opacity: "100%" }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    initial={{ x: 0, opacity: "60%" }}
                    className="rounded-full w-16 cursor-pointer h-16 bg-transparent flex absolute right-0 items-center justify-center"
                  >
                    <FaArrowCircleRight className="text-[#fffbe6]" size={36} />
                  </motion.span>
                </span>
              </motion.div>
            </>
          )}
          {/* Immerse */}
          {!preUpload && fileType == "video" ? (
            <motion.div className="w-full flex h-full overflow-hidden">
              <motion.div className="w-[70%]">
                <MyPlayer src="/video.mp4" />
              </motion.div>
              <motion.div className="w-[30%] border-l-4 flex flex-col bg-[#fffbe6]/50"></motion.div>
            </motion.div>
          ) : (
            <motion.div></motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Immerse;

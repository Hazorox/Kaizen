import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav";
import { useEffect, useRef, useState } from "react";
import { PiFilePdfDuotone, PiFileVideoFill } from "react-icons/pi";
import { FaArrowCircleRight, FaYoutube } from "react-icons/fa";
// import useParser, { type Cue } from "../hooks/useParser";
import { parse } from "@plussub/srt-vtt-parser";
const Immerse = () => {
  const [vidSrc, setVidSrc] = useState<string>("");
  const [vttSrc, setVttSrc] = useState<string>("");
  const [pdfSrc, setPdfSrc] = useState<string>("");

  const [vttContent, setVttContent] = useState<string>("");
  const data = parse(vttContent);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const vttInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState<number>(0);
  // Hard coded conditons
  const [preUpload, setPreUpload] = useState(true);
  const fileType: "pdf" | "video" = "video";
  // Dimensions for each condition
  const dimensions = preUpload
    ? "w-[50%] h-[60%]"
    : fileType == "video"
      ? "w-[90%] h-[90%] mt-16"
      : "w-[90%] h-[90%] mt-16";
  const subBarRef = useRef<HTMLDivElement>(null);
  const activeCueIDRef = useRef<string>("");
  useEffect(() => {
    const activeIndex = data.entries.findIndex(
      (cue) => time >= cue.from / 1000 && time <= cue.to / 1000,
    );

    if (activeIndex === -1 || activeIndex === Number(activeCueIDRef.current))
      return;

    activeCueIDRef.current = String(activeIndex);

    requestAnimationFrame(() => {
      subBarRef.current
        ?.querySelector(`[data-cue-id="${activeIndex}"]`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });
  }, [time, data.entries]);
  return (
    <AnimatePresence>
      <div className="w-full h-full bg-[#fffbe6] flex justify-center items-center">
        <input
          key="vid"
          ref={videoInputRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          id="vid"
          onChange={(e) => {
            const file = e.target.files?.[0];
            console.log("1. video file picked:", file?.name, file?.size);
            if (!file) return;
            const url = URL.createObjectURL(file);
            console.log("2. video url:", url);
            setVidSrc(url);
            setTimeout(() => {
              console.log("3. clicking vtt input");
              vttInputRef.current?.click();
            }, 400);
          }}
        />
        <input
          key="vtt"
          id="vtt"
          ref={vttInputRef}
          type="file"
          accept=".vtt,.srt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              const content = ev.target?.result as string;
              setVttContent(content);
              const url = URL.createObjectURL(file);
              setVttSrc(url);
              setPreUpload(false);
            };
            reader.readAsText(file);
          }}
        />
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
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 1.25 }}
                  className="flex bg-[#fffbe6] relative px-2 py-4 border-4 cursor-pointer rounded-3xl w-[30%] flex-col gap-2 justify-around items-center"
                >
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    className="opacity-0 z-100 cursor-pointer w-full h-full absolute left-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPdfSrc(URL.createObjectURL(file));
                    }}
                  />
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
                  onClick={() => {
                    videoInputRef.current?.click();
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex bg-[#fffbe6] px-2 relative py-4 border-4 cursor-pointer rounded-3xl w-[30%] flex-col gap-2 justify-around items-center"
                >
                  <PiFileVideoFill size={64} />
                  <span className="font-bold">Upload Video + Subtitles</span>
                  <span className="opacity-90 text-center">
                    Upload a video with a supported subtitles file<br/>{"(.vtt is recommended)"}
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
          {!preUpload && fileType == "video" && (
            <motion.div className="w-full flex h-full overflow-hidden">
              <motion.div className="w-[70%] h-full">
                <video
                  ref={vidRef}
                  src={vidSrc}
                  controls
                  className="w-full bg-black h-full"
                  onTimeUpdate={() => {
                    setTime(vidRef.current?.currentTime ?? 0);
                  }}
                >
                  <track
                    src={vttSrc}
                    kind="subtitles"
                    label="Japanese"
                    srcLang="ja"
                    default
                  />
                </video>
              </motion.div>
              <motion.div
                ref={subBarRef}
                className="w-[30%] border-l-4 overflow-y-scroll scrollable flex flex-col bg-[#fffbe6]/50"
              >
                {data.entries.map((cue, index) => {
                  const focused =
                    time < cue.to / 1000 && time > cue.from / 1000;
                  return (
                    <motion.span
                      key={index}
                      data-cue-id={index}
                      layout
                      className="w-full pt-4 relative block"
                    >
                      <motion.span
                        key={index + " text"}
                        animate={{
                          fontSize: focused ? "36px" : "30px",
                          opacity: focused ? 1 : 0.55,
                        }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 block"
                      >
                        {cue.text}
                      </motion.span>
                      <motion.div
                        key={index + " divider"}
                        className="h-1.5 mt-4 bg-black/70 w-full"
                      />
                    </motion.span>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Immerse;

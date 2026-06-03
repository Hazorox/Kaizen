import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav";
import { useEffect, useRef, useState } from "react";
import { PiFilePdfDuotone, PiFileVideoFill } from "react-icons/pi";
import {
  FaArrowCircleRight,
  FaExpandArrowsAlt,
  FaYoutube,
} from "react-icons/fa";
import YouTube from "react-youtube";
import { parse } from "@plussub/srt-vtt-parser";

import { getSub } from "../api/ytSub";
import { LuShrink } from "react-icons/lu";
import LookUp from "../components/lookUp";

const Immerse = () => {
  // STATES
  const [vidSrc, setVidSrc] = useState<string>("");
  const [navCollapsed, setNavCollapsed] = useState<boolean>(false);
  const [vttSrc, setVttSrc] = useState<string>("");
  const [vttContent, setVttContent] = useState<string>("");
  const [pdfURL, setPdfURL] = useState("");
  const [ytSub, setYtSub] = useState([]);
  const [time, setTime] = useState<number>(0);
  const [preUpload, setPreUpload] = useState(true);
  const [fileType, setFileType] = useState<"pdf" | "video" | "YT" | "">("");
  const [ytInput, setYtInput] = useState("");
  const [lookup, setLookup] = useState("");
  // REFS
  const ytPlayerRef = useRef<any>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const vttInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const subBarRef = useRef<HTMLDivElement>(null);
  const activeCueIDRef = useRef<string>("");

  // NORMAL
  const data = parse(vttContent);

  // Dimensions for each condition
  const dimensions = preUpload
    ? "w-[50%] h-[60%]"
    : `w-[90%] ${navCollapsed ? "w-[100%] !rounded-none h-[100%]" : "h-[90%] mt-16"}`;

  // UseEffects for the subs syncing
  useEffect(() => {
    if (fileType != "video" || preUpload) return;
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
  }, [time, data.entries, fileType, preUpload]);

  // Esc to revert fullscreen
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && navCollapsed) {
        setNavCollapsed(false);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [navCollapsed]);

  // Managin Full Screen Status
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setNavCollapsed(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Lookup
  useEffect(() => {
    if (preUpload || fileType == "pdf") return;
    const handleMouseUp = () => {
      const word = window.getSelection()?.toString().trim();
      if (!word) {
        setLookup("");
        return;
      }
      setLookup(word);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [preUpload, fileType, navCollapsed]);

  // YouTube
  useEffect(() => {
    if (fileType != "YT" || preUpload) return;
    const interval = setInterval(() => {
      if (typeof ytPlayerRef.current?.getCurrentTime === "function") {
        const t = ytPlayerRef.current.getCurrentTime();
        if (t !== undefined) setTime(t);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [fileType, preUpload]);

  // YouTube Synced Auto-Scroll
  // Uhhh just copied it from above, with some edits ;)
  useEffect(() => {
    if (fileType != "YT" || preUpload) return;

    const activeIndex = ytSub.findIndex(
      (cue: any) =>
        time >= cue.offset / 1000 &&
        time <= cue.duration / 1000 + cue.offset / 1000,
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
  }, [fileType, preUpload, time, ytSub]);
  // Page
  return (
    <AnimatePresence>
      <div
        className={`w-full h-full relative items-center overflow-hidden bg-[#fffbe6] flex justify-center`}
      >
        <motion.div
          layout
          onClick={async () => {
            setNavCollapsed((prev) => !prev);
            if (document.fullscreenElement) {
              await document.exitFullscreen();
            } else {
              await document.body.requestFullscreen();
            }
          }}
          className={`${preUpload ? "hidden " : ""}absolute right-1.5 bottom-1 z-100 bg-[#1a1a2e] p-2 cursor-pointer rounded-full${navCollapsed ? " right-4 bottom-3" : ""}`}
          whileHover={{ scale: 1.15, y: -20 }}
          whileTap={{ scale: 1.25 }}
        >
          {navCollapsed ? (
            <LuShrink size={36} className="text-[#fffbe6]" />
          ) : (
            <FaExpandArrowsAlt size={36} className="text-[#fffbe6]" />
          )}
        </motion.div>
        <input
          key="vid"
          ref={videoInputRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          id="vid"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setVidSrc(url);
            vttInputRef.current?.click();
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
              setFileType("video");
              setPreUpload(false);
            };
            reader.readAsText(file);
          }}
        />
        <input
          ref={pdfInputRef}
          id={"pdf"}
          type="file"
          key={"pdfUpload"}
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPdfURL(URL.createObjectURL(file));
            setFileType("pdf");
            setPreUpload(false);
          }}
        />
        <Nav shown={!navCollapsed} showImmerse={false} />
        <motion.div
          layout
          className={
            dimensions +
            ` flex-col gap-16 rounded-3xl flex justify-around border-4 items-center bg-[#4ecdc4] overflow-hidden`
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
                  onClick={() => {
                    pdfInputRef.current?.click();
                  }}
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: "0 0 0 2px rgba(255,251,230,0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 1.25 }}
                  className="flex bg-[#fffbe6] relative px-2 py-4 border-4 cursor-pointer rounded-3xl w-[30%] flex-col gap-2 justify-around items-center"
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
                  onClick={() => {
                    videoInputRef.current?.click();
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex bg-[#fffbe6] px-2 relative py-4 border-4 cursor-pointer rounded-3xl w-[30%] flex-col gap-2 justify-around items-center"
                >
                  <PiFileVideoFill size={64} />
                  <span className="font-bold">Upload Video + Subtitles</span>
                  <span className="opacity-90 text-center">
                    Upload a video with a supported subtitles file
                    <br />
                    {"(.vtt is recommended)"}
                  </span>
                </motion.div>
              </div>
              <motion.div className="flex select-none gap-4 flex-col justify-center items-center w-full">
                <span className="opacity-70 text-xl font-bold">
                  Or Upload YouTube Video ID
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
                    onChange={(e) => {
                      setYtInput(e.target.value);
                    }}
                    type="id"
                    className="h-full flex-1 select-text bg-transparent text-[#fffbe6] rounded-full px-14 placeholder:text-[#fffbe6]/60 outline-none"
                    placeholder="YouTube Video Link"
                  />
                  <motion.span
                    onClick={async () => {
                      try {
                        if (!ytInput) return;
                        setYtSub(
                          (await getSub(ytInput)).filter(
                            (cue: any) => cue.lang === "ja",
                          ),
                        );
                        setPreUpload(false);
                        setFileType("YT");
                      } catch (error) {
                        console.error(`An Error Occured\n${error}`);
                      }
                    }}
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
              <motion.div className="w-[65%] h-full">
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
              <motion.div className="w-[35%] flex-col h-full border-l-4  flex ">
                <motion.div
                  ref={subBarRef}
                  layout
                  className="h-[45%] overflow-y-scroll scrollable bg-[#fffbe6]/50"
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
                <LookUp text={lookup} />
              </motion.div>
            </motion.div>
          )}
          {!preUpload && fileType == "pdf" && (
            <motion.div className="w-full h-full flex scrollable">
              <motion.div className="w-full h-full flex">
                <object
                  data={pdfURL}
                  type="application/pdf"
                  className="w-[70%] h-full"
                />
                <motion.div className="w-[30%] h-full border-l-2 bg-[#fffbe6]/50 flex flex-col">
                  {/* definition panel */}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
          {!preUpload && fileType == "YT" && (
            <motion.div className="w-full h-full overflow-hidden flex">
              <motion.div className="w-[65%] h-full">
                <YouTube
                  onReady={(e) => {
                    ytPlayerRef.current = e.target;
                  }}
                  videoId={ytInput}
                  ref={ytPlayerRef}
                  className="w-full h-full"
                  opts={{ width: "100%", height: "100%" }}
                />
              </motion.div>
              <motion.div layout className="flex w-[35%] flex-col">
                <motion.div
                  ref={subBarRef}
                  className="w-full h-[45%] border-l-4 border-b-4 overflow-y-scroll overflow-x-hidden scrollable flex flex-col bg-[#fffbe6]/50"
                >
                  {ytSub.length == 0 &&
                    "No Japanese Subtitles Available for This Video"}
                  {ytSub.map((cue: any, index) => {
                    const start = cue.offset / 1000;
                    const end = start + cue.duration / 1000;
                    const focused = time < end && time > start;
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
                <LookUp text={lookup} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Immerse;

import { AnimatePresence, motion } from "motion/react";
import Nav from "../components/Nav";
import { useEffect, useRef, useState } from "react";
import {
  PiFilePdfDuotone,
  PiFileVideoFill,
  PiSubtitlesBold,
} from "react-icons/pi";
import {
  FaArrowCircleRight,
  FaExpandArrowsAlt,
  FaFileVideo,
  FaSearch,
  FaYoutube,
} from "react-icons/fa";
import YouTube from "react-youtube";
import { parse } from "@plussub/srt-vtt-parser";

import { getSub } from "../api/ytSub";
import { LuShrink } from "react-icons/lu";
import LookUp from "../components/lookUp";
import { RiMenuSearchLine } from "react-icons/ri";
import { FaX } from "react-icons/fa6";
import { IoCloudUpload, IoSend } from "react-icons/io5";
import { MdSubtitles } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { getYoutubeId } from "../utils/getYTId";
const Immerse = () => {
  // STATES
  const [vidSubShown, setVidSubShown] = useState(false);
  const [lookUpShown, setLookupShown] = useState(true);
  const [vidSrc, setVidSrc] = useState<string>("");
  const [navCollapsed, setNavCollapsed] = useState<boolean>(false);
  const [vttSrc, setVttSrc] = useState<string>("");
  const [vttContent, setVttContent] = useState<string>("");
  const [pdfURL, setPdfURL] = useState("");
  const [ytSub, setYtSub] = useState([]);
  const [time, setTime] = useState<number>(0);
  const [preUpload, setPreUpload] = useState(true);
  const [fileType, setFileType] = useState<
    "pdf" | "video" | "vidNoSub" | "YT" | ""
  >("");
  const [ytInput, setYtInput] = useState("");
  const [lookup, setLookup] = useState("");
  const [lookupInput, setLookupInput] = useState("");
  const [ytPlaceholder, setYtPlaceholder] = useState("YouTube Video URL");
  const [ytError, setYtError] = useState(false);
  // REFS
  const ytPlayerRef = useRef<any>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const vidNoSubRef = useRef<HTMLInputElement>(null);
  const vttInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const subBarRef = useRef<HTMLDivElement>(null);
  const activeCueIDRef = useRef<string>("");
  const lookupRef = useRef<HTMLInputElement>(null);
  const ytInputRef = useRef<HTMLInputElement>(null);

  // NORMAL
  const data = parse(vttContent);

  // Dimensions for each condition
  const dimensions = preUpload
    ? "w-[60%] h-[60%]"
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
      if (lookUpShown) {
        const word = window.getSelection()?.toString().trim();
        if (!word) {
          setLookup("");
          return;
        }
        setLookup(word);
      }
    };
    document
      .getElementById("subBar")
      ?.addEventListener("mouseup", handleMouseUp);
    return () =>
      document
        .getElementById("subBar")
        ?.removeEventListener("mouseup", handleMouseUp);
  }, [preUpload, fileType, navCollapsed, lookUpShown]);

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
  const submitYTID = async () => {
    try {
      if (!ytInput) return;
      toast.promise(
        async () => {
          await getSub(ytInput).then((res) => {
            if (!res || res === "invalid") {
              setYtPlaceholder("Unsupported URL");
              setYtError(true);
              setYtInput("");
              return;
            }
            setYtSub(res);
            setPreUpload(false);
            setFileType("YT");
          });
        },
        {
          loading: "Fetching Subtitles",
          error: "Unsupported URL",
          success: "Done!",
        },
      );
    } catch (error) {
      setYtPlaceholder("Unsupported URL");
      setYtError(true);
      setYtInput("");
    }
  };
  // Page
  return (
    <AnimatePresence>
      <div
        className={`w-full h-full relative items-center overflow-hidden bg-[#fffbe6] flex justify-center`}
      >
        {vidSubShown && (
          <motion.div
            onClick={() => {
              setVidSubShown(false);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "linear" }}
            key={vidSubShown ? "vidSubUpload" : "vidSubUploadClosed"}
            layout
            className="w-full h-full bg-[#1a1a2e]/50 absolute flex justify-center items-center z-100"
          >
            <Toaster position="bottom-center" />
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-[50%] border-4 rounded-3xl p-8 h-[50%] bg-[#4ecdc4] flex flex-col relative items-center text-3xl font-bold"
            >
              <FaX
                onClick={() => {
                  setVidSubShown(false);
                }}
                className="absolute cursor-pointer right-4 top-4"
                size={36}
              />
              Upload Contents
              <div className="flex w-full h-3/4 justify-center gap-20 items-center">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.25 }}
                  onClick={() => {
                    videoInputRef.current?.click();
                  }}
                  className="flex-col cursor-pointer h-1/2 border-4 rounded-4xl bg-[#fffbe6] flex justify-center items-center p-4"
                >
                  <FaFileVideo size={48} />
                  Upload Video
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.25 }}
                  onClick={() => {
                    vttInputRef.current?.click();
                  }}
                  className="flex-col text-2xl cursor-pointer h-1/2 border-4 rounded-4xl bg-[#fffbe6] flex justify-center items-center p-4"
                >
                  <MdSubtitles size={48} />
                  Upload Subtitles
                  <br /> {"(.vtt Recommended)"}
                </motion.button>
              </div>
              <motion.button
                onClick={() => {
                  if (!vidSrc || !vttSrc) {
                    return toast.error("Please Upload Both Files First");
                  }
                  setVidSubShown(false);
                  setFileType("video");
                  setPreUpload(false);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.25 }}
                className="bg-[#3dce3d] cursor-pointer p-4 rounded-full border-2 flex justify-center items-center gap-2"
              >
                Upload <IoCloudUpload className="mt-1" size={36} />{" "}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        <span
          key={"buttons"}
          className="absolute right-1 bottom-1 flex flex-col gap-8"
        >
          <motion.div
            key={"lookUpHider"}
            layout
            onClick={() => {
              setLookupShown((prev) => !prev);
            }}
            className={`${preUpload ? "hidden " : ""} z-100 bg-[#1a1a2e] p-2 cursor-pointer rounded-full${navCollapsed ? " right-4 bottom-3" : ""}`}
            whileHover={{ scale: 1.15, y: -12 }}
            whileTap={{ scale: 1.25 }}
          >
            <RiMenuSearchLine size={36} className="text-[#fffbe6]" />
          </motion.div>
          <motion.div
            key="navCollapser"
            layout
            onClick={async () => {
              setNavCollapsed((prev) => !prev);
              if (document.fullscreenElement) {
                await document.exitFullscreen();
              } else {
                await document.body.requestFullscreen();
              }
            }}
            className={`${preUpload ? "hidden " : ""} z-100 bg-[#1a1a2e] p-2 cursor-pointer rounded-full${navCollapsed ? " right-4 bottom-3" : ""}`}
            whileHover={{ scale: 1.15, y: -12 }}
            whileTap={{ scale: 1.25 }}
          >
            {navCollapsed ? (
              <LuShrink size={36} className="text-[#fffbe6]" />
            ) : (
              <FaExpandArrowsAlt size={36} className="text-[#fffbe6]" />
            )}
          </motion.div>
        </span>
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
          }}
        />
        <input
          key="vidNoSub"
          ref={vidNoSubRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          id="vid"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setVidSrc(url);
            setFileType("vidNoSub");
            setPreUpload(false);
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
            ` flex-col gap-16 rounded-3xl flex justify-evenly border-4 items-center bg-[#4ecdc4] overflow-hidden`
          }
        >
          {/* Upload */}
          {preUpload && (
            <>
              <motion.div className="w-full mt-4 select-none text-center font-bold text-4xl">
                Upload Contents
              </motion.div>
              <div className="flex select-none justify-around gap-6 w-full">
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
                  className="flex bg-[#fffbe6] relative px-2 py-4 border-4 cursor-pointer rounded-3xl w-[25%] flex-col gap-2 justify-around items-center"
                >
                  <PiFilePdfDuotone size={64} />
                  <span className="font-bold">Upload PDF</span>
                  <span className="opacity-90 text-center">
                    Upload a book, an article, or a scanned manga
                  </span>
                </motion.div>
                <motion.div
                  onClick={() => {
                    vidNoSubRef.current?.click();
                  }}
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: "0 0 0 2px rgba(255,251,230,0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 1.25 }}
                  className="flex bg-[#fffbe6] relative px-2 py-4 border-4 cursor-pointer rounded-3xl w-[25%] flex-col gap-2 justify-around items-center"
                >
                  <PiFileVideoFill size={64} />
                  <span className="font-bold">Upload Video</span>
                  <span className="opacity-90 text-center">
                    Upload a video and lookup the words yourself.
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
                    setVidSubShown(true);
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex bg-[#fffbe6] px-2 relative py-4 border-4 cursor-pointer rounded-3xl w-[25%] flex-col gap-2 justify-around items-center"
                >
                  <span className="flex text-4xl justify-center items-center gap-4">
                    <PiFileVideoFill size={64} /> +
                    <PiSubtitlesBold size={64} />
                  </span>
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
                  Or Upload YouTube Video URL
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
                    ref={ytInputRef}
                    value={ytInput}
                    onKeyPress={async (e) => {
                      if (e.key === "Enter") {
                        await submitYTID();
                      }
                    }}
                    onChange={(e) => {
                      setYtInput(e.target.value);
                      setYtError(false);
                      setYtPlaceholder("YouTube Video URL");
                    }}
                    placeholder={ytPlaceholder}
                    className={`h-full flex-1 select-text bg-transparent rounded-full px-14 outline-none ${ytError ? "placeholder:text-red-400" : "placeholder:text-[#fffbe6]/60"} text-[#fffbe6]`}
                  />
                  <motion.span
                    onClick={async () => {
                      await submitYTID();
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
                  id="subBar"
                  layout
                  className={`${lookUpShown ? "h-[45%]" : "h-full"} overflow-y-scroll scrollable bg-[#fffbe6]/50`}
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
                {lookUpShown && <LookUp text={lookup} />}
              </motion.div>
            </motion.div>
          )}
          {!preUpload && (fileType == "pdf" || fileType == "vidNoSub") && (
            <motion.div className="w-full h-full flex scrollable">
              <motion.div className="w-full h-full flex">
                {fileType == "pdf" && (
                  <motion.object
                    layout
                    data={pdfURL}
                    type="application/pdf"
                    className={`${lookUpShown ? "w-[65%]" : "w-full"} h-full`}
                  />
                )}
                {fileType === "vidNoSub" && (
                  <motion.video
                    layout
                    src={vidSrc}
                    controls
                    className={`${lookUpShown ? "w-[65%]" : "w-full"} h-full bg-black`}
                  ></motion.video>
                )}
                {lookUpShown && (
                  <>
                    <motion.div
                      className={`h-full border-l-2 bg-[#fffbe6]/50 flex flex-col w-[35%]`}
                    >
                      <motion.span className="flex items-center h-fit relative w-[85%] self-center my-2">
                        <motion.input
                          ref={lookupRef}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              setLookup(lookupInput);
                            }
                          }}
                          onChange={(e) => {
                            setLookupInput(e.target.value);
                          }}
                          className="w-full h-full  p-4 placeholder:text-[#fffbe6]/90 text-[#fffbe6]/90 text-lg pl-16 rounded-xl  bg-[#1a1a2e]/70"
                          placeholder="Text to Lookup"
                        />
                        <FaSearch
                          size={48}
                          className="inline absolute left-2"
                        />
                        <motion.span
                          initial={{ opacity: "85%" }}
                          transition={{ duration: 0.15 }}
                          whileTap={{ x: 10 }}
                          onClick={() => {
                            setLookup(lookupRef.current?.value ?? "");
                          }}
                          whileHover={{ opacity: "100%", scale: 1.1 }}
                          className="flex cursor-pointer text-[#fffbe6] absolute right-2 justify-center items-center w-fit h-fit"
                        >
                          <FaArrowCircleRight size={40} />
                        </motion.span>
                      </motion.span>
                      {lookUpShown && <LookUp text={lookup} sub={false} />}
                    </motion.div>
                  </>
                )}
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
                  videoId={getYoutubeId(ytInput)??""}
                  ref={ytPlayerRef}
                  className="w-full h-full"
                  opts={{ width: "100%", height: "100%" }}
                />
              </motion.div>
              <motion.div layout className="flex w-[35%] flex-col">
                <motion.div
                  ref={subBarRef}
                  layout
                  id="subBar"
                  // ${lookUpShown ? "h-[45%]" : "h-[full]"}
                  className={`w-full ${lookUpShown ? "h-[45%]" : "h-[full]"} border-l-4 border-b-4 overflow-y-scroll overflow-x-hidden scrollable flex flex-col bg-[#fffbe6]/50`}
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
                {lookUpShown && <LookUp text={lookup} shown={lookUpShown} />}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Immerse;

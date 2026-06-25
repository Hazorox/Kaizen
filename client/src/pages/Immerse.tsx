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
  FaYoutube,
} from "react-icons/fa";
import YouTube from "react-youtube";
import { parse } from "@plussub/srt-vtt-parser";
import Split from "split.js";
import { getSub } from "../api/ytSub";
import { LuShrink } from "react-icons/lu";
import LookUp from "../components/lookUp";
import {
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
} from "react-icons/ri";
import { FaX } from "react-icons/fa6";
import { IoCloudUpload } from "react-icons/io5";
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
  const [ytSub, setYtSub] = useState<any>([]);
  const [time, setTime] = useState<number>(0);
  const [preUpload, setPreUpload] = useState(true);
  const [fileType, setFileType] = useState<
    "pdf" | "video" | "vidNoSub" | "YT" | ""
  >("");
  const [ytInput, setYtInput] = useState("");
  const [ytPlaceholder, setYtPlaceholder] = useState("YT URL");
  const [ytError, setYtError] = useState(false);
  // REFS
  const ytPlayerRef = useRef<any>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const vttInputRef = useRef<HTMLInputElement>(null);
  const vidNoSubRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const ytInputRef = useRef<HTMLInputElement>(null);

  // NORMAL
  const data = parse(vttContent);

  // Dimensions for each condition
  const dimensions = preUpload
    ? "w-[60%] h-[60%]"
    : `w-[90%] ${navCollapsed ? "w-[100%] !rounded-none h-[100%]" : "h-[90%] mt-16"}`;

  // UseEffects for the subs syncing

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
            if(res.length===0){
              throw Error;
            }
          });
        },
        {
          loading: "Fetching Subtitles...",
          success: "Subtitles Fetched",
          error: "No Japanese Subtitles Found",
        },
      );
    } catch (error) {
      setYtPlaceholder("Unsupported URL");
      setYtError(true);
      setYtInput("");
    }
  };
  useEffect(() => {
    if (preUpload || !lookUpShown) return;

    let instance: ReturnType<typeof Split> | null = null;

    const timeout = setTimeout(() => {
      const main = document.getElementById("main");
      const side = document.getElementById("side");
      if (!main || !side) return;

      instance = Split(["#main", "#side"], {
        sizes: [65, 35],
        minSize: [200, 200],
        gutterSize: 8,
        cursor: "col-resize",
        direction: "horizontal",
      });
    }, 0);

    return () => {
      clearTimeout(timeout);
      instance?.destroy();
    };
  }, [fileType, preUpload, lookUpShown]);

  // Page
  return (
    <AnimatePresence>
      <Toaster toasterId="main" />
      <div
        className={`w-full h-full relative items-center overflow-hidden bg-[#fffbe6] flex justify-center`}
      >
        <Toaster position="bottom-center" />
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
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-fit border-4 rounded-3xl p-8 h-[60%] bg-[#4ecdc4] flex flex-col gap-8 relative items-center justify-around text-3xl font-bold"
            >
              <FaX
                onClick={() => {
                  setVidSubShown(false);
                }}
                className="absolute cursor-pointer right-4 top-4"
                size={36}
              />
              Upload Contents
              <div className="flex w-full h-1/3 justify-center gap-12 items-center">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.25 }}
                  onClick={() => {
                    videoInputRef.current?.click();
                  }}
                  className="flex-col cursor-pointer h-full border-4 rounded-4xl bg-[#fffbe6] flex justify-center items-center p-4"
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
                  className="flex-col text-2xl cursor-pointer h-full border-4 rounded-4xl bg-[#fffbe6] flex justify-center items-center p-4"
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
            {lookUpShown ? (
              <RiSidebarUnfoldLine size={36} className="text-[#fffbe6]" />
            ) : (
              <RiSidebarFoldLine size={36} className="text-[#fffbe6]" />
            )}
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
            ` flex-col gap-16 rounded-3xl flex justify-evenly border-4 items-center bg-[#4ecdc4] overflow-hidden ${preUpload && "px-4 h-fit md:w-fit md:mx-8 lg:w-[50%]"}`
          }
        >
          {/* Upload */}
          {preUpload && (
            <>
              <motion.div className="w-full mt-4 select-none text-center font-bold text-4xl">
                Upload Contents
              </motion.div>
              <div className="flex select-none justify-around gap-4 w-full">
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
                  className="flex bg-[#fffbe6] relative px-2 py-4 border-4 cursor-pointer rounded-3xl w-1/3 flex-col gap-2 justify-around items-center"
                >
                  <PiFilePdfDuotone size={64} />
                  <span className="font-bold text-center">Upload PDF</span>
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
                  className="flex bg-[#fffbe6] relative px-2 py-4 border-4 cursor-pointer rounded-3xl w-1/3 flex-col gap-2 justify-around items-center"
                >
                  <PiFileVideoFill size={64} />
                  <span className="font-bold text-center">Upload Video</span>
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
                  className="flex bg-[#fffbe6] px-2 relative py-4 border-4 cursor-pointer rounded-3xl w-1/3 flex-col gap-2 justify-around items-center"
                >
                  <span className="flex text-4xl justify-center items-center gap-4">
                    <PiSubtitlesBold size={64} />
                  </span>
                  <span className="font-bold text-center">Upload Video + Subtitles</span>
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
          {!preUpload && (
            <motion.div className="w-full flex h-full overflow-hidden">
              <motion.div
                layout
                id="main"
                className={`h-full ${!lookUpShown && "w-full!"} overflow-hidden`}
              >
                {fileType == "video" && (
                  <>
                    <motion.div className={`w-full h-full`}>
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
                  </>
                )}
                {["pdf", "vidNoSub"].includes(fileType) && (
                  <motion.div className="w-full h-full flex scrollable">
                    <motion.div className="w-full h-full flex">
                      {fileType == "pdf" && (
                        <motion.object
                          layout
                          data={pdfURL}
                          type="application/pdf"
                          className={`h-full w-full`}
                        />
                      )}
                      {fileType === "vidNoSub" && (
                        <motion.video
                          layout
                          src={vidSrc}
                          controls
                          className={`w-full h-full bg-black`}
                        ></motion.video>
                      )}
                    </motion.div>
                  </motion.div>
                )}
                {fileType == "YT" && (
                  <motion.div
                    layout
                    className="w-full h-full overflow-hidden flex"
                  >
                    <motion.div
                      layout
                      className={`h-full w-full overflow-hidden`}
                    >
                      <YouTube
                        onReady={(e) => {
                          ytPlayerRef.current = e.target;
                        }}
                        videoId={getYoutubeId(ytInput) ?? ""}
                        ref={ytPlayerRef}
                        className="w-full h-full"
                        opts={{ width: "100%", height: "100%" }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
              <LookUp
                shown={lookUpShown}
                sub={
                  fileType == "YT"
                    ? ytSub
                    : fileType == "video"
                      ? data.entries
                      : null
                }
                time={time}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Immerse;

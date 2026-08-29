import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { getUsername } from "../utils/getUsername";
import { useEffect, useRef, useState } from "react";
import { getMatchData } from "../api/match";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { FourSquare, Riple } from "react-loading-indicators";
import { Stage, Layer, Line, Rect } from "react-konva";
import { FaKey, FaLink } from "react-icons/fa";
import { IoExitOutline, IoFlagSharp } from "react-icons/io5";
import { LuCrown } from "react-icons/lu";
import { createPractce } from "../api/createPractice";
import { compare_kanji } from "../api/compare_kanji";
const Battle = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [invalid, setInvalid] = useState(false);
  const isDrawing = useRef(false);

  const { id } = useParams();
  const multi = id != "practice";
  const stageRef = useRef<any>(null);
  const [roomId, setRoomId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [ansSubmitted, setAnsSubmitted] = useState(false);
  const [practiceFinished, setPracticeFinished] = useState(false);
  const [practiceScore, setPracticeScore] = useState([]);
  const [roundNum, setRoundNum] = useState(0);
  const currentRound = questions[roundNum];
  const [waiting, setWaiting] = useState(true);
  const [mode, setMode] = useState("");
  const currentMode =
    mode == "both" ? (roundNum % 2 == 0 ? "vocab" : "kanji") : mode;
  const [results, setResults] = useState();
  const scores = results ? results.scores : null;
  const nav = useNavigate();
  const username = getUsername();
  const opponent = players.filter((player) => player != username)[0];
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!multi) return;
    else {
      socketRef.current = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:9898",
      );
      const socket = socketRef.current;
      socket.on("notFound", () => {
        nav("/battle");
        toast.error("Room Not Found");
      });
      socket.on("room_joined", () => {
        setRoomJoined(true);
      });
      socket.emit("join_match", { roomId: id, username });
      socket.on("match_started", (playerNames: string[]) => {
        setPlayers(playerNames);
        setWaiting(false);
      });
      socket.on("next_round", () => {
        setRoundNum((prev) => prev + 1);
        setLines([]);
        setAnsSubmitted(false);
      });
      socket.on("room_full", () => {
        nav("/battle");
        toast.error("Room Full");
      });
      socket.on("match_end", (stuff) => setResults(stuff));
      socket.on("opponent_left", () => {
        nav("/battle");
        toast.error("Opponent Left");
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [id, multi]);
  useEffect(() => {
    if (multi) return;
    const rounds = searchParams.get("rounds") || "2";
    if (roundNum == Number(rounds)) {
      setPracticeFinished(true);
    }
  }, [roundNum]);
  useEffect(() => {
    const fetchStuff = async () => {
      if (!multi) {
        const practiceMode = searchParams.get("mode");
        if (!practiceMode) return setInvalid(true);
        const level = searchParams.get("level") || "N5";
        const rounds = searchParams.get("rounds") || "2";
        const matchData = await createPractce({
          mode: practiceMode,
          rounds,
          level,
        });
        if (matchData == "invalid") {
          toast.error("Invalid practice Data");
          nav("/battle");
        }
        setMode(practiceMode);
        setRoomJoined(true);
        setQuestions(matchData);
        setRoundNum(0);
      } else {
        if (!roomJoined) return;
        const matchData = await getMatchData(id);
        if (!matchData) toast.error("An Error Occurred");
        if (matchData) {
          setMode(matchData.mode);
          setQuestions(matchData.rounds);
          setRoundNum(0);
          setRoomId(matchData.roomId);
        }
      }
    };
    fetchStuff();
  }, [roomJoined, id]);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;

    const pos = e.target.getStage().getPointerPosition();

    setLines([
      ...lines,
      {
        points: [pos.x, pos.y],
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    const lastLine = lines[lines.length - 1];

    lastLine.points = [...lastLine.points, point.x, point.y];

    lines.splice(lines.length - 1, 1, lastLine);

    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  return (
    <AnimatePresence key={"main"}>
      <Toaster position="bottom-center" />
      <div className="w-full select-none h-full flex flex-col justify-around items-center bg-[#fffbe6]">
        {((roomJoined && !waiting) || (roomJoined && !invalid && !multi)) && (
          <AnimatePresence key={"idkfr"} mode="wait">
            <div className="border-2 w-fit py-4 px-2 gap-2 rounded-3xl my-2 text-3xl font-bold flex flex-col justify-center items-center bg-[#ff6b6b]">
              {multi && (
                <span className="gap-4 flex justify-center items-center w-full">
                  <motion.span
                    className="flex justify-center text-center items-center w-1/2"
                    key={players[0]}
                    initial={{ x: -400, opacity: 0.2 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "linear", delay: 0.1 }}
                  >
                    {players[0]}
                  </motion.span>
                  <span className="text-center">VS.</span>
                  <motion.span
                    className="flex justify-center text-center items-center w-1/2"
                    key={players[1]}
                    initial={{ x: 400, opacity: 0.2 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "linear", delay: 0.1 }}
                  >
                    {players[1]}
                  </motion.span>
                </span>
              )}
              {!multi && (
                <span className="gap-4 flex justify-center px-4 items-center w-full">
                  Practice
                </span>
              )}
              {(multi && !results) ||
                (!multi && !practiceFinished && (
                  <motion.span className="flex">{`Round    ${roundNum + 1}`}</motion.span>
                ))}
              {results && multi && "Match Done"}
              {practiceFinished && !multi && "Finished"}
            </div>
            <motion.div
              key={"matchContent"}
              className="w-[70%] p-12 border-8 bg-[#4ecdc4] text-3xl font-bold items-center justify-between rounded-2xl flex flex-col h-[75%]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {((multi && !results) || (!multi && !practiceFinished)) && (
                  <>
                    {currentMode === "kanji" && (
                      <>
                        <div className="w-[60%] mt-4 flex text-4xl font-light justify-center items-center">
                          Draw The Kanji : {currentRound.Kanji}
                        </div>
                        {/* Got Some Help from Claude with dis one */}
                        <Stage
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onTouchStart={handleMouseDown}
                          onTouchMove={handleMouseMove}
                          onTouchEnd={handleMouseUp}
                          ref={stageRef}
                          width={400}
                          height={400}
                          className="mt-16"
                        >
                          <Layer key={"base"}>
                            {/* background */}
                            <Rect width={400} height={400} fill="#fffbe6" />
                            {/* vertical center line */}
                            <Line
                              key={"1"}
                              points={[400 / 2, 0, 400 / 2, 400]}
                              stroke="#1a1a2e"
                              strokeWidth={1}
                              opacity={0.2}
                              dash={[6, 4]}
                            />
                            <Line
                              key={"2"}
                              points={[0, 400 / 2, 400, 400 / 2]}
                              stroke="#1a1a2e"
                              strokeWidth={1}
                              opacity={0.2}
                              dash={[6, 4]}
                            />
                          </Layer>
                          <Layer key={"draw"}>
                            {lines.map((line, i) => (
                              <Line
                                key={i + " line"}
                                points={line.points}
                                stroke="#1a1a2e"
                                strokeWidth={8}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation="source-over"
                              />
                            ))}
                          </Layer>
                        </Stage>
                        <motion.button
                          key={"submit"}
                          onClick={async () => {
                            const dataURL = await stageRef.current?.toDataURL({
                              mimeType: "image/png",
                            });
                            if (multi) {
                              if (!ansSubmitted) {
                                socketRef.current?.emit("submit_answer", {
                                  roomId,
                                  username,
                                  ans: dataURL,
                                  type: "kanji",
                                });
                                setAnsSubmitted(true);
                              } else {
                                return toast.error("Already Submitted");
                              }
                            } else {
                              toast.promise(
                                async () => {
                                  const result = await compare_kanji(
                                    dataURL.split(",")[1],
                                    currentRound.Kanji,
                                  );
                                  practiceScore.push(result);
                                  setRoundNum((prev) => {
                                    if (questions.length - prev == 1) {
                                      setPracticeFinished(true);
                                      return 0;
                                    } else {
                                      setLines([]);
                                      return prev + 1;
                                    }
                                  });
                                },
                                {
                                  loading: "Submitting Answer",
                                  success: "Submitted!",
                                  error:
                                    "Error submitting answer, try refreshing",
                                },
                              );
                            }
                          }}
                          className={`${ansSubmitted ? "bg-[#c9b1ff] cursor-not-allowed" : "bg-[#3dce3d] cursor-pointer"} p-4 rounded-full border-2 flex justify-center items-center`}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 1.25 }}
                        >
                          {ansSubmitted ? "Waiting For Opponent..." : "Submit"}
                        </motion.button>
                      </>
                    )}
                    {currentMode === "vocab" && (
                      <>
                        <div className="w-[60%] mt-4 flex justify-center items-center">
                          {currentRound.correct.English}
                        </div>
                        <div className="flex text-4xl h-[65%] p-8 lg:p-12 w-full justify-around items-center gap-4 mb-4">
                          {[currentRound.correct, ...currentRound.distractors]
                            .sort(() => Math.random() - 0.5)
                            .map((entry, index) => (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.9 }}
                                whileHover={{ scale: 1.15, opacity: 1 }}
                                onClick={() => {
                                  if (ansSubmitted) {
                                    return toast.error("already Submitted");
                                  }
                                  if (
                                    entry.Original !=
                                    currentRound.correct.Original
                                  )
                                    toast.error("Wrong Answer >:(");
                                  else {
                                    toast.success("Correct !");
                                  }
                                  const ans = entry.Original;
                                  if (multi) {
                                    setAnsSubmitted(true);
                                    socketRef.current?.emit("submit_answer", {
                                      roomId,
                                      username,
                                      ans,
                                      type: "vocab",
                                    });
                                  } else {
                                    setPracticeScore((prev) => [
                                      ...prev,
                                      ans == currentRound.correct.Original,
                                    ]);
                                    setRoundNum((prev) => {
                                      if (questions.length - prev == 1) {
                                        setPracticeFinished(true);
                                        return 0;
                                      } else {
                                        setLines([]);
                                        return prev + 1;
                                      }
                                    });
                                  }
                                }}
                                whileTap={{ scale: 1.25 }}
                                className={`flex font-light flex-wrap ${ansSubmitted ? "cursor-not-allowed" : "cursor-pointer"} bg-[#ff6b6b] rounded-2xl h-full px-4 min-w-1/5 max-w-fit border-4 justify-center items-center ${ansSubmitted && entry.Original == currentRound.correct.Original && "bg-[#3dce3d]!"}`}
                                key={entry.Original}
                              >
                                <ruby key={index}>
                                  {entry.Original}
                                  <rt className="text-center text-xl opacity-90 ">
                                    {entry.Furigana}
                                  </rt>
                                </ruby>
                              </motion.div>
                            ))}
                        </div>
                        {ansSubmitted && <div> Waiting For Opponent...</div>}
                      </>
                    )}
                  </>
                )}
              {results && (
                <>
                  <motion.div className="flex w-full h-full justify-around items-center gap-4">
                    <motion.div className="w-[50%] min-h-fit max-h-[50%] justify-around items-center p-4 text-3xl h-[50%] bg-[#ff9a3c] border-2 rounded-3xl flex flex-col gap-8">
                      <span>{username} Score</span>
                      {["both", "vocab"].includes(mode) && (
                        <span>Vocab : {scores[username].vocab}</span>
                      )}
                      {["both", "kanji"].includes(mode) && (
                        <span>Kanji : {scores[username].kanji}</span>
                      )}
                      {mode === "both" && (
                        <span>Total : {scores[username].total}</span>
                      )}
                    </motion.div>
                    <motion.div className="w-[50%] bg-[#c9b1ff] border-2 rounded-3xl flex flex-col gap-8 min-h-fit max-h-[50%] p-4 justify-around items-center">
                      <span>{opponent} Score</span>
                      {["both", "vocab"].includes(mode) && (
                        <span>Vocab : {scores[opponent].vocab}</span>
                      )}
                      {["both", "kanji"].includes(mode) && (
                        <span>Kanji : {scores[opponent].kanji}</span>
                      )}
                      {mode === "both" && (
                        <span>Total : {scores[opponent].total}</span>
                      )}
                    </motion.div>
                  </motion.div>
                  <motion.div className="flex px-8 py-4 justify-center items-center">
                    <LuCrown size={48} className="inline mr-6" />
                    {results.winner}{" "}
                  </motion.div>
                </>
              )}
              {practiceFinished && (
                <motion.div className="flex w-full h-full justify-around items-center gap-4">
                  <motion.div className="w-[50%] min-h-fit max-h-[50%] justify-around items-center p-4 text-3xl h-[50%] bg-[#ff9a3c] border-2 rounded-3xl flex flex-col gap-8">
                    <span>{username} Score</span>

                    <span>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)} :{" "}
                      {practiceScore.filter((item) => item).length}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
            <motion.button
              onClick={() => {
                nav("/battle");
              }}
              key={"forfeit"}
              whileTap={{ scale: 1.2 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              className="flex mb-2 lg:mb-4 p-4 rounded-full font-bold border-2 border-[#cc0000]! cursor-pointer bg-[#ff6b6b] justify-center items-center text-2xl"
            >
              {multi ? (
                results ? (
                  <>
                    Leave <IoExitOutline size={36} />
                  </>
                ) : (
                  <>
                    Forfeit <IoFlagSharp />
                  </>
                )
              ) : (
                <>
                  Leave <IoExitOutline size={36} />
                </>
              )}
            </motion.button>
          </AnimatePresence>
        )}

        {!roomJoined && (
          <motion.div
            key={"joining"}
            className="flex font-bold justify-center items-center flex-col text-6xl gap-16"
          >
            <Riple color="#1a1a2e" size="large" text="" textColor="" />
            Loading...
          </motion.div>
        )}
        {waiting && roomJoined && multi && (
          <motion.div
            key={"waiting"}
            className="flex font-bold flex-col text-4xl justify-center items-center gap-12"
          >
            <FourSquare color={"#1a1a2e"} size="large" />
            Waiting For Opponent
            <motion.button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_FRONTEND_URL}/battle/${id}`,
                );
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.25 }}
              className="flex justify-between p-2 gap-4 items-center text-3xl bg-[#c9b1ff] border-[#7c3aed]! border-4 cursor-pointer rounded-full"
            >
              Copy Link <FaLink />
            </motion.button>
            <motion.button
              onClick={() => {
                if (id) navigator.clipboard.writeText(id);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.25 }}
              className="flex justify-between p-2 gap-4 items-center text-3xl bg-[#4fb3e8]/80 border-[#0099d4]! border-4 cursor-pointer rounded-full"
            >
              Copy Room ID <FaKey />
            </motion.button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Battle;

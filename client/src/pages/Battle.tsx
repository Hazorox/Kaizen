import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { getUsername } from "../utils/getUsername";
import { useEffect, useRef, useState } from "react";
import { getMatchData } from "../api/match";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { FourSquare, Riple } from "react-loading-indicators";
import { FaKey, FaLink } from "react-icons/fa";
import { IoFlagSharp } from "react-icons/io5";
const Battle = () => {
  const { id } = useParams();
  const socketRef = useRef<Socket | null>(null);
  const [questions, setQuestions] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [roundNum, setRoundNum] = useState(0);
  const currentRound = questions[roundNum];
  const [waiting, setWaiting] = useState(true);
  const currentType = !currentRound
    ? ""
    : Object.keys(currentRound).length === 2
      ? "both"
      : Object.keys(currentRound).includes("Kanji")
        ? "kanji"
        : "vocab";
  const [results, setResults] = useState({});
  const nav = useNavigate();
  const username = getUsername();

  useEffect(() => {
    socketRef.current = io("http://localhost:9898");
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
    });
    socket.on("room_full", () => {
      nav("/battle");
      toast.error("Room Full");
    });
    socket.on("opponent_left", () => {
      nav("/battle");
      toast.custom("Opponent Left");
    });
    return () => {
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    const fetchStuff = async () => {
      if (!roomJoined) return;
      const matchData = await getMatchData(id);
      console.log(matchData);
      if (!matchData) toast.error("An Error Occurred");
      if (matchData) {
        setQuestions(matchData.rounds);
        setRoundNum(0);
      }
    };
    fetchStuff();
  }, [roomJoined, id]);
  console.log(currentRound, currentType, roundNum);
  return (
    <AnimatePresence>
      <div className="w-full h-full flex flex-col justify-around items-center bg-[#fffbe6]">
        {roomJoined && !waiting && (
          <AnimatePresence mode="wait">
            <div className="min-w-[40%] max-w-fit py-4 px-2 gap-2 rounded-3xl mt-4 text-3xl font-bold flex flex-col justify-center items-center bg-[#ff6b6b]">
              <span className="gap-4 flex justify-center items-center w-full">
                <motion.span
                  className="flex justify-center items-center w-1/2"
                  key={players[0]}
                  initial={{ x: -240 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5, ease: "linear", delay: 0.1 }}
                >
                  {players[0]}
                </motion.span>
                <span className="text-center">VS.</span>
                <motion.span
                  className="flex justify-center items-center w-1/2"
                  key={players[1]}
                  initial={{ x: 240 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5, ease: "linear", delay: 0.1 }}
                >
                  {players[1]}
                </motion.span>
              </span>
              <motion.span className="flex">{`Round    ${roundNum + 1}`}</motion.span>
            </div>
            <motion.div
              key={"matchContent"}
              className="w-[70%] p-12 bg-[#4ecdc4] text-3xl font-bold items-center justify-between rounded-2xl flex flex-col h-[75%]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentType === "vocab" && (
                <>
                  <div className="w-[60%] mt-4 flex justify-center items-center">
                    {currentRound.correct.English}
                  </div>
                  <div className="flex justify-around items-center gap-4">
                    {[currentRound.correct, ...currentRound.distractors]
                      .sort(() => Math.random() - 0.5)
                      .map((entry, index) => (
                        <motion.div key={entry.Original}>
                          <ruby key={index} className="font-light opacity-90">
                            {entry.Original}
                            <rt className="text-[10px] text-center">
                              {entry.Furigana}
                            </rt>
                          </ruby>
                        </motion.div>
                      ))}
                  </div>
                </>
              )}
            </motion.div>
            <motion.button
              key={"forfeit"}
              whileTap={{ scale: 1.2 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              className="flex mb-4 p-2 rounded-full border-2 border-[#cc0000]! cursor-pointer bg-[#ff6b6b] justify-center items-center text-2xl"
            >
              Forfeit <IoFlagSharp />
            </motion.button>
          </AnimatePresence>
        )}

        {!roomJoined && (
          <motion.div className="flex font-bold justify-center items-center flex-col text-6xl gap-16">
            <Riple color="#1a1a2e" size="large" text="" textColor="" />
            Loading...
          </motion.div>
        )}
        {waiting && roomJoined && (
          <motion.div className="flex font-bold flex-col text-4xl justify-center items-center gap-12">
            <FourSquare color={"#1a1a2e"} size="large" />
            Waiting For Opponent
            <motion.button
              onClick={() => {
                //TODO: CHANGE THIS TO ONLINE URLZ
                navigator.clipboard.writeText(
                  `http://localhost:5173/battle/${id}`,
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

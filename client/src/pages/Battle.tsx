import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getUsername } from "../utils/getUsername";
import { useEffect } from "react";
const Battle = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const username = getUsername();
  useEffect(() => {
    const socket = io("http://localhost:9898");
    socket.emit("join_match", { roomId: id, username });

    socket.on("room_full", () => {
      nav("/battle");
    });
    socket.on("opponent_left",()=>{
      console.log("You Won !")
      nav("/battle")
    })
    return () => {
      socket.disconnect();
    };
  }, [id]);
  return <>{id && "hiiiiiii"}</>;
};

export default Battle;

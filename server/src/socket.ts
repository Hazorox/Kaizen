import { Server, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { Matches } from "./models/Match";
import { OpenRouter } from "@openrouter/sdk";
const client = new OpenRouter({
  apiKey: process.env.AI_KEY ?? "",
  serverURL: "https://ai.hackclub.com/proxy/v1",
});

type jlptLevels = "N5" | "N4" | "N3" | "N2" | "N1";
type modeTypes = "vocab" | "kanji" | "both";

export const makeSocket = (httpServer: httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" },
  });
  io.on("connection", (socket: Socket) => {
    socket.on("join_match", async ({ roomId, username }) => {
      console.log(username, roomId);
      const room = await Matches.findOne({ roomId });
      if (!room) return console.log("room not found 404");
      if (room.players.length == 2 || room.status == "active") {
        console.log("Room Full");
        socket.emit("room_full");
        return;
      }
      if (room.status == "finished") return console.log("Room Finished");
      room.players.push(username);
      if (room.players.length == 2) room.status = "active";
      await room.save();
      socket.join(roomId);
      socket.on("disconnect", async () => {
        const currentRoom = await Matches.findOne({ roomId });
        if (!currentRoom) {
          console.log("smth occured uh");
          return;
        }
        if (currentRoom.players.length == 1) {
          await Matches.deleteOne({ roomId });
          return;
        }
        if (!currentRoom.winner) {
          const opponent = currentRoom.players.filter(
            (player) => player !== username,
          )[0];
          currentRoom.winner = opponent;
          await currentRoom.save();
          socket.to(roomId).emit("opponent_left");
        }
      });
    });
  });
};

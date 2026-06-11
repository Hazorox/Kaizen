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
    // Joining matches
    socket.on("submit_answer", async ({roomId, username, ans}) => {
      const room = await Matches.findOne({ roomId });
      if (!room) return;
      room.currentSubmissions += 1;
      if (room.mode === "vocab") {
        if (room.rounds[room.currentRound].player1Ans) {
          console.log("player1Ans Occupied")
          room.rounds[room.currentRound].player2Ans = ans;
        } else {
          console.log("player1Ans Empty")
          room.rounds[room.currentRound].player1Ans = ans;
        }
      }

      if (room.currentSubmissions == 2) {
        room.currentRound += 1;
        room.currentSubmissions = 0;
        if (room.currentRound >= room.rounds.length) {
          room.status="finished"
          io.to(roomId).emit("match_end",{roomId});
        } else {
          io.to(roomId).emit("next_round");
        }
      }
      room.markModified('rounds')
      await room.save();
    });
    io.on("match_end",async({roomId})=>{
      
    })
    socket.on("join_match", async ({ roomId, username }) => {
      const room = await Matches.findOne({ roomId });
      if (!room) return socket.emit("notFound");
      if (room.players.length == 2 || room.status == "active") {
        console.log("Room Full");
        socket.emit("room_full");
        return;
      }
      if (room.status == "finished") return console.log("Room Finished");
      if (!room.players.includes(username)) room.players.push(username);
      socket.join(roomId);
      socket.emit("room_joined");
      if (room.players.length == 2) {
        room.status = "active";
        io.to(roomId).emit("match_started", room.players);
      }
      await room.save();

      // When Players Disconnect
      socket.on("disconnect", async () => {
        const currentRoom = await Matches.findOne({ roomId });
        if (!currentRoom) {
          console.log("smth occured uh");
          return;
        }
        if (currentRoom.players.length == 1) {
          //TODO: Uncomment this once doen with battle frontend
          // await Matches.deleteOne({ roomId });
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

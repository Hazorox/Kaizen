import { Server, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { Matches } from "./models/Match";
import { OpenRouter } from "@openrouter/sdk";
const client = new OpenRouter({
  apiKey: process.env.AI_KEY ?? "",
  serverURL: "https://ai.hackclub.com/proxy/v1",
});

export const makeSocket = (httpServer: httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" },
  });
  io.on("match_end", async ({ roomId }) => {});
  io.on("connection", (socket: Socket) => {
    // Joining matches
    socket.on("submit_answer", async ({ roomId, username, ans, type }) => {
      const room = await Matches.findOne({ roomId });
      if (!room) return;
      room.currentSubmissions += 1;
      if (type === "vocab") {
        if (room.rounds[room.currentRound].player1Ans.length == 0) {
          room.rounds[room.currentRound].player1Ans = [username, ans];
        } else {
          room.rounds[room.currentRound].player2Ans = [username, ans];
        }
      }
      if (type === "kanji") {
        const base64 = ans.split(",")[1];
        const response = await client.chat.send({
          chatRequest: {
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    imageUrl: {
                      url: `data:image/png;base64,${base64}`,
                    },
                  },
                  {
                    type: "text",
                    text: `On a scale of 0-100 based on Accuracy, how much does this image match the Japanese kanji ${room.rounds[room.currentRound].Kanji} Only respond with the accuracy number, NOTHING ELSE.`,
                  },
                ],
              },
            ],
          },
        });
        const acc = Number(response.choices[0].message.content);
        if (room.rounds[room.currentRound].player1Ans.length == 0) {
          room.rounds[room.currentRound].player1Ans = [username, acc ?? 0];
        } else {
          room.rounds[room.currentRound].player2Ans = [username, acc ?? 0];
        }
      }

      if (room.currentSubmissions == 2) {
        room.currentRound += 1;
        room.currentSubmissions = 0;
        if (room.currentRound >= room.rounds.length) {
          room.status = "finished";
          io.to(roomId).emit("match_end", { roomId });
        } else {
          io.to(roomId).emit("next_round");
        }
      }
      room.markModified("rounds");
      await room.save();
    });
    io.on("match_end", async ({ roomId }) => {});
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
        if (currentRoom.status == "finished") return;
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

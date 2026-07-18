import { Server, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { Matches } from "./models/Match";
import { createCanvas } from "canvas";
import sharp from "sharp";
function kanjiToBuffer(kanji: string) {
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = "black";
  ctx.font = "100px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(kanji, 64, 64);

  return canvas.toBuffer();
}

export const compareKanji = async (user:string, correct:string) => {
  const correctKanji = kanjiToBuffer(correct);
  const userAns = await sharp(Buffer.from(user, "base64"))
    .resize(128, 128)
    .grayscale()
    .threshold(128)
    .raw()
    .toBuffer();
  const correctAns = await sharp(correctKanji)
    .resize(128, 128)
    .grayscale()
    .threshold(128)
    .raw()
    .toBuffer();
  let diff = 0;

  for (let i = 0; i < userAns.length; i++) {
    diff += Math.abs(userAns[i] - correctAns[i]);
  }

  const maxDiff = 255 * userAns.length;

  const acc = Math.round((1 - diff / maxDiff) * 100);
  return acc;
};
export const makeSocket = async (httpServer: httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://kaizen.appwrite.network"],
    },
  });

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
        const acc = await compareKanji(
          base64,
          room.rounds[room.currentRound].Kanji,
        );
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
          const scores: Record<
            string,
            { vocab: number; kanji: number; total: number }
          > = {};
          room.players.forEach(
            (player) => (scores[player] = { vocab: 0, kanji: 0, total: 0 }),
          );
          room.rounds.forEach((round: any) => {
            if (round.correct) {
              const correctAns = round.correct.Original;
              const [player1, ans1] = round.player1Ans;
              const [player2, ans2] = round.player2Ans;
              if (ans1 === correctAns) {
                scores[player1].total++;
                scores[player1].vocab++;
              }
              if (ans2 === correctAns) {
                scores[player2].total++;
                scores[player2].vocab++;
              }
            } else if (round.Kanji) {
              const [player1, acc1] = round.player1Ans;
              const [player2, acc2] = round.player2Ans;
              if (acc1 >= 50) {
                scores[player1].total++;
                scores[player1].kanji++;
              }
              if (acc2 >= 50) {
                scores[player2].total++;
                scores[player2].kanji++;
              }
            }
          });
          const topScore = Object.entries(scores).sort(
            (a, b) => b[1].total - a[1].total,
          )[0][1].total;
          const topPlayers = Object.entries(scores)
            .filter(([_, s]) => s.total === topScore)
            .map(([p]) => p);
          const winner = topPlayers.length > 1 ? "both" : topPlayers[0];
          room.winner = winner;
          room.scores = scores;
          io.to(roomId).emit("match_end", { winner, scores });
        } else {
          io.to(roomId).emit("next_round");
        }
      }
      room.markModified("rounds");
      await room.save();
    });
    socket.on("join_match", async ({ roomId, username }) => {
      const room = await Matches.findOne({ roomId });
      if (!room) return socket.emit("notFound");
      if (room.players.length == 2 || room.status == "active") {
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

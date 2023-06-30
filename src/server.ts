import dotenv from "dotenv";
dotenv.config();
import { updateGameFromEvent } from "./services/game-service";
import errorHandler from "./util/error-handler";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
import sequelize from "./db";
import { GameModel, GameInviteAttributes } from "./models/game-model";

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const clientURL = process.env.AUTH0_SPA_URL!;

const io = new Server(server, {
  cors: {
    origin: clientURL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  interface GameStateServerCallback {
    updatedGame: GameModel | null;
    errorMsg: string;
  }

  socket.on(
    "gameStateServer",
    async (
      game: GameModel | GameInviteAttributes,
      callback: (data: GameStateServerCallback) => void
    ): Promise<void> => {
      try {
        const updatedGame = await updateGameFromEvent(game);
        socket.broadcast.emit("gameStateClient", updatedGame);
        callback({
          updatedGame,
          errorMsg: "",
        });
      } catch (error) {
        callback({
          updatedGame: null,
          errorMsg: errorHandler(error).message,
        });
      }
    }
  );
});

(async () => {
  await sequelize.sync();
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
})();

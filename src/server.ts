// import dotenv from "dotenv";
// dotenv.config();
import { updateGameFromEvent } from "./services/game-service";
import errorHandler from "./util/error-handler";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import sequelize from "./db";
import { GameModel, GameInviteAttributes } from "./models/game-model";

const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const clientURL = process.env.AUTH0_SPA_URL!;

const io = new Server(httpServer, {
  cors: {
    origin: clientURL,
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
  httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
})();

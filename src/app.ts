import express from "express";
import cors from "cors";
import auth0Routes from "./routes/auth0-route";
import gameRoutes from "./routes/game-route";
import emaileeRoutes from "./routes/emailee-route";
import HttpErrorHandler from "./middleware/error-middleware";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: process.env.AUTH0_SPA_URL,
};

app.use(cors(corsOptions));

app.use("/api/auth", auth0Routes);
app.use("/api/games", gameRoutes);
app.use("/api/emailees", emaileeRoutes);

app.get("/", (_, res) => {
  res.send("Welcome to Ghost-multiplayer-online.");
});

app.get(/.*/, (_, res) => {
  res.send("Invalid route");
});

app.use(HttpErrorHandler);

export default app;

import express from "express";
import checkJwt from "../middleware/auth0-middleware";
import getGames from "../controllers/game-controller";

const router = express.Router();

router.get("/:username", checkJwt, getGames);

export default router;

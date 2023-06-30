import { Request, Response, NextFunction } from "express";
import { getAllGames } from "../services/game-service";

const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const games = await getAllGames(username);
    res.json(games);
  } catch (err) {
    next(err);
  }
};

export default getGames;

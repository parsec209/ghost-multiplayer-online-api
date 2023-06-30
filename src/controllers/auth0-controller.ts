import { Request, Response, NextFunction } from "express";
import {
  getAuth0ManagementToken,
  getAllUsernames,
  checkForExistingUsername,
  updateOneUsername,
  deleteOneUser,
} from "../services/auth0-service";

const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { username }: { username: string } = req.body;
    const token = await getAuth0ManagementToken();
    await checkForExistingUsername(token, username);
    const response = await updateOneUsername(token, username, userId);
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const token = await getAuth0ManagementToken();
    await deleteOneUser(token, userId);
    res.end();
  } catch (err) {
    next(err);
  }
};

const getUsernames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = await getAuth0ManagementToken();
    const usernames = await getAllUsernames(token);
    res.json(usernames);
  } catch (err) {
    next(err);
  }
};

export { updateUsername, getUsernames, deleteUser };

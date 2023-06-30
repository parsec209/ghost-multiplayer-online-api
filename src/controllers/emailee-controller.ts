import { Request, Response, NextFunction } from "express";
import { EmaileeAttributes } from "../models/emailee-model";

import {
  getOneEmailee,
  postOneEmailee,
  deleteOneEmailee,
} from "../services/emailee-service";

const getEmailee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const emailee = await getOneEmailee(username);
    res.json(emailee);
  } catch (err) {
    next(err);
  }
};

const postEmailee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: EmaileeAttributes = req.body;
    const newEmailee = await postOneEmailee(data);
    res.json(newEmailee);
  } catch (err) {
    next(err);
  }
};

const deleteEmailee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const deletedCount = await deleteOneEmailee(username);
    res.json(deletedCount);
  } catch (err) {
    next(err);
  }
};

export { getEmailee, postEmailee, deleteEmailee };

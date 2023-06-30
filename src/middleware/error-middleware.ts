import { Request, Response } from "express";
import errorHandler from "../util/error-handler";

const HttpErrorHandler = (err: unknown, _: Request, res: Response) => {
  const { code, message } = errorHandler(err);

  res.status(code).send(message);
};

export default HttpErrorHandler;

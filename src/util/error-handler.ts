import axios from "axios";
import AppError from "./custom-error";

const errorHandler = (err: unknown): { code: number; message: string } => {
  console.log(err);

  let message: string = "";
  let code: number = 500;

  if (err instanceof AppError) {
    message = err.message;
    code = err.code;
  } else if (axios.isAxiosError(err)) {
    if (err.response) {
      message = err.response.data.message || err.response.data;
      code = err.response.status;
    } else if (err.request) {
      message = JSON.stringify(err.request);
    } else {
      message = err.message;
    }
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = "An unknown error has occurred";
  }

  return { code, message };
};

export default errorHandler;

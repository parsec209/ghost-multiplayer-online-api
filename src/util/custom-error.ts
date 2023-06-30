// class CustomError extends Error {
//   customName: string;
//   constructor(customName: string, ...params: any[]) {
//     super(...params);

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, CustomError);
//     }

//     this.customName = customName;
//   }
// }

import { CustomError } from "ts-custom-error";

class AppError extends CustomError {
  public constructor(public code: number, message?: string) {
    super(message);
  }
}

export default AppError;

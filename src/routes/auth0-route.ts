import express from "express";
import checkJwt from "../middleware/auth0-middleware";
import {
  updateUsername,
  getUsernames,
  deleteUser,
} from "../controllers/auth0-controller";

const router = express.Router();

router
  .route("/:userId")
  .post(checkJwt, updateUsername)
  .delete(checkJwt, deleteUser);

router.get("/", checkJwt, getUsernames);

export default router;

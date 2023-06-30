import express from "express";
import checkJwt from "../middleware/auth0-middleware";
import {
  getEmailee,
  postEmailee,
  deleteEmailee,
} from "../controllers/emailee-controller";

const router = express.Router();

router
  .route("/:username")
  .delete(checkJwt, deleteEmailee)
  .get(checkJwt, getEmailee);

router.post("/", checkJwt, postEmailee);

export default router;

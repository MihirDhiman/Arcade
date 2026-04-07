import express from "express";
import {
  saveScore,
  getLeaderboard,
  registerUser,
} from "../controllers/scoreController.js";

const router = express.Router();

router.post("/score", saveScore);
router.post("/users", registerUser);
router.get("/leaderboard/:game", getLeaderboard);

export default router;

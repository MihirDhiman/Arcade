import Score from "../models/Score.js";
import User from "../models/User.js";

// POST /api/score
export const saveScore = async (req, res) => {
  try {
    const { gameName, score, username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const normalized = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalized });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingScore = await Score.findOne({
      userId: user._id,
      gameName,
    });

    if (existingScore) {
      existingScore.score = score;
      await existingScore.save();
      return res.status(200).json(existingScore);
    }

    const newScore = await Score.create({
      userId: user._id,
      gameName,
      score,
    });

    res.status(201).json(newScore);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users
export const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const normalized = username.trim().toLowerCase();

    const existing = await User.findOne({ username: normalized });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const user = await User.create({ username: normalized });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leaderboard/:game
export const getLeaderboard = async (req, res) => {
  try {
    const { game } = req.params;

    const scores = await Score.find({ gameName: game })
      .populate("userId", "username")
      .sort({ score: -1 })
      .limit(10);

    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

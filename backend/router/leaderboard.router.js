import express from "express";
import { getCreatorLeaderboard, getRankerLeaderboard, getTribeLeaderboard } from "../controller/leaderboard.controller.js";

const leaderboardRouter = express.Router();

leaderboardRouter.route("/creators").get(getCreatorLeaderboard);
leaderboardRouter.route("/rankers").get(getRankerLeaderboard);
leaderboardRouter.route("/tribes").get(getTribeLeaderboard);

export default leaderboardRouter;

import express from "express";
import { getCreatorLeaderboard, getRankerLeaderboard, getTribeLeaderboard, getCurrentUserRank } from "../controller/leaderboard.controller.js";
import { verifyCookies } from "../middleware/verify.cookie.js";

const leaderboardRouter = express.Router();

leaderboardRouter.route("/me").get(verifyCookies, getCurrentUserRank);
leaderboardRouter.route("/creators").get(getCreatorLeaderboard);
leaderboardRouter.route("/rankers").get(getRankerLeaderboard);
leaderboardRouter.route("/tribes").get(getTribeLeaderboard);

export default leaderboardRouter;

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.connect.js";
import userRouter from "./router/user.router.js";
import profileRouter from "./router/profile.router.js";
import adminRouter from "./router/admin.router.js";
import leaderboardRouter from "./router/leaderboard.router.js";
import notificationRouter from "./router/notification.router.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectDb();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.get("/", (req, res) => {
    res.send("Server Working");
});


app.use("/api/v1/user", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/notification", notificationRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

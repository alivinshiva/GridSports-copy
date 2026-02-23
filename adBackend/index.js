import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.connect.js";
import weekendRouter from "./router/weekend.router.js";
import challengeRouter from "./router/challenge.router.js";
import submissionRouter from "./router/submission.router.js";
import heroRouter from "./router/hero.router.js";

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
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", (req, res) => {
    res.send("Admin Server Working");
});

app.use("/api/v1/weekend", weekendRouter);
app.use("/api/v1/challenge", challengeRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/hero", heroRouter);


app.listen(PORT, () => {
    console.log(`Admin Server running on port ${PORT}`);
});

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.connect.js";
import userRouter from "./router/user.router.js";
import profileRouter from "./router/profile.router.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 7000;

connectDb();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
    res.send("Server Working");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/profile", profileRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

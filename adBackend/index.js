import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDb } from "./config/db.connect.js";
import weekendRouter from "./router/weekend.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

connectDb();


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.get("/", (req, res) => {
    res.send("Admin Server Working");
});


app.use("/api/v1/weekend", weekendRouter);



app.listen(PORT, () => {
    console.log(`Admin Server running on port ${PORT}`);
});

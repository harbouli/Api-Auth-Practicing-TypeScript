import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Auth } from "./routers/index";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

// Routing

app.get("/", (req, res) => {
  res.send("Wellcom To Typescrip");
});

// Database Connection

import "./config/database";

// Routing
app.use("/api/v1", Auth);

// Server listen

const PORT = process.env.PORT || 5000; //Port 5000

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

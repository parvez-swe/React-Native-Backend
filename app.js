import express from "express";
import cookieParser from "cookie-parser";

import { config } from "dotenv";

config({
  path: "./data/config.env",
});

export const app = express();

// add middlewire for body parser
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.send("Its working");
});

//Import Router
import user from "./routes/user.js";
import ErrorHandler from "./utils/error.js";
import { errorMiddleware } from "./middlewares/error.js";

//Pre url
app.use("/api/v1/user", user);

//Error Middleware
app.use(errorMiddleware);

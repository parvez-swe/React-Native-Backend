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

import { errorMiddleware } from "./middlewares/error.js";

//Import Router
import user from "./routes/user.js";
import product from "./routes/product.js";

//Pre url
app.use("/api/v1/user", user);
app.use("/api/v1/product", product);

//Error Middleware
app.use(errorMiddleware);

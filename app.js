import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";

config({
  path: "./data/config.env",
});

export const app = express();

// add middlewire for body parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    methods: ["Get", "POST", "PUT", "DELETE"],
    origin: [process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2],
  })
);

app.get("/", (req, res, next) => {
  res.send("Its working");
});

import { errorMiddleware } from "./middlewares/error.js";

//Import Router
import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";

//Pre url
app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);

//Error Middleware
app.use(errorMiddleware);

import express from "express";
import { login, signUp } from "../controllers/user.js";

const router = express.Router();

// router.route("/login").post(login);
router.post("/login", login);

router.post("/new", signUp);

export default router;

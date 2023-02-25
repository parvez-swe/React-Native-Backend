import express from "express";
import { getProfile, login, signUp } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// router.route("/login").post(login);
router.post("/login", login);

router.post("/new", signUp);

router.get("/me", isAuthenticated, getProfile);

export default router;

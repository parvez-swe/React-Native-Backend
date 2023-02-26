import express from "express";
import {
  changePassword,
  getProfile,
  login,
  logOut,
  signUp,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// router.route("/login").post(login);
router.post("/login", login);

router.post("/new", signUp);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logOut);

//update route

router.put("/updateprofile", isAuthenticated, updateProfile);
router.put("/changepassword", isAuthenticated, changePassword);

export default router;

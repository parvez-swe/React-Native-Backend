import express from "express";
import {
  changePassword,
  forgetPassword,
  getProfile,
  login,
  logOut,
  resetPassword,
  signUp,
  updatePic,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// router.route("/login").post(login);
router.post("/login", login);

router.post("/new", singleUpload, signUp);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logOut);

//update route

router.put("/updateprofile", isAuthenticated, updateProfile);
router.put("/changepassword", isAuthenticated, changePassword);
router.put("/updatePic", isAuthenticated, singleUpload, updatePic);

//Forget Password

router.route("/forgetpassword").post(forgetPassword).put(resetPassword);

export default router;

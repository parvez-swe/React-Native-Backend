import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
} from "../controllers/product.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuthenticated, singleUpload, createProduct);
router.get("/all", getAllProducts);

router.route("/single/:id").get(getProductDetails);

export default router;

import express from "express";
import {
  addCategory,
  addProductImages,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAllCategory,
  getAllProducts,
  getProductDetails,
  updateProduct,
} from "../controllers/product.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuthenticated, singleUpload, createProduct);
router.get("/all", getAllProducts);

router
  .route("/single/:id")
  .get(getProductDetails)
  .put(isAuthenticated, updateProduct)
  .delete(isAuthenticated, deleteProduct);

router
  .route("/images/:id")
  .post(isAuthenticated, singleUpload, addProductImages)
  .delete(deleteProductImage);

router.post("/category", isAuthenticated, addCategory);

router.get("/categories", getAllCategory);

router.delete("/category/:id", isAuthenticated, deleteCategory);

export default router;

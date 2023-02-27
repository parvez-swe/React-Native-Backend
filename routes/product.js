import express from "express";
import { processPayment } from "../controllers/order.js";
import {
  addCategory,
  addProductImages,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getAllCategory,
  getAllProducts,
  getProductDetails,
  updateProduct,
} from "../controllers/product.js";

import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuthenticated, isAdmin, singleUpload, createProduct);
router.post("/payment", isAuthenticated, processPayment);

router.get("/all", getAllProducts);
router.get("/admin", isAuthenticated, isAdmin, getAdminProducts);

router
  .route("/single/:id")
  .get(getProductDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

router
  .route("/images/:id")
  .post(isAuthenticated, isAdmin, singleUpload, addProductImages)
  .delete(isAuthenticated, isAdmin, deleteProductImage);

router.post("/category", isAuthenticated, isAdmin, addCategory);

router.get("/categories", getAllCategory);

router.delete("/category/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;

import { asyncError } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import { Category } from "../models/category.js";

//Get All Prduct
export const getAllProducts = asyncError(async (req, res, next) => {
  const { keyword, category } = req.query;

  const products = await Product.find({
    name: {
      $regex: keyword ? keyword : "",
      $options: "i",
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Admin Product
export const getAdminProducts = asyncError(async (req, res, next) => {
  const products = await Product.find({}).populate("category");

  res.status(200).json({
    success: true,
    products,
  });
});

//get product details
export const getProductDetails = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

//Create Product
export const createProduct = asyncError(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;
  if (!req.file) return next(new ErrorHandler("Please add image", 400));
  const file = getDataUri(req.file);
  //Add cloudinary webkit-hyphenate-character:
  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await Product.create({
    name,
    description,
    category,
    price,
    stock,
    images: [image],
  });

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
  });
});

//Update Product
export const updateProduct = asyncError(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated Successfully",
  });
});

//Add Product Images
export const addProductImages = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (!req.file) return next(new ErrorHandler("Please add image", 400));

  const file = getDataUri(req.file);
  //Add cloudinary webkit-hyphenate-character:
  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  product.images.push(image);

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
  });
});

//Delete Product Image

export const deleteProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const image_id = req.query.id;
  if (!image_id) return next(new ErrorHandler("Image id not found", 404));

  let isExist = -1;

  product.images.forEach((item, index) => {
    if (item._id.toString() === image_id.toString()) isExist = index;
  });

  if (isExist < 0) return next(new ErrorHandler("Image does not exitst", 400));

  await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

  await product.splice(isExist, 1); //! (index no,from index how much element )

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

export const deleteProduct = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  for (let index = 0; index < product.images.length; index++) {
    await cloudinary.v2.uploader.destroy(product.images[index].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const addCategory = asyncError(async (req, res, next) => {
  const { category } = req.body;

  await Category.create({ category });

  res.status(201).json({
    success: true,
    message: "Category added Successfully",
  });
});

export const getAllCategory = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new ErrorHandler("Category not found", 404));

  const products = await Product.find({ category: category._id });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    product.category = undefined;

    await product.save();
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});

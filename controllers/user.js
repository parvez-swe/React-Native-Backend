import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password"); //! .select('+password') as select: false in models;

  if (!user) {
    return next(new ErrorHandler("Incorrect Email", 400));
  }

  // compare password now

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Password", 400));
  }
  res.status(200).json({
    message: true,
    message: `Welcome Back, ${user.name}`,
  });
});

export const signUp = asyncError(async (req, res, next) => {
  const { name, email, password, address, city, country, pinCode, role } =
    req.body;

  //Add cloudinary webkit-hyphenate-character:

  await User.create({
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
    role,
  });

  res.status(201).json({
    success: true,
    message: "Register successfully",
  });
});

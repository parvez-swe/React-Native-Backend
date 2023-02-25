import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { sendToken } from "../utils/features.js";

//Login

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password"); //! .select('+password') as select: false in models;

  if (!user) {
    return next(new ErrorHandler("Incorrect Email", 400));
  }

  // compare password now
  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect email or Password", 400));
  }

  sendToken(user, res, `Welcome Back, ${user.name}`, 200);
});

//Sign Up

export const signUp = asyncError(async (req, res, next) => {
  const { name, email, password, address, city, country, pinCode, role } =
    req.body;

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User Already Exist", 400));

  //Add cloudinary webkit-hyphenate-character:

  user = await User.create({
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
    role,
  });

  sendToken(user, res, `Registered Successfully`, 201);
});

export const logOut = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const getProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

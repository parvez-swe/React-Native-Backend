import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { cookieOptions, sendToken } from "../utils/features.js";

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
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "Log out Successfully",
    });
});

export const getProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { name, email, address, city, country, pinCode, role } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (city) user.city = city;
  if (country) user.country = country;
  if (pinCode) user.pinCode = pinCode;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated Successfully",
    user,
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password"); //! .select('+password') as select: false in models;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please Enter old password and new password"));

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) return next(new ErrorHandler("Incorrect Password"));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Change Successfully",
    user,
  });
});

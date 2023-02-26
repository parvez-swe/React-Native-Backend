import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { cookieOptions, getDataUri, sendToken } from "../utils/features.js";
import cloudinary from "cloudinary";

//Login
export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password"); //! .select('+password') as select: false in models;

  if (!user) {
    return next(new ErrorHandler("Incorrect Email", 400));
  }

  if (!password) return next(new ErrorHandler("Please Enter password", 400));

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

  let avatar = undefined;

  console.log(req.file);

  if (req.file) {
    //add req.filter:
    const file = getDataUri(req.file);
    //Add cloudinary webkit-hyphenate-character:
    const myCloud = await cloudinary.v2.uploader.upload(file.content);

    avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  user = await User.create({
    avatar,
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

//Log Out
export const logOut = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "Log out Successfully",
    });
});

//Get Profile
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
    return next(
      new ErrorHandler("Please Enter old password and new password", 400)
    );

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) return next(new ErrorHandler("Incorrect Password", 400));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Change Successfully",
    user,
  });
});

//Update Picture
export const updatePic = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  //Coudinary Operation
  const file = getDataUri(req.file);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Picture Change Successfully",
    user,
  });
});

export const forgetPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Incorrect Email", 404));

  //max,min 999999, 100000
  //math.random()*(max-min)+min;

  const randomNumber = Math.random() * (999999 - 100000) + 1000000;
  const otp = Math.floor(randomNumber);
  const otp_expire = 15 * 60 * 1000;

  user.otp = otp;
  user.opt_expire = new Date(Date.now() + otp_expire);
  await user.save();

  //send Email

  res.status(200).json({
    success: true,
    message: `email is sent to ${user.email}`,
  });
});

export const resetPassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

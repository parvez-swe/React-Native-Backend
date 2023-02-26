import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: { type: String, required: [true, "Please Enter name"] },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: [true, "Email Already Exist"],
    valiidate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [6, "Password must be 6 character long "],
    select: false,
    // ! when get user as it can give all data except password
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pinCode: { type: Number, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, //There will be tow optoion by default will be user
  avatar: {
    public_id: String,
    url: String,
  },
  otp: Number,
  otp_expire: Date,
});

//Hashing Password
// !note: arrow function does not work in the bcrypt.hash(here)

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

//  Comparing Hashed Password with login Password

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating token
schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export const User = mongoose.model("User", schema);

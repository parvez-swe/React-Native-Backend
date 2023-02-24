import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

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
    Select: false, // ! when get user as it can give all data except password
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pinCode: { type: Number, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, //There will be tow optoion by default will be user
  Avatar: {
    public_id: String,
    url: String,
  },
  otp: Number,
  opt_expire: Date,
});

//Hashing Password
// !note: arrow function does not work in the bcrypt.hash(here)

schema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

//  Comparing Hashed Password with login Password

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", schema);

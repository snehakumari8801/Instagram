const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,  
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic:{
    type: String,
    required: false,
  },
  otp: {
    type: String, // can also use Number, but String is safer to preserve leading zeros
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;


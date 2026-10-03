const { request } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
// const { hashPassword } = require("../utils/password");
const { generateRefreshToken, verifyRefreshToken, generateAccessToken } = require("../utils/jwt");


const register = async (firstName, lastName, email, password) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("email allready exists");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });
  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("invalid email or password");
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  const accessToken = generateAccessToken(user);

  return accessToken;
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};

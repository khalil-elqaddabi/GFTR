const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateRefreshToken, verifyRefreshToken, generateAccessToken } = require("../utils/jwt");



const register = async (firstName, lastName, email, password) => {
  if (!firstName || !lastName || !email || !password) {
    const error = new Error("First name, last name, email and password are required");
    error.statusCode = 400;
    throw error;
  }
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password: hashPassword,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};


const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    const error = new Error("Invalid email or password or inactive account");
    error.statusCode = 401;
    throw error;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
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
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    const authError = new Error("Invalid or expired refresh token");
    authError.statusCode = 401;
    throw authError;
  }

  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    const error = new Error("User account is inactive or no longer available");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);

  return accessToken;
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};

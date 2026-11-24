const User = require("../models/User");
const bcrypt = require("bcrypt");

const getChauffeursCount = async () => {
  return await User.countDocuments({ role: "CHAUFFEUR" });
};

const getAllUsers = async () => {
  return await User.find().select("firstName lastName email role isActive createdAt").sort({ createdAt: -1 });
};

const createChauffeur = async (data) => {
  const { firstName, lastName, email, password } = data;
  if (!firstName || !lastName || !email || !password) {
    const error = new Error("First name, last name, email and password are required");
    error.statusCode = 400;
    throw error;
  }
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: passwordHash, role: "CHAUFFEUR" });
  return user;
};

const updateChauffeurStatus = async (id, isActive) => {
  if (typeof isActive !== "boolean") {
    const error = new Error("isActive must be true or false");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findOneAndUpdate(
    { _id: id, role: "CHAUFFEUR" },
    { isActive },
    { new: true, runValidators: true }
  ).select("firstName lastName email role isActive createdAt");
  if (!user) {
    const error = new Error("Chauffeur not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = { getChauffeursCount, getAllUsers, createChauffeur, updateChauffeurStatus };

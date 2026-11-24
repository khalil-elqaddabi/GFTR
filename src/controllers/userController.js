const userService = require("../services/userService");

const getChauffeursCount = async (req, res, next) => {
  try {
    const count = await userService.getChauffeursCount();
    return res.status(200).json({ success: true, count });
  } catch (error) { next(error); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) { next(error); }
};

const createChauffeur = async (req, res, next) => {
  try {
    const user = await userService.createChauffeur(req.body);
    return res.status(201).json({
      success: true,
      message: "Chauffeur created successfully",
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch (error) { next(error); }
};

const updateChauffeurStatus = async (req, res, next) => {
  try {
    const user = await userService.updateChauffeurStatus(req.params.id, req.body.isActive);
    return res.status(200).json({ success: true, message: "Chauffeur status updated", user });
  } catch (error) { next(error); }
};

module.exports = { getChauffeursCount, getAllUsers, createChauffeur, updateChauffeurStatus };

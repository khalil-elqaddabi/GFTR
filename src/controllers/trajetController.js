const trajetService = require("../services/trajetService");

const createTrajet = async (req, res, next) => {
  try {
    const trajet = await trajetService.createTrajet(req.body);

    res.status(201).json({
      success: true,
      message: "Trajet created successfully",
      trajet,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTrajets = async (req, res, next) => {
  try {
    const trajets = await trajetService.getAllTrajets();

    res.status(200).json({
      success: true,
      trajets,
    });
  } catch (error) {
    next(error);
  }
};

const getTrajetById = async (req, res, next) => {
  try {
    const trajet = await trajetService.getTrajetById(req.params.id);

    // Chauffeur can only access his own trajet
    if (
      req.user.role === "CHAUFFEUR" &&
      trajet.chauffeurId._id.toString() !== req.user.userId.toString()
    ) {
      const error = new Error("You can only access your own trajets");

      error.statusCode = 403;

      throw error;
    }

    res.status(200).json({
      success: true,
      trajet,
    });
  } catch (error) {
    next(error);
  }
};

const getMyTrajets = async (req, res, next) => {
  try {
    const trajets = await trajetService.getMyTrajets(req.user.userId);

    res.status(200).json({
      success: true,
      trajets,
    });
  } catch (error) {
    next(error);
  }
};

const updateTrajet = async (req, res, next) => {
  try {
    const trajet = await trajetService.updateTrajet(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Trajet updated successfully",
      trajet,
    });
  } catch (error) {
    next(error);
  }
};
const updateMileageAndFuel = async (req, res, next) => {
  try {
    const trajet = await trajetService.updateMileageAndFuel(
      req.params.id,
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Mileage and fuel updated successfully",
      trajet,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTrajet = async (req, res, next) => {
  try {
    const trajet = await trajetService.deleteTrajet(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trajet deleted successfully",
      trajet,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  getMyTrajets,
  updateTrajet,
  deleteTrajet,
  updateMileageAndFuel,
};

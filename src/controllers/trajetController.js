const trajetService = require("../services/trajetService");
const trajetPdfService = require("../services/trajetPdfService");
const Trajet = require("../models/Trajet");
const storageService = require("../services/storageService");
const missionOrderStorageService = require("../services/missionOrderStorageService");

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

const updateTrajetStatus = async (req, res, next) => {
  try {
    const trajet = await trajetService.updateTrajetStatus(
      req.params.id,
      req.body.status,
      {
        userId: req.user.userId,
        role: req.user.role,
      },
    );

    res.status(200).json({
      success: true,
      message: "Trajet status updated successfully",
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

const downloadTrajetPdf = async (req, res, next) => {
  try {
    const doc = await trajetPdfService.generateTrajetPdf(req.params.id, {
      userId: req.user.userId,
      role: req.user.role,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ordre-mission-${req.params.id}.pdf"`,
    );

    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};

const getMissionOrderUrl = async (req, res, next) => {
  try {
    const trajet = await Trajet.findById(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet not found",
      });
    }

    const userId = req.user.userId?.toString();
    const role = req.user.role;

    const isAdmin = role === "ADMIN";
    const isAssignedChauffeur =
      role === "CHAUFFEUR" && trajet.chauffeurId.toString() === userId;

    if (!isAdmin && !isAssignedChauffeur) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this mission order",
      });
    }

    if (!trajet.bucket || !trajet.s3Key) {
      await missionOrderStorageService.storeMissionOrderPdf(trajet._id, {
        userId: req.user.userId,
        role: req.user.role,
      });

      trajet.bucket = process.env.S3_BUCKET || "fleettrack-documents";
      trajet.s3Key = `mission-orders/${trajet._id}/ordre-mission-${trajet._id}.pdf`;
    }
    const url = await storageService.createPresignedDownloadUrl(
      trajet.s3Key,
      15 * 60,
    );

    return res.status(200).json({
      success: true,
      url,
      expiresIn: 900,
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
  updateTrajetStatus,
  downloadTrajetPdf,
  getMissionOrderUrl,
};

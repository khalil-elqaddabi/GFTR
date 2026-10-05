const Trajet = require("../models/Trajet");
const User = require("../models/User");
const Camion = require("../models/Camion");
const Remorque = require("../models/Remorque");

const {
  checkCamionAvailability,
  checkRemorqueAvailability,
  checkChauffeurAvailability,
} = require("./availabilityService");

const validateDates = (plannedStartDate, plannedEndDate) => {
  const startDate = new Date(plannedStartDate);
  const endDate = new Date(plannedEndDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    const error = new Error("Invalid planned dates");
    error.statusCode = 400;
    throw error;
  }

  if (startDate >= endDate) {
    const error = new Error("plannedStartDate must be before plannedEndDate");

    error.statusCode = 400;
    throw error;
  }

  return {
    startDate,
    endDate,
  };
};

const validateResources = async (chauffeurId, camionId, remorqueId) => {
  const chauffeur = await User.findById(chauffeurId);

  if (!chauffeur) {
    const error = new Error("Chauffeur not found");
    error.statusCode = 404;
    throw error;
  }

  if (chauffeur.role !== "CHAUFFEUR") {
    const error = new Error("Selected user is not a chauffeur");

    error.statusCode = 400;
    throw error;
  }

  if (!chauffeur.isActive) {
    const error = new Error("Chauffeur is suspended or inactive");

    error.statusCode = 409;
    throw error;
  }

  const camion = await Camion.findById(camionId);

  if (!camion) {
    const error = new Error("Camion not found");
    error.statusCode = 404;
    throw error;
  }

  if (camion.isArchived) {
    const error = new Error("Camion is archived");

    error.statusCode = 409;
    throw error;
  }

  if (camion.status === "maintenance") {
    const error = new Error("Camion is under maintenance");

    error.statusCode = 409;
    throw error;
  }

  const remorque = await Remorque.findById(remorqueId);

  if (!remorque) {
    const error = new Error("Remorque not found");
    error.statusCode = 404;
    throw error;
  }

  if (remorque.isArchived) {
    const error = new Error("Remorque is archived");

    error.statusCode = 409;
    throw error;
  }

  if (remorque.status === "maintenance") {
    const error = new Error("Remorque is under maintenance");

    error.statusCode = 409;
    throw error;
  }

  return {
    chauffeur,
    camion,
    remorque,
  };
};

const checkAvailability = async (
  chauffeurId,
  camionId,
  remorqueId,
  startDate,
  endDate,
  excludeTrajetId = null,
) => {
  const camionAvailable = await checkCamionAvailability(
    camionId,
    startDate,
    endDate,
    excludeTrajetId,
  );

  if (!camionAvailable) {
    const error = new Error("Camion is not available during this period");

    error.statusCode = 409;
    throw error;
  }

  const remorqueAvailable = await checkRemorqueAvailability(
    remorqueId,
    startDate,
    endDate,
    excludeTrajetId,
  );

  if (!remorqueAvailable) {
    const error = new Error("Remorque is not available during this period");

    error.statusCode = 409;
    throw error;
  }

  const chauffeurAvailable = await checkChauffeurAvailability(
    chauffeurId,
    startDate,
    endDate,
    excludeTrajetId,
  );

  if (!chauffeurAvailable) {
    const error = new Error("Chauffeur is not available during this period");

    error.statusCode = 409;
    throw error;
  }
};

const createTrajet = async (data) => {
  const {
    chauffeurId,
    camionId,
    remorqueId,
    plannedStartDate,
    plannedEndDate,
  } = data;

  const { startDate, endDate } = validateDates(
    plannedStartDate,
    plannedEndDate,
  );

  await validateResources(chauffeurId, camionId, remorqueId);

  await checkAvailability(
    chauffeurId,
    camionId,
    remorqueId,
    startDate,
    endDate,
  );

  const trajet = await Trajet.create({
    ...data,
    plannedStartDate: startDate,
    plannedEndDate: endDate,
  });

  return trajet;
};

const getAllTrajets = async () => {
  return await Trajet.find()
    .populate("chauffeurId", "firstName lastName email role")
    .populate("camionId", "registrationNumber brand model status")
    .populate("remorqueId", "registrationNumber type status")
    .sort({
      createdAt: -1,
    });
};

const getTrajetById = async (id) => {
  const trajet = await Trajet.findById(id)
    .populate("chauffeurId", "firstName lastName email role")
    .populate("camionId", "registrationNumber brand model status")
    .populate("remorqueId", "registrationNumber type status");

  if (!trajet) {
    const error = new Error("Trajet not found");
    error.statusCode = 404;
    throw error;
  }

  return trajet;
};

const getMyTrajets = async (chauffeurId) => {
  return await Trajet.find({
    chauffeurId,
  })
    .populate("camionId", "registrationNumber brand model status")
    .populate("remorqueId", "registrationNumber type status")
    .sort({
      plannedStartDate: 1,
    });
};

const updateTrajet = async (id, data) => {
  const existingTrajet = await Trajet.findById(id);

  if (!existingTrajet) {
    const error = new Error("Trajet not found");
    error.statusCode = 404;
    throw error;
  }

  const chauffeurId = data.chauffeurId || existingTrajet.chauffeurId;

  const camionId = data.camionId || existingTrajet.camionId;

  const remorqueId = data.remorqueId || existingTrajet.remorqueId;

  const plannedStartDate =
    data.plannedStartDate || existingTrajet.plannedStartDate;

  const plannedEndDate = data.plannedEndDate || existingTrajet.plannedEndDate;

  const { startDate, endDate } = validateDates(
    plannedStartDate,
    plannedEndDate,
  );

  await validateResources(chauffeurId, camionId, remorqueId);

  await checkAvailability(
    chauffeurId,
    camionId,
    remorqueId,
    startDate,
    endDate,
    id,
  );

  const trajet = await Trajet.findByIdAndUpdate(
    id,
    {
      ...data,
      plannedStartDate: startDate,
      plannedEndDate: endDate,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("chauffeurId", "firstName lastName email role")
    .populate("camionId", "registrationNumber brand model status")
    .populate("remorqueId", "registrationNumber type status");

  return trajet;
};

const deleteTrajet = async (id) => {
  const trajet = await Trajet.findByIdAndDelete(id);

  if (!trajet) {
    const error = new Error("Trajet not found");
    error.statusCode = 404;
    throw error;
  }

  return trajet;
};

module.exports = {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  getMyTrajets,
  updateTrajet,
  deleteTrajet,
};

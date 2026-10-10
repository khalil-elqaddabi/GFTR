const Trajet = require("../models/Trajet");
const User = require("../models/User");
const Camion = require("../models/Camion");
const Remorque = require("../models/Remorque");
const Maintenance = require("../models/Maintenance");
const MaintenanceRule = require("../models/MaintenanceRule");
const Pneu = require("../models/Pneu");

const { calculateTripMetrics } = require("./mileageFuelService");

const {
  checkCamionAvailability,
  checkRemorqueAvailability,
  checkChauffeurAvailability,
} = require("./availabilityService");

// VALIDATE DATES

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

const checkUnresolvedMaintenance = async (resourceType, resourceId) => {
  const resourceField = resourceType === "CAMION" ? "camionId" : "remorqueId";

  // Check unresolved maintenance records
  const unresolvedMaintenance = await Maintenance.findOne({
    [resourceField]: resourceId,
    status: { $in: ["pending", "in_progress"] },
  });

  if (unresolvedMaintenance) {
    const error = new Error(
      `${resourceType} has unresolved maintenance and cannot be assigned`,
    );
    error.statusCode = 409;
    throw error;
  }

  // Check maintenance mileage alerts
  const maintenanceRuleService = require("./maintenanceRuleService");

  const result = await maintenanceRuleService.checkMaintenanceRequired(
    resourceType,
    resourceId,
  );

  if (result.maintenanceRequired) {
    const error = new Error(
      `${resourceType} requires maintenance before assignment`,
    );
    error.statusCode = 409;
    error.details = result.alerts;
    throw error;
  }
};

const checkWornPneus = async (camionId) => {
  const wornPneu = await Pneu.findOne({
    camionId,
    status: "worn",
  });

  if (wornPneu) {
    const error = new Error(
      `Camion cannot be assigned: pneu ${wornPneu.serialNumber} must be replaced`,
    );
    error.statusCode = 409;
    throw error;
  }
};

// VALIDATE RESOURCES

const validateResources = async (chauffeurId, camionId, remorqueId) => {
  // CHAUFFEUR

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

  // CAMION

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
  await checkUnresolvedMaintenance("CAMION", camionId);
  await checkWornPneus(camionId);

  // REMORQUE

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
  await checkUnresolvedMaintenance("REMORQUE", remorqueId);

  return {
    chauffeur,
    camion,
    remorque,
  };
};

// CHECK AVAILABILITY

const checkAvailability = async (
  chauffeurId,
  camionId,
  remorqueId,
  startDate,
  endDate,
  excludeTrajetId = null,
) => {
  // CAMION

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

  // REMORQUE

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

  // CHAUFFEUR

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

// CREATE TRAJET

const createTrajet = async (data) => {
  if (!data || typeof data !== "object") {
    const error = new Error("Request body is missing or invalid");
    error.statusCode = 400;
    throw error;
  }
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

// GET ALL TRAJETS

const getAllTrajets = async () => {
  return await Trajet.find()
    .populate("chauffeurId", "firstName lastName email role")
    .populate("camionId", "registrationNumber brand model status")
    .populate("remorqueId", "registrationNumber type status")
    .sort({
      createdAt: -1,
    });
};

// GET TRAJET BY ID

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

// GET MY TRAJETS

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

// UPDATE TRAJET / ASSIGNMENT

const updateTrajet = async (id, data) => {
  const existingTrajet = await Trajet.findById(id);

  if (!existingTrajet) {
    const error = new Error("Trajet not found");
    error.statusCode = 404;
    throw error;
  }
  if (data.status !== undefined) {
    const error = new Error(
      "Update status using the dedicated status endpoint",
    );
    error.statusCode = 400;
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

// J5 - UPDATE MILEAGE & FUEL

const updateMileageAndFuel = async (trajetId, chauffeurId, data) => {
  const { departureMileage, arrivalMileage, fuelConsumed, remarks } = data;

  // FIND TRAJET

  const trajet = await Trajet.findById(trajetId);

  if (!trajet) {
    const error = new Error("Trajet not found");

    error.statusCode = 404;
    throw error;
  }

  // CHECK OWNERSHIP

  if (trajet.chauffeurId.toString() !== chauffeurId.toString()) {
    const error = new Error("You can only update your own trajet");

    error.statusCode = 403;
    throw error;
  }

  // REQUIRED FIELDS

  if (
    departureMileage === undefined ||
    arrivalMileage === undefined ||
    fuelConsumed === undefined
  ) {
    const error = new Error(
      "Departure mileage, arrival mileage and fuel consumed are required",
    );

    error.statusCode = 400;
    throw error;
  }

  // CALCULATE METRICS

  const { totalDistance, averageConsumption } = calculateTripMetrics(
    departureMileage,
    arrivalMileage,
    fuelConsumed,
  );

  const camion = await Camion.findById(trajet.camionId);

  if (!camion) {
    const error = new Error("Camion not found");
    error.statusCode = 404;
    throw error;
  }

  if (arrivalMileage < camion.currentMileage) {
    const error = new Error(
      "Arrival mileage cannot be less than camion current mileage",
    );
    error.statusCode = 400;
    throw error;
  }

  camion.currentMileage = arrivalMileage;

  await camion.save();

  // UPDATE TRAJET

  trajet.departureMileage = departureMileage;

  trajet.arrivalMileage = arrivalMileage;

  trajet.fuelConsumed = fuelConsumed;

  trajet.totalDistance = totalDistance;

  trajet.averageConsumption = averageConsumption;

  if (remarks !== undefined) {
    trajet.remarks = remarks;
  }

  await trajet.save();

  return trajet;
};

// DELETE TRAJET

const deleteTrajet = async (id) => {
  const trajet = await Trajet.findByIdAndDelete(id);

  if (!trajet) {
    const error = new Error("Trajet not found");

    error.statusCode = 404;
    throw error;
  }

  return trajet;
};

const updateTrajetStatus = async (id, newStatus, user) => {
  const allowedStatuses = ["à faire", "en cours", "terminé"];

  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error("Invalid trajet status");
    error.statusCode = 400;
    throw error;
  }

  const trajet = await Trajet.findById(id);

  if (!trajet) {
    const error = new Error("Trajet not found");
    error.statusCode = 404;
    throw error;
  }

  const currentStatus = trajet.status;

  if (user.role === "CHAUFFEUR") {
    // Le chauffeur ne peut modifier que ses propres trajets
    if (trajet.chauffeurId.toString() !== user.userId.toString()) {
      const error = new Error("You can only update your own trajet");
      error.statusCode = 403;
      throw error;
    }

    const nextStatus = {
      "à faire": "en cours",
      "en cours": "terminé",
    };

    if (nextStatus[currentStatus] !== newStatus) {
      const error = new Error("Invalid status transition");
      error.statusCode = 400;
      throw error;
    }
  } else if (user.role !== "ADMIN") {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  trajet.status = newStatus;
  await trajet.save();

  await trajet.populate([
    {
      path: "chauffeurId",
      select: "firstName lastName email role",
    },
    {
      path: "camionId",
      select: "registrationNumber brand model status",
    },
    {
      path: "remorqueId",
      select: "registrationNumber type status",
    },
  ]);

  return trajet;
};

// EXPORTS

module.exports = {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  getMyTrajets,
  updateTrajet,
  deleteTrajet,
  updateMileageAndFuel,
  updateTrajetStatus,
};

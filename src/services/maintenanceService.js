const Maintenance = require("../models/Maintenance");
const Camion = require("../models/Camion");
const Remorque = require("../models/Remorque");

const validateResource = async (camionId, remorqueId) => {
  if (!camionId && !remorqueId) {
    const error = new Error(
      "Maintenance must belong to a camion or a remorque",
    );
    error.statusCode = 400;
    throw error;
  }

  if (camionId && remorqueId) {
    const error = new Error(
      "Maintenance cannot belong to both camion and remorque",
    );
    error.statusCode = 400;
    throw error;
  }

  if (camionId) {
    const camion = await Camion.findById(camionId);

    if (!camion) {
      const error = new Error("Camion not found");
      error.statusCode = 404;
      throw error;
    }
  }

  if (remorqueId) {
    const remorque = await Remorque.findById(remorqueId);

    if (!remorque) {
      const error = new Error("Remorque not found");
      error.statusCode = 404;
      throw error;
    }
  }
};

const createMaintenance = async (data) => {
  await validateResource(data.camionId, data.remorqueId);

  const maintenance = await Maintenance.create(data);

  return maintenance;
};

const getAllMaintenances = async () => {
  const maintenances = await Maintenance.find()
    .populate("camionId", "registrationNumber brand model currentMileage")
    .populate("remorqueId", "registrationNumber type currentMileage");

  return maintenances;
};

const getMaintenanceById = async (id) => {
  const maintenance = await Maintenance.findById(id)
    .populate("camionId", "registrationNumber brand model currentMileage")
    .populate("remorqueId", "registrationNumber type currentMileage");

  if (!maintenance) {
    const error = new Error("Maintenance not found");
    error.statusCode = 404;
    throw error;
  }

  return maintenance;
};

const updateMaintenance = async (id, data) => {
  if (data.camionId || data.remorqueId) {
    await validateResource(data.camionId, data.remorqueId);
  }

  const maintenance = await Maintenance.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("camionId", "registrationNumber brand model currentMileage")
    .populate("remorqueId", "registrationNumber type currentMileage");

  if (!maintenance) {
    const error = new Error("Maintenance not found");
    error.statusCode = 404;
    throw error;
  }

  return maintenance;
};

const deleteMaintenance = async (id) => {
  const maintenance = await Maintenance.findByIdAndDelete(id);

  if (!maintenance) {
    const error = new Error("Maintenance not found");
    error.statusCode = 404;
    throw error;
  }

  return maintenance;
};

module.exports = {
  createMaintenance,
  getAllMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};

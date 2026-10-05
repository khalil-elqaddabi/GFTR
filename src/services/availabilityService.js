const Trajet = require("../models/Trajet");

const checkResourceAvailability = async (
  resourceField,
  resourceId,
  plannedStartDate,
  plannedEndDate,
  excludeTrajetId = null,
) => {
  const query = {
    [resourceField]: resourceId,

    plannedStartDate: {
      $lt: plannedEndDate,
    },

    plannedEndDate: {
      $gt: plannedStartDate,
    },

    status: {
      $in: ["à faire", "en cours"],
    },
  };

  // Exclude current trajet during update
  if (excludeTrajetId) {
    query._id = {
      $ne: excludeTrajetId,
    };
  }

  const conflict = await Trajet.findOne(query);

  return !conflict;
};

const checkCamionAvailability = async (
  camionId,
  plannedStartDate,
  plannedEndDate,
  excludeTrajetId = null,
) => {
  return checkResourceAvailability(
    "camionId",
    camionId,
    plannedStartDate,
    plannedEndDate,
    excludeTrajetId,
  );
};

const checkRemorqueAvailability = async (
  remorqueId,
  plannedStartDate,
  plannedEndDate,
  excludeTrajetId = null,
) => {
  return checkResourceAvailability(
    "remorqueId",
    remorqueId,
    plannedStartDate,
    plannedEndDate,
    excludeTrajetId,
  );
};

const checkChauffeurAvailability = async (
  chauffeurId,
  plannedStartDate,
  plannedEndDate,
  excludeTrajetId = null,
) => {
  return checkResourceAvailability(
    "chauffeurId",
    chauffeurId,
    plannedStartDate,
    plannedEndDate,
    excludeTrajetId,
  );
};

module.exports = {
  checkCamionAvailability,
  checkRemorqueAvailability,
  checkChauffeurAvailability,
};

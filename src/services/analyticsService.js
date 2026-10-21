
const Trajet = require("../models/Trajet");
const Pneu = require("../models/Pneu");
const FleetUtilization = require("../models/FleetUtilization");
const Camion = require("../models/Camion");

// 1. Drivers Eco Performance
const getDriversEcoPerformance = async () => {
  return Trajet.aggregate([
    {
      $match: {
        status: "terminé",
        totalDistance: { $gt: 0 },
        fuelConsumed: { $gte: 0 },
        chauffeurId: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$chauffeurId",
        totalDistance: { $sum: "$totalDistance" },
        totalFuelConsumed: { $sum: "$fuelConsumed" },
        completedTrips: { $sum: 1 },
      },
    },
    {
      $addFields: {
        averageConsumption: {
          $multiply: [
            { $divide: ["$totalFuelConsumed", "$totalDistance"] },
            100,
          ],
        },
      },
    },
    {
      $addFields: {
        ecoScore: {
          $max: [
            0,
            {
              $min: [
                100,
                {
                  $subtract: [
                    100,
                    {
                      $multiply: [
                        { $subtract: ["$averageConsumption", 30] },
                        2.5,
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "driver",
      },
    },
    { $unwind: "$driver" },
    {
      $project: {
        _id: 0,
        chauffeurId: "$_id",
        firstName: "$driver.firstName",
        lastName: "$driver.lastName",
        totalDistance: 1,
        totalFuelConsumed: 1,
        completedTrips: 1,
        averageConsumption: { $round: ["$averageConsumption", 2] },
        ecoScore: { $round: ["$ecoScore", 2] },
      },
    },
    { $sort: { ecoScore: -1 } },
  ]);
};

// 2. Tires Health Matrix
const getTiresHealthMatrix = async () => {
  return Pneu.aggregate([
    {
      $addFields: {
        pneuMileage: {
          $subtract: [
            { $ifNull: ["$currentMileage", 0] },
            { $ifNull: ["$installationMileage", 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        wearPercentage: {
          $cond: [
            { $gt: ["$wearThreshold", 0] },
            {
              $multiply: [
                { $divide: ["$pneuMileage", "$wearThreshold"] },
                100,
              ],
            },
            null,
          ],
        },
      },
    },
    {
      $addFields: {
        wearAlert: {
          $or: [
            { $eq: ["$status", "worn"] },
            { $gte: ["$pneuMileage", "$wearThreshold"] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        serialNumber: 1,
        position: 1,
        status: 1,
        camionId: 1,
        installationMileage: 1,
        currentMileage: 1,
        wearThreshold: 1,
        pneuMileage: 1,
        wearPercentage: { $round: ["$wearPercentage", 2] },
        wearAlert: 1,
      },
    },
    { $sort: { wearPercentage: -1 } },
  ]);
};

// 3. Trips Financial ESG
const getTripsFinancialESG = async (filters = {}) => {
  const { startDate, endDate } = filters;

  const match = {
    status: "terminé",
    fuelConsumed: { $gte: 0 },
  };

  if (startDate || endDate) {
    match.plannedStartDate = {};

    if (startDate) {
      match.plannedStartDate.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      match.plannedStartDate.$lte = end;
    }
  }

  return Trajet.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        totalDistance: {
          $sum: { $ifNull: ["$totalDistance", 0] },
        },
        totalFuelConsumed: { $sum: "$fuelConsumed" },
      },
    },
    {
      $project: {
        _id: 0,
        totalTrips: 1,
        totalDistance: 1,
        totalFuelConsumed: 1,
        co2Tonnes: {
          $round: [
            {
              $divide: [
                { $multiply: ["$totalFuelConsumed", 2.68] },
                1000,
              ],
            },
            3,
          ],
        },
      },
    },
  ]);
};

// Generate maintenance estimate once per truck and month.
// The unique index on FleetUtilization prevents duplicate records.
const getOrCreateMaintenanceEstimate = async (camionId, month) => {
  let estimate = await FleetUtilization.findOne({ camionId, month });

  if (estimate) {
    return estimate;
  }

  const estimatedMaintenanceHours = Math.floor(Math.random() * 25);

  try {
    return await FleetUtilization.create({
      camionId,
      month,
      estimatedMaintenanceHours,
    });
  } catch (error) {
    if (error.code === 11000) {
      return FleetUtilization.findOne({ camionId, month });
    }

    throw error;
  }
};

// 4. Fleet Utilization Trends (whole fleet, grouped by month)
const getFleetUtilizationTrends = async () => {
  const trips = await Trajet.aggregate([
    {
      $match: {
        status: "terminé",
        plannedStartDate: { $type: "date" },
        plannedEndDate: { $type: "date" },
        $expr: {
          $gt: ["$plannedEndDate", "$plannedStartDate"],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$plannedStartDate",
          },
        },
        missionDurationHours: {
          $sum: {
            $divide: [
              { $subtract: ["$plannedEndDate", "$plannedStartDate"] },
              3600000,
            ],
          },
        },
        completedTrips: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (trips.length === 0) {
    return [];
  }

  const activeTrucks = await Camion.find({
    isArchived: false,
  })
    .select("_id")
    .lean();

  const fleetSize = activeTrucks.length;

  if (fleetSize === 0) {
    return trips.map((trip) => ({
      month: trip._id,
      completedTrips: trip.completedTrips,
      missionDurationHours: Number(
        trip.missionDurationHours.toFixed(2),
      ),
      totalMaintenanceHours: 0,
      totalAvailableHours: 0,
      utilizationRatio: 0,
    }));
  }

  const results = [];

  for (const trip of trips) {
    const month = trip._id;

    const estimates = await Promise.all(
      activeTrucks.map((truck) =>
        getOrCreateMaintenanceEstimate(truck._id, month),
      ),
    );

    const totalMaintenanceHours = estimates.reduce(
      (total, estimate) =>
        total + estimate.estimatedMaintenanceHours,
      0,
    );

    // Calendar hours in this month multiplied by fleet size.
    const [year, monthNumber] = month.split("-").map(Number);
    const hoursInMonth = new Date(
      Date.UTC(year, monthNumber, 0),
    ).getUTCDate() * 24;

    const totalFleetHours = hoursInMonth * fleetSize;
    const missionDurationHours = trip.missionDurationHours;

    // Available time is the remaining time after missions and
    // estimated maintenance. This is a demo estimate, not real history.
    const totalAvailableHours = Math.max(
      0,
      totalFleetHours -
        missionDurationHours -
        totalMaintenanceHours,
    );

    const denominator =
      totalAvailableHours + totalMaintenanceHours;

    const utilizationRatio =
      denominator > 0
        ? Number(
            (
              (missionDurationHours / denominator) *
              100
            ).toFixed(2),
          )
        : 0;

    results.push({
      month,
      completedTrips: trip.completedTrips,
      fleetSize,
      totalFleetHours,
      missionDurationHours: Number(
        missionDurationHours.toFixed(2),
      ),
      totalMaintenanceHours,
      totalAvailableHours,
      utilizationRatio,
    });
  }

  return results;
};

module.exports = {
  getDriversEcoPerformance,
  getTiresHealthMatrix,
  getTripsFinancialESG,
  getFleetUtilizationTrends,
};

const mongoose = require("mongoose");

const fleetUtilizationSchema = new mongoose.Schema(
  {
    camionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camion",
      required: true,
    },

    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },

    estimatedMaintenanceHours: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

fleetUtilizationSchema.index(
  { camionId: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "FleetUtilization",
  fleetUtilizationSchema
);
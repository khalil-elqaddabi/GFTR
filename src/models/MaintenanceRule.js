const mongoose = require("mongoose");

const maintenanceRuleSchema = new mongoose.Schema(
    {
        resourceType: {
            type: String,
            required: true,
            enum: ["CAMION", "REMORQUE"]
        },

        maintenanceType: {
            type: String,
            required: true,
            trim: true
        },

        intervalKm: {
            type: Number,
            required: true,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "MaintenanceRule",
    maintenanceRuleSchema
);
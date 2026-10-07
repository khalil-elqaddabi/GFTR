const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
    {
        camionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camion",
            default: null
        },

        remorqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Remorque",
            default: null
        },

        type: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            required: true,
            enum: ["pending", "in_progress", "completed"],
            default: "pending"
        },

        mileageAtMaintenance: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        maintenanceDate: {
            type: Date,
            required: true
        },

        nextMaintenanceDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
const mongoose = require("mongoose");

const pneuSchema = new mongoose.Schema(
    {
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        position: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            required: true,
            enum: ["available", "installed", "worn"],
            default: "available"
        },

        installationMileage: {
            type: Number,
            default: 0
        },

        currentMileage: {
            type: Number,
            default: 0
        },

        wearThreshold: {
            type: Number,
            required: true
        },

        camionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camion",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Pneu", pneuSchema);
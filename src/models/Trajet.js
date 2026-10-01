const mongoose = require("mongoose");

const trajetSchema = new mongoose.Schema(
    {
        chauffeurId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        camionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camion",
            required: true
        },

        remorqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Remorque",
            required: true
        },

        departureSite: {
            type: String,
            required: true,
            trim: true
        },

        arrivalSite: {
            type: String,
            required: true,
            trim: true
        },

        merchandise: {
            type: String,
            required: true,
            trim: true
        },

        plannedStartDate: {
            type: Date,
            required: true
        },

        plannedEndDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["à faire", "en cours", "terminé"],
            default: "à faire"
        },

        departureMileage: {
            type: Number,
            default: null
        },

        arrivalMileage: {
            type: Number,
            default: null
        },

        fuelConsumed: {
            type: Number,
            default: null
        },

        totalDistance: {
            type: Number,
            default: null
        },

        averageConsumption: {
            type: Number,
            default: null
        },

        remarks: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Trajet", trajetSchema);
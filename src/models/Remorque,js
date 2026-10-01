const mongoose = require("mongoose");

const remorqueSchema = new mongoose.Schema(
    {
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            required: true,
            enum: ["available", "maintenance", "active"],
            default: "available"
        },

        currentMileage: {
            type: Number,
            default: 0
        },

        isArchived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Remorque", remorqueSchema);
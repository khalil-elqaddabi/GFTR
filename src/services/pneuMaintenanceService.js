const Pneu = require("../models/Pneu");

const calculatePneuMileage = (pneu) => {
    if (!pneu) {
        const error = new Error("Pneu not found");
        error.statusCode = 404;
        throw error;
    }

    const installationMileage = pneu.installationMileage ?? 0;
    const currentMileage = pneu.currentMileage ?? 0;

    if (currentMileage < installationMileage) {
        const error = new Error(
            "Current mileage cannot be less than installation mileage"
        );
        error.statusCode = 400;
        throw error;
    }

    return currentMileage - installationMileage;
};

const checkPneuWear = (pneu) => {
    const pneuMileage = calculatePneuMileage(pneu);

    const wearThreshold = pneu.wearThreshold;

    if (typeof wearThreshold !== "number" || wearThreshold < 0) {
        const error = new Error("Invalid pneu wear threshold");
        error.statusCode = 400;
        throw error;
    }

    const wearAlert = pneuMileage >= wearThreshold;

    return {
        pneuMileage,
        wearThreshold,
        wearAlert,
        message: wearAlert
            ? "Pneu has reached or exceeded the wear threshold and must be replaced"
            : "Pneu is still within the allowed wear threshold"
    };
};

const updatePneuMileage = async (pneuId, currentMileage) => {
    if (typeof currentMileage !== "number" || currentMileage < 0) {
        const error = new Error(
            "Current mileage must be a positive number or zero"
        );
        error.statusCode = 400;
        throw error;
    }

    const pneu = await Pneu.findById(pneuId);

    if (!pneu) {
        const error = new Error("Pneu not found");
        error.statusCode = 404;
        throw error;
    }

    if (currentMileage < pneu.installationMileage) {
        const error = new Error(
            "Current mileage cannot be less than installation mileage"
        );
        error.statusCode = 400;
        throw error;
    }

    pneu.currentMileage = currentMileage;

    const wear = checkPneuWear(pneu);

    if (wear.wearAlert) {
        pneu.status = "worn";
    }

    await pneu.save();

    return {
        pneu,
        ...wear
    };
};

module.exports = {
    calculatePneuMileage,
    checkPneuWear,
    updatePneuMileage
};
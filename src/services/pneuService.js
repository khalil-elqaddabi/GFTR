const Pneu = require("../models/Pneu");
const Camion = require("../models/Camion");

const createPneu = async (data) => {
    if (data.camionId) {
        const camion = await Camion.findById(data.camionId);

        if (!camion) {
            const error = new Error("Camion not found");
            error.statusCode = 404;
            throw error;
        }
    }

    const pneu = await Pneu.create(data);

    return pneu;
};

const getAllPneus = async () => {
    const pneus = await Pneu.find().populate(
        "camionId",
        "registrationNumber brand model"
    );

    return pneus;
};

const getPneuById = async (id) => {
    const pneu = await Pneu.findById(id).populate(
        "camionId",
        "registrationNumber brand model"
    );

    if (!pneu) {
        const error = new Error("Pneu not found");
        error.statusCode = 404;
        throw error;
    }

    return pneu;
};

const updatePneu = async (id, data) => {
    if (data.camionId) {
        const camion = await Camion.findById(data.camionId);

        if (!camion) {
            const error = new Error("Camion not found");
            error.statusCode = 404;
            throw error;
        }
    }

    const pneu = await Pneu.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "camionId",
        "registrationNumber brand model"
    );

    if (!pneu) {
        const error = new Error("Pneu not found");
        error.statusCode = 404;
        throw error;
    }

    return pneu;
};

const deletePneu = async (id) => {
    const pneu = await Pneu.findByIdAndDelete(id);

    if (!pneu) {
        const error = new Error("Pneu not found");
        error.statusCode = 404;
        throw error;
    }

    return pneu;
};

module.exports = {
    createPneu,
    getAllPneus,
    getPneuById,
    updatePneu,
    deletePneu
};
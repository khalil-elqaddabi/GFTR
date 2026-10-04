const Camion = require("../models/Camion");

const createCamion = async (data) => {
    const camion = await Camion.create(data);

    return camion;
};

const getAllCamions = async () => {
    const camions = await Camion.find();

    return camions;
};

const getCamionById = async (id) => {
    const camion = await Camion.findById(id);

    if (!camion) {
        const error = new Error("Camion not found");
        error.statusCode = 404;
        throw error;
    }

    return camion;
};

const updateCamion = async (id, data) => {
    const camion = await Camion.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!camion) {
        const error = new Error("Camion not found");
        error.statusCode = 404;
        throw error;
    }

    return camion;
};

const deleteCamion = async (id) => {
    const camion = await Camion.findByIdAndDelete(id);

    if (!camion) {
        const error = new Error("Camion not found");
        error.statusCode = 404;
        throw error;
    }

    return camion;
};

module.exports = {
    createCamion,
    getAllCamions,
    getCamionById,
    updateCamion,
    deleteCamion
};
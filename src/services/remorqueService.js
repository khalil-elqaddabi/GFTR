const Remorque = require("../models/Remorque");

const createRemorque = async (data) => {
    const remorque = await Remorque.create(data);

    return remorque;
};

const getAllRemorques = async () => {
    const remorques = await Remorque.find();

    return remorques;
};

const getRemorqueById = async (id) => {
    const remorque = await Remorque.findById(id);

    if (!remorque) {
        const error = new Error("Remorque not found");
        error.statusCode = 404;
        throw error;
    }

    return remorque;
};

const updateRemorque = async (id, data) => {
    const remorque = await Remorque.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!remorque) {
        const error = new Error("Remorque not found");
        error.statusCode = 404;
        throw error;
    }

    return remorque;
};

const deleteRemorque = async (id) => {
    const remorque = await Remorque.findByIdAndDelete(id);

    if (!remorque) {
        const error = new Error("Remorque not found");
        error.statusCode = 404;
        throw error;
    }

    return remorque;
};

module.exports = {
    createRemorque,
    getAllRemorques,
    getRemorqueById,
    updateRemorque,
    deleteRemorque
};
const remorqueService = require("../services/remorqueService");

const createRemorque = async (req, res, next) => {
    try {
        const remorque = await remorqueService.createRemorque(req.body);

        res.status(201).json({
            success: true,
            message: "Remorque created successfully",
            remorque
        });
    } catch (error) {
        next(error);
    }
};

const getAllRemorques = async (req, res, next) => {
    try {
        const remorques = await remorqueService.getAllRemorques();

        res.status(200).json({
            success: true,
            remorques
        });
    } catch (error) {
        next(error);
    }
};

const getRemorqueById = async (req, res, next) => {
    try {
        const remorque = await remorqueService.getRemorqueById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            remorque
        });
    } catch (error) {
        next(error);
    }
};

const updateRemorque = async (req, res, next) => {
    try {
        const remorque = await remorqueService.updateRemorque(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Remorque updated successfully",
            remorque
        });
    } catch (error) {
        next(error);
    }
};

const deleteRemorque = async (req, res, next) => {
    try {
        await remorqueService.deleteRemorque(req.params.id);

        res.status(200).json({
            success: true,
            message: "Remorque deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRemorque,
    getAllRemorques,
    getRemorqueById,
    updateRemorque,
    deleteRemorque
};
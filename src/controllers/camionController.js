const camionService = require("../services/camionService");

const createCamion = async (req, res, next) => {
    try {
        const camion = await camionService.createCamion(req.body);

        res.status(201).json({
            success: true,
            message: "Camion created successfully",
            camion
        });
    } catch (error) {
        next(error);
    }
};

const getAllCamions = async (req, res, next) => {
    try {
        const camions = await camionService.getAllCamions();

        res.status(200).json({
            success: true,
            camions
        });
    } catch (error) {
        next(error);
    }
};

const getCamionById = async (req, res, next) => {
    try {
        const camion = await camionService.getCamionById(req.params.id);

        res.status(200).json({
            success: true,
            camion
        });
    } catch (error) {
        next(error);
    }
};

const updateCamion = async (req, res, next) => {
    try {
        const camion = await camionService.updateCamion(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Camion updated successfully",
            camion
        });
    } catch (error) {
        next(error);
    }
};

const deleteCamion = async (req, res, next) => {
    try {
        await camionService.deleteCamion(req.params.id);

        res.status(200).json({
            success: true,
            message: "Camion deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCamion,
    getAllCamions,
    getCamionById,
    updateCamion,
    deleteCamion
};
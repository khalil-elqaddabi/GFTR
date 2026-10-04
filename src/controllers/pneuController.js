const pneuService = require("../services/pneuService");

const createPneu = async (req, res, next) => {
    try {
        const pneu = await pneuService.createPneu(req.body);

        res.status(201).json({
            success: true,
            message: "Pneu created successfully",
            pneu
        });
    } catch (error) {
        next(error);
    }
};

const getAllPneus = async (req, res, next) => {
    try {
        const pneus = await pneuService.getAllPneus();

        res.status(200).json({
            success: true,
            pneus
        });
    } catch (error) {
        next(error);
    }
};

const getPneuById = async (req, res, next) => {
    try {
        const pneu = await pneuService.getPneuById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            pneu
        });
    } catch (error) {
        next(error);
    }
};

const updatePneu = async (req, res, next) => {
    try {
        const pneu = await pneuService.updatePneu(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Pneu updated successfully",
            pneu
        });
    } catch (error) {
        next(error);
    }
};

const deletePneu = async (req, res, next) => {
    try {
        await pneuService.deletePneu(req.params.id);

        res.status(200).json({
            success: true,
            message: "Pneu deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPneu,
    getAllPneus,
    getPneuById,
    updatePneu,
    deletePneu
};
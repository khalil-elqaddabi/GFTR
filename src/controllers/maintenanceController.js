const maintenanceService = require("../services/maintenanceService");

const createMaintenance = async (req, res, next) => {
    try {
        const maintenance = await maintenanceService.createMaintenance(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Maintenance created successfully",
            maintenance
        });
    } catch (error) {
        next(error);
    }
};

const getAllMaintenances = async (req, res, next) => {
    try {
        const maintenances =
            await maintenanceService.getAllMaintenances();

        res.status(200).json({
            success: true,
            maintenances
        });
    } catch (error) {
        next(error);
    }
};

const getMaintenanceById = async (req, res, next) => {
    try {
        const maintenance =
            await maintenanceService.getMaintenanceById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            maintenance
        });
    } catch (error) {
        next(error);
    }
};

const updateMaintenance = async (req, res, next) => {
    try {
        const maintenance =
            await maintenanceService.updateMaintenance(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Maintenance updated successfully",
            maintenance
        });
    } catch (error) {
        next(error);
    }
};

const deleteMaintenance = async (req, res, next) => {
    try {
        await maintenanceService.deleteMaintenance(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Maintenance deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMaintenance,
    getAllMaintenances,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
};
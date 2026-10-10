const maintenanceRuleService = require("../services/maintenanceRuleService");

const createRule = async (req, res, next) => {
    try {
        const rule = await maintenanceRuleService.createRule(req.body);

        res.status(201).json({
            success: true,
            message: "Maintenance rule created successfully",
            rule
        });
    } catch (error) {
        next(error);
    }
};

const getAllRules = async (req, res, next) => {
    try {
        const rules = await maintenanceRuleService.getAllRules();

        res.status(200).json({
            success: true,
            rules
        });
    } catch (error) {
        next(error);
    }
};

const getRuleById = async (req, res, next) => {
    try {
        const rule = await maintenanceRuleService.getRuleById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            rule
        });
    } catch (error) {
        next(error);
    }
};

const updateRule = async (req, res, next) => {
    try {
        const rule = await maintenanceRuleService.updateRule(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Maintenance rule updated successfully",
            rule
        });
    } catch (error) {
        next(error);
    }
};

const deleteRule = async (req, res, next) => {
    try {
        await maintenanceRuleService.deleteRule(req.params.id);

        res.status(200).json({
            success: true,
            message: "Maintenance rule deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

const checkMaintenanceRequired = async (req, res, next) => {
    try {
        const result =
            await maintenanceRuleService.checkMaintenanceRequired(
                req.params.resourceType,
                req.params.resourceId
            );

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRule,
    getAllRules,
    getRuleById,
    updateRule,
    deleteRule,
    checkMaintenanceRequired
};
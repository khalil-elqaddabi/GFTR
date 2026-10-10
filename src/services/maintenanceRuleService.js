const MaintenanceRule = require("../models/MaintenanceRule");
const Camion = require("../models/Camion");
const Remorque = require("../models/Remorque");

const createRule = async (data) => {
    const rule = await MaintenanceRule.create(data);

    return rule;
};

const getAllRules = async () => {
    return await MaintenanceRule.find();
};

const getRuleById = async (id) => {
    const rule = await MaintenanceRule.findById(id);

    if (!rule) {
        const error = new Error("Maintenance rule not found");
        error.statusCode = 404;
        throw error;
    }

    return rule;
};

const updateRule = async (id, data) => {
    const rule = await MaintenanceRule.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!rule) {
        const error = new Error("Maintenance rule not found");
        error.statusCode = 404;
        throw error;
    }

    return rule;
};

const deleteRule = async (id) => {
    const rule = await MaintenanceRule.findByIdAndDelete(id);

    if (!rule) {
        const error = new Error("Maintenance rule not found");
        error.statusCode = 404;
        throw error;
    }

    return rule;
};

const checkMaintenanceRequired = async (resourceType, resourceId) => {
    let resource;

    if (resourceType === "CAMION") {
        resource = await Camion.findById(resourceId);
    } else if (resourceType === "REMORQUE") {
        resource = await Remorque.findById(resourceId);
    } else {
        const error = new Error("Invalid resource type");
        error.statusCode = 400;
        throw error;
    }

    if (!resource) {
        const error = new Error("Resource not found");
        error.statusCode = 404;
        throw error;
    }

    const rules = await MaintenanceRule.find({
        resourceType,
        isActive: true
    });

    const alerts = [];

    for (const rule of rules) {
        if (resource.currentMileage >= rule.intervalKm) {
            alerts.push({
                ruleId: rule._id,
                maintenanceType: rule.maintenanceType,
                currentMileage: resource.currentMileage,
                intervalKm: rule.intervalKm,
                maintenanceRequired: true
            });
        }
    }

    return {
        maintenanceRequired: alerts.length > 0,
        alerts
    };
};

module.exports = {
    createRule,
    getAllRules,
    getRuleById,
    updateRule,
    deleteRule,
    checkMaintenanceRequired
};
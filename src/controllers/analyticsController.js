const analyticsService = require("../services/analyticsService");

const getDriversEcoPerformance = async (req, res, next) => {
  try {
    const data = await analyticsService.getDriversEcoPerformance();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getTiresHealthMatrix = async (req, res, next) => {
  try {
    const data = await analyticsService.getTiresHealthMatrix();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getTripsFinancialESG = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const isValidDate = (value) =>
      !value ||
      (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(value)) &&
        new Date(value).toISOString().slice(0, 10) === value);

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message:
          "startDate and endDate must be valid dates in YYYY-MM-DD format",
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate must be before or equal to endDate",
      });
    }

    const data = await analyticsService.getTripsFinancialESG({
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getFleetUtilizationTrends = async (req, res, next) => {
  try {
    const data = await analyticsService.getFleetUtilizationTrends();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDriversEcoPerformance,
  getTiresHealthMatrix,
  getTripsFinancialESG,
  getFleetUtilizationTrends,
};

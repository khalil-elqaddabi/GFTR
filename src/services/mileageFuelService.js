const calculateDistance = (departureMileage, arrivalMileage) => {
  if (
    typeof departureMileage !== "number" ||
    typeof arrivalMileage !== "number"
  ) {
    const error = new Error("Departure and arrival mileage must be numbers");

    error.statusCode = 400;
    throw error;
  }

  if (departureMileage < 0 || arrivalMileage < 0) {
    const error = new Error("Mileage cannot be negative");

    error.statusCode = 400;
    throw error;
  }

  if (arrivalMileage <= departureMileage) {
    const error = new Error(
      "Arrival mileage must be strictly greater than departure mileage",
    );

    error.statusCode = 400;
    throw error;
  }

  return arrivalMileage - departureMileage;
};

const calculateAverageConsumption = (fuelConsumed, totalDistance) => {
  if (typeof fuelConsumed !== "number") {
    const error = new Error("Fuel consumed must be a number");

    error.statusCode = 400;
    throw error;
  }

  if (fuelConsumed < 0) {
    const error = new Error("Fuel consumed cannot be negative");

    error.statusCode = 400;
    throw error;
  }

  if (totalDistance <= 0) {
    const error = new Error("Total distance must be greater than zero");

    error.statusCode = 400;
    throw error;
  }

  // Liters per 100 km
  return (fuelConsumed / totalDistance) * 100;
};

const calculateTripMetrics = (
  departureMileage,
  arrivalMileage,
  fuelConsumed,
) => {
  const totalDistance = calculateDistance(departureMileage, arrivalMileage);

  const averageConsumption = calculateAverageConsumption(
    fuelConsumed,
    totalDistance,
  );

  return {
    totalDistance,
    averageConsumption,
  };
};

module.exports = {
  calculateDistance,
  calculateAverageConsumption,
  calculateTripMetrics,
};

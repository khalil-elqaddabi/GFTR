
const {
  calculateDistance,
  calculateAverageConsumption,
  calculateTripMetrics,
} = require("./mileageFuelService");

describe("calculateDistance", () => {
  test("calculates the distance correctly", () => {
    expect(calculateDistance(120000, 120500)).toBe(500);
  });

  test("rejects arrival mileage equal to departure mileage", () => {
    expect(() => calculateDistance(120000, 120000)).toThrow(
      "Arrival mileage must be strictly greater than departure mileage"
    );
  });

  test("rejects arrival mileage lower than departure mileage", () => {
    expect(() => calculateDistance(120500, 120000)).toThrow(
      "Arrival mileage must be strictly greater than departure mileage"
    );
  });

  test("rejects negative mileage", () => {
    expect(() => calculateDistance(-100, 100)).toThrow(
      "Mileage cannot be negative"
    );
  });

  test("rejects non-numeric mileage", () => {
    expect(() => calculateDistance("120000", 120500)).toThrow(
      "Departure and arrival mileage must be numbers"
    );
  });
});

describe("calculateAverageConsumption", () => {
  test("calculates consumption per 100 km", () => {
    expect(calculateAverageConsumption(75, 500)).toBe(15);
  });

  test("rejects negative fuel consumption", () => {
    expect(() => calculateAverageConsumption(-10, 500)).toThrow(
      "Fuel consumed cannot be negative"
    );
  });

  test("rejects zero distance", () => {
    expect(() => calculateAverageConsumption(75, 0)).toThrow(
      "Total distance must be greater than zero"
    );
  });

  test("rejects non-numeric fuel consumption", () => {
    expect(() => calculateAverageConsumption("75", 500)).toThrow(
      "Fuel consumed must be a number"
    );
  });
});

describe("calculateTripMetrics", () => {
  test("calculates distance and average consumption together", () => {
    expect(calculateTripMetrics(120000, 120500, 75)).toEqual({
      totalDistance: 500,
      averageConsumption: 15,
    });
  });

  test("rejects invalid mileage when calculating trip metrics", () => {
    expect(() => calculateTripMetrics(120500, 120000, 75)).toThrow(
      "Arrival mileage must be strictly greater than departure mileage"
    );
  });
});
